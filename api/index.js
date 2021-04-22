const express = require('express');
const apiRouter = express.Router();

apiRouter.use(async (req, res, next) => {
   const prefix = 'Bearer '
   const auth = req.headers['Authorization'];
 
   if (!auth) {
     next(); // don't set req.user, no token was passed in
   }
 
   if (auth.startsWith(prefix)) {
     // recover the token
     const token = auth.slice(prefix.length);
     try {
       // recover the data
       const { id } = jwt.verify(data, 'secret message');
 
       // get the user from the database
       const user = await getUserById(id);
       // note: this might be a user or it might be null depending on if it exists
 
       // attach the user and move on
       req.user = user;
 
       next();
     } catch (error) {
        res.send({error})
        console.log(error)
       // there are a few types of errors here
     }
   }
 })

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const userPosts = require('./posts');
apiRouter.use('/posts', userPosts)

const userTags = require('./tags');
apiRouter.use('/tags', userTags);



module.exports = apiRouter;