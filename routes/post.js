const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const postRoute = express.Router();

/* Show all posts */
postRoute.get("/", (req, res, next) => {
  Post.find()
    .populate("author")
    .exec((err, post) => {
      post.reverse();
      res.render("posts/index", { post });
    });
});

/* Create new post */
postRoute.get("/new", (req, res, next) => {
  res.render("posts/new");
});

postRoute.post("/new", (req, res, next) => {
  const user = req.user;
  const { title, type, content } = req.body;
  /* ========================== Verificar **imagePath** ====================== */
  const post = new Post({
    title,
    type,
    content,
    author: user.id
    /* imagePath: req.file.filename */
  });

  post
    .save()
    .then(() => {
      user.publications.push(post.id);
      user.save();
    })
    .catch(err => {
      res.render("error", err);
    });

  res.redirect("/post/new");
});

/* Update post */
postRoute.get("/edit", (req, res, next) => {
    User.findById(req.user.id)
    .populate("publications")
    .exec((err, user) => {
        console.log(user.publications);
      res.render("posts/edit", user);
    });
});

module.exports = postRoute;
