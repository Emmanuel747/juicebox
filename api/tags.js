const express = require('express')
const tagsRouter = express.Router();
const { getAllTags } = require('../db');


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

module.exports = tagsRouter;