const express = require('express');
const postsRouter = express.Router();
const { requireUser, requireActiveUser } = require('./utils');
const { 
   getAllPosts, 
   createPost, 
   updatePost, 
   getPostById 
} = require('../db');

//Middleware
postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");
  next();
});

postsRouter.get('/', async (req, res) => {
	let posts;
	try {
		const allPosts = await getAllPosts();

		if (req.user) {
			posts	= allPosts.filter(post => {
				return req.user && post.author.id === req.user.id
			});
		} else {
			posts = allPosts.filter(post => {
				return post.active && post.author.active
			});
		}
    res.send({
      name: "All Post Requested...",
      posts: posts[0] ? posts : "ERROR: No valid posts to display"
    });
   
	} catch ({ name, message }) {
    next({ name, message });
	}
});

postsRouter.post('/', requireUser, requireActiveUser, async (req, res, next) => {
  console.log('I am running')
  const { title, content, tags = "" } = req.body;
  const {  id } = req.user
  const tagArr = tags.trim().split(/\s+/)
  const postData = {
			authorId: id,
			title: title,
			content: content
		};

   if (tagArr.length) {
      postData.tags = tagArr;
   }

  try {
    if ( !postData.title || !postData.content || !postData.tags ) {
      next({
        name: "Post Syntax Error",
        message: "Below is message breakdown",
        title: "title: " + postData.title
      })
    }
    const post = await createPost(postData);
    if (post) {
      res.send({
        message: `Success! Post - ${postData.title}, created.`,
        posts: post
      })
		}
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
   const { postId } = req.params;
   const { title, content, tags } = req.body;
 
   const updateFields = {};
 
   	if (tags && tags.length > 0) {
     updateFields.tags = tags.trim().split(/\s+/);
   	}

   	if (title) {
     updateFields.title = title;
   	}

   	if (content) {
     updateFields.content = content;
   	}
 
   	try {
     const originalPost = await getPostById(postId);
 
     if (originalPost.author.id === req.user.id) {
       const updatedPost = await updatePost(postId, updateFields);
       res.send({ post: updatedPost })
     } else {
       	next({
         name: 'UnauthorizedUserError',
         message: 'You cannot update a post that is not yours'
       	})
     }
   	} catch ({ name, message }) {
     next({ name, message });
    }
});

postsRouter.delete('/:postId', requireUser, requireActiveUser, async (req, res, next) => {
   try {
     const post = await getPostById(req.params.postId);
 
     if (post && post.author.id === req.user.id) {
       const updatedPost = await updatePost(post.id, { active: false });
 
       res.send({ post: updatedPost });
      } else {
       next(post ? { 
         name: "UnauthorizedUserError",
         message: "You cannot delete a post which is not yours"
       } : {
         name: "PostNotFoundError",
         message: "That post does not exist"
       });
      }
    } catch ({ name, message }) {
     next({ name, message })
    }
 });

module.exports = postsRouter;