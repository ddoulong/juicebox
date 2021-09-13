const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');
const { requireUser } = require('./utils');
const { createPost } = require('../db');

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;
    const { id } = req.user;

    const tagArr = tags.trim().split(/\s+/)
    const postData = {};

    if (tagArr.length) {
      postData.tags = tagArr;
    }
  
    try {
        postData.authorId = id;
        postData.title = title;
        postData.content = content;
      // add authorId, title, content to postData object
      const post = await createPost(postData);
      // this will create the post and the tags for us
      if (post) {
          res.send({post});
      } else {
        next({ 
            name: 'NoPostFound', 
            message: 'Something went wrong and the post could not be found.'
          });
      }
      // if the post comes back, res.send({ post });
      // otherwise, next an appropriate error object 
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();
  
    res.send({
      posts
    });
  });

module.exports = postsRouter;