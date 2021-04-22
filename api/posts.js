const express = require('express');
const { getAllPosts } = require('../db');
const userRouter = express.Router();

userRouter.use((req, res, next) => {
   console.log("A request is being made to /posts");

   // res.send({ message: 'DevJobz GET Post request is being made to /posts!' });
   next();
});
userRouter.get('/', async (req, res) => {
   const posts = await getAllPosts();

   res.send({
      message: 'DevJobz GET Post request is being made to /posts!',
      posts: posts
   })
})

module.exports = userRouter;