const express = require('express');
const Post = require('../models/Post');
const postRoute  = express.Router();


postRoute.get('/new', (req, res, next) => {
  res.render('posts/new');
});

postRoute.post('/new', (req, res, next) => {

    const user = req.user.id;
    const {title, type, content} = req.body;

    const post = new Post({
        title,
        type,
        content,
        author: user
    });

    res.redirect('/post/new');
});

module.exports = postRoute;