const express = require('express')
const tagsRouter = express.Router();
const { 
   getAllTags,
   getPostsByTagName
} = require('../db');


tagsRouter.use((req, res, next) => {
   console.log("A request is being made to /tags")
   next();
});

tagsRouter.get('/', async (req, res) => {
   const tags = await getAllTags();

   res.send({
      message: "GET All-Tags request response:",
      tags: tags,
   })
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
   let taggedPosts;
   const { tagName } = req.params;
   try {
     const allTaggedPosts = await getPostsByTagName(tagName)
     if (req.user) {
      taggedPosts	= allTaggedPosts.filter(post => {
         return req.user && post.author.id === req.user.id
      });
   } else {
      taggedPosts = allTaggedPosts.filter(post => {
         return post.active
      });
   }

     res.send({
        posts: taggedPosts
     })
   } catch ({ name, message }) {
      next({name, message})
   }
 });

module.exports = tagsRouter;