const express = require('express');
const tagsRouter = express.Router();
const { getAllTags } = require('../db');
const {getPostsByTagName} = require('../db')

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to ");

  next();
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagName from the params
  const tagName = req.params.tagName;
  try {
    
    // use our method to get posts by tag name from the db
    // send out an object to the client { posts: // the posts }

    const tag = await getPostsByTagName(tagName);

    // UPDATE GET /api/tags/:tagName/posts
    // You should now update this method to filter out any posts which are both inactive and not owned by the current user.
    // const posts = allPosts.filter(post => {
    //   return post.active || (req.user && post.author.id === req.user.id);
    // });

    res.send(tag);
  } catch ({ name, message }) {
    next({ 
      name: 'TagError', 
      message: 'Something went wrong.'
    });
  }
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
  
    res.send({
      tags
    });
  });

module.exports = tagsRouter;