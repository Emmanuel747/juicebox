const express = require('express');
const apiRouter = express.Router();
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;

apiRouter.use(async (req, res, next) => {
   const auth = req.header('Authorization');
   const prefix = 'Bearer ';

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        if (!req.user) {
          next({
            name: "Token invalid Error",
            message: "Authorization Token is invalid or has expired"
          })
        }
        next();
      }

    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

apiRouter.use((req, res, next) => {
   if (req.user) {
     console.log("User is set:", req.user);
   }
 
   next();
}); 

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const userPosts = require('./posts');
apiRouter.use('/posts', userPosts)

const userTags = require('./tags');
apiRouter.use('/tags', userTags);

//-----Error Handler-----//
apiRouter.use((error, req, res, next) => {
   res.send(error);
});

module.exports = apiRouter;