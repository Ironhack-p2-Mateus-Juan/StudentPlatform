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
      res.render("posts/edit", user);
    });
});

postRoute.get("/edit/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      res.render("posts/update", post);
    })
    .catch(err => {
      res.render("error", err);
    });
});

postRoute.post("/edit/:id", (req, res, next) => {
  const { title, type, content } = req.body;
  const update = { title, type, content };

  Post.findByIdAndUpdate(req.params.id, update)
    .then(post => {
      console.log(post);
      res.redirect("/post");
    })
    .catch(err => {
      res.render("error", err);
    });
});

postRoute.get("/delete/:id", (req, res, next) => {
  Post.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/post/edit");
    })
    .catch(err => {
      res.render("error", err);
    });
});

module.exports = postRoute;
