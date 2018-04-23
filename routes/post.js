const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const postRoute = express.Router();
const ensureLoggedOut = require("../middlewares/ensureLoggedOut");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");

/* Show all posts */
postRoute.get("/", ensureLoggedIn(), (req, res, next) => {
  User.find()
    .populate("publications")
    .exec((err, users) => {
      res.render("posts/index", { users, user: req.user });
    });
});

/* Create new post */
postRoute.get("/new", ensureLoggedIn(), (req, res, next) => {
  res.render("posts/new", { user: req.user });
});

postRoute.post("/new", ensureLoggedIn(), (req, res, next) => {
  const user = req.user;
  const { title, type, content } = req.body;

  /* ========================== Verificar **imagePath** ====================== */
  const post = new Post({
    title,
    type,
    content,
    thumb: content.slice(0, 200) + "..."
    /*
    * author: user.id
    *
    * Uncomment below when ready for integrating with users */
    //imagePath: req.file.filename
  });

  console.log(post.thumb);
  post
    .save()
    .then(() => {
      console.log("entra");
      user.publications.push(post.id);
      user.save();
    })
    .catch(err => {
      res.render("error", { user: req.user });
    });

  res.redirect("/post");
});

/* Update post */
postRoute.get("/edit", ensureLoggedIn(), (req, res, next) => {
  User.findById(req.user.id)
    .populate("publications")
    .exec((err, all) => {
      res.render("posts/edit", { all, user: req.user });
    });
});

postRoute.get("/edit/:id", ensureLoggedIn(), (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      res.render("posts/update", { post, user: req.user });
    })
    .catch(err => {
      res.render("error", { user: req.user });
    });
});

postRoute.post("/edit/:id", ensureLoggedIn(), (req, res, next) => {
  const { title, type, content } = req.body;
  const update = { title, type, content };

  Post.findByIdAndUpdate(req.params.id, update)
    .then(post => {
      res.redirect("/post");
    })
    .catch(err => {
      res.render("error", { user: req.user });
    });
});

/* Delete post from both collections: Post and User */
postRoute.get("/delete/:id", ensureLoggedIn(), (req, res, next) => {
  let postToRemove = req.params.id;

  Post.findByIdAndRemove(postToRemove)
    .then(() => {
      User.update(
        { _id: req.user.id },
        { $pullAll: { publications: [postToRemove] } }
      )
        .then(() => {
          res.redirect("/post/edit");
        })
        .catch(err => {
          res.render("error", { user: req.user });
        });
    })
    .catch(err => {
      res.render("error", { user: req.user });
    });
});

postRoute.get("/:id", ensureLoggedIn(), (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      res.render("posts/read", {post, user:req.user});
    })
    .catch(err => {
      res.render("error", { user: req.user });
    });
});

module.exports = postRoute;
