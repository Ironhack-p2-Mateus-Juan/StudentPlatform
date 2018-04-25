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
    .then(publication => {
      publication.reverse();
      res.render("posts/index", { publication });
    })
    .catch(() => {
      res.render("error");
    });
});

/* Create new post */
postRoute.get("/new", ensureLoggedIn(), (req, res, next) => {
  res.render("posts/new");
});

postRoute.post("/new", ensureLoggedIn(), (req, res, next) => {
  const user = req.user;
  const { title, type, content } = req.body;

  content.length > 200
    ? (thumb = content.slice(0, 200) + "...")
    : (thumb = content);

  /* ========================== Verificar **imagePath** ====================== */
  const post = new Post({
    title,
    type,
    content,
    thumb,
    author: user.id
    //imagePath: req.file.filename
  });

  post
    .save()
    .then(() => {
      res.redirect("/post");
    })
    .catch(err => {
      res.render("error");
    });
});

/* Update post */
postRoute.get("/edit", ensureLoggedIn(), (req, res, next) => {
  let userPosts = [];

  Post.find()
    .populate("author")
    .then(publications => {
      publications.forEach(post => {
        if (post.author.id === req.user.id) {
          userPosts.push(post)
        }
      });
      userPosts.sort().reverse();
      res.render("posts/edit", { userPosts });
    })
    .catch(() => res.render("error"));
});

postRoute.get("/edit/:id", ensureLoggedIn(), (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      res.render("posts/update", { post });
    })
    .catch(err => {
      res.render("error");
    });
});

postRoute.post("/edit/:id", ensureLoggedIn(), (req, res, next) => {
  const { title, content } = req.body;
  const update = { title, content };

  content.length > 200
    ? (thumb = content.slice(0, 200) + "...")
    : (thumb = content);

  update.thumb = thumb;

  Post.findByIdAndUpdate(req.params.id, update)
    .then(post => {
      res.redirect("/post");
    })
    .catch(err => {
      res.render("error");
    });
});

/* Delete post */
postRoute.get("/delete/:id", ensureLoggedIn(), (req, res, next) => {
  let postToRemove = req.params.id;

  Post.findByIdAndRemove(postToRemove)
    .then(() => res.redirect("/post/edit"))
    .catch(err => {
      res.render("error");
    });
});

postRoute.get("/:id", ensureLoggedIn(), (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      res.render("posts/read", { post });
    })
    .catch(err => {
      res.render("error");
    });
});

module.exports = postRoute;
