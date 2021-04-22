// api/users.js
const express = require('express');
const usersRouter = express.Router();

const { getAllUsers } = require('../db');

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

//   res.send({ message: 'Welcome Emmanuel, Server says hello from /users!' });
  next(); // THIS IS DIFFERENT
});
usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
   message: 'Welcome Emmanuel, Server says hello from /users!',
   users: users
  });
});


module.exports = usersRouter;