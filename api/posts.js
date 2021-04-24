const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');
const { requireUser } = require('./utils');
const { createPost } = require('../db');

postsRouter.use((req, res, next) => {
   console.log("A request is being made to /posts");

   // res.send({ message: 'DevJobz GET Post request is being made to /posts!' });
   next();
});
postsRouter.get('/', async (req, res) => {
   const posts = await getAllPosts();

   res.send({
      message: 'DevJobz GET Post request is being made to /posts!',
      posts: posts
   })
   next();
});

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;
  const { username, id } = req.user
  const tagArr = tags.trim().split(/\s+/)
  const postData = {};

  // only send the tags if there are some to send
   if (tagArr.length) {
      postData.tags = tagArr;
   }

  try {
   // const _user = await getUserByUsername(req.user.username);
    // add authorId, title, content to postData object
    postData.authorId = id;
    postData.title = title;
    postData.content = content;
    postData.tags;

   // this will create the post and the tags for us
    const post = await createPost(postData);
  
    // if the post comes back, res.send({ post });
    if (post) {
       res.send({
         posts: post
       })
    } else {
       res.send({
          error: error + "No post were found"
       })
    }
    // otherwise, next an appropriate error object 
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;