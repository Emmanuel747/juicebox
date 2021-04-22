const express = require('express');
const apiRouter = express.Router();

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const userPosts = require('./posts');
apiRouter.use('/posts', userPosts)

const userTags = require('./tags');
apiRouter.use('/tags', userTags);



module.exports = apiRouter;