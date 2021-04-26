// api/users.js
const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { requireUser } = require('./utils');
const { 
  getAllUsers,
  getUserById,
  updateUser,
  getUserByUsername,
  createUser
 } = require('../db');


usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");
  next();
});

usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
   message: 'Welcome Emmanuel, Server says hello from /users!',
   users: users
  });
});

usersRouter.post('/login', async (req, res, next) => {
const { username, password } = req.body;

// request must have both
   if (!username || !password) {
      next({
         name: "MissingCredentialsError",
         message: "Please supply both a username and password"
      });
   }

   try {
      const user = await getUserByUsername(username);

      if (user && user.password == password) {
         // create token & return to user
         const token = jwt.sign({id: user.id, username: user}, process.env.JWT_SECRET);

         res.send({ message: "You're logged in!", token: token });
      } else {
         next({ 
            name: 'IncorrectCredentialsError', 
            message: 'Username or password is incorrect'
         });
      }
      
   } catch(error) {
      console.log(error);
      next(error);

   }
});

usersRouter.post('/register', async (req, res, next) => {
   const { username, password, name, location } = req.body;
 
   try {
     const _user = await getUserByUsername(username);
 
     if (_user) {
       next({
         name: 'User-Exists Error',
         message: 'A user by that username already exists'
       });
     }
 
     const user = await createUser({
       username,
       password,
       name,
       location,
     });
 
     const token = jwt.sign({ 
       id: user.id, 
       username
     }, process.env.JWT_SECRET, {
       expiresIn: '1w'
     });
 
     res.send({ 
       message: "thank you for signing up",
       token 
     });
   } catch ({ name, message }) {
     next({ name, message })
   } 
});

usersRouter.delete('/:userId', requireUser, async (req, res, next) => {
  const { userId } = req.params;
  const { username, active } = req.user;
  try {
    const targetUser = await getUserById(userId);

    if ( !targetUser.active ) {
      res.send({
        name: 'InactiveUserError',
        message: 'This user has already been deleted'
      })
    } else if ( username !== targetUser.username) {
      res.send({
        name: 'Unauthorized User Error',
        message: 'You cannot delete a user-account that is not yours'
      })
    } else {
      const newFields = {active: false} 
      await updateUser(userId, newFields)
      res.send({
        name: "Success!",
        message: ` User: ${targetUser.username}, has been Deleted.`
      })
    }

  } catch ({ name, message }) {
    next({name, message})
  }
});

usersRouter.patch('/:userId', requireUser, async (req, res, next) => {
  console.log("Account re-activation request is being made..")
  const { userId } = req.params;
  const { id, active } = req.user;
  try {
    const targetUser = await getUserById(userId);

    if ( userId == id && !targetUser.active ) {
      const newFields = {active: true} 
      await updateUser(userId, newFields)
      res.send({
        name: "Success!",
        message: ` User: ${targetUser.username}, has been Reinstated.`
      })
    } else if (userId == id && active ) {
      res.send({
        name: "Active User Error",
        message: "This user is already active"
      })
    } else {
      console.log("...Authorization Error  " + id + " vs " + userId)
      res.send({
        name: "Authorization Error",
        message: "You can't reinstate a user-account that is not yours'"
      })
    }
  } catch ({name, message}) {
    next({name, message})
  }
});
module.exports = usersRouter;