const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const postRoute = express.Router();
const ensureLoggedOut = require("../middlewares/ensureLoggedOut");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");

/* Show all posts */
postRoute.get("/", ensureLoggedIn(), (req, res, next) => {
  Post.find()
    .populate("author")
    .exec((err, post) => {
      post.reverse();
      res.render("posts/index", { post });
    });
});

/* Create new post */
postRoute.get("/new", ensureLoggedIn(), (req, res, next) => {
  res.render("posts/new");
});

postRoute.post("/new", ensureLoggedIn(), (req, res, next) => {
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
postRoute.get("/edit", ensureLoggedIn(), (req, res, next) => {
  User.findById(req.user.id)
    .populate("publications")
    .exec((err, user) => {
      res.render("posts/edit", user);
    });
});

postRoute.get("/edit/:id", ensureLoggedIn(), (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      res.render("posts/update", post);
    })
    .catch(err => {
      res.render("error", err);
    });
});

postRoute.post("/edit/:id", ensureLoggedIn(), (req, res, next) => {
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

postRoute.get("/delete/:id", ensureLoggedIn(), (req, res, next) => {

  /* ==================== Falta: Borrar ID del post también del array "publications" de Usuario!!! ================== */

  Post.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/post/edit");
    })
    .catch(err => {
      res.render("error", err);
    });
});

module.exports = postRoute;
