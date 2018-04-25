const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const Comments = require("../models/Comment");
const commentRoute = express.Router();
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");

// Saves comment to DB and adds to post
commentRoute.post("/add/:idPost", ensureLoggedIn(), (req, res, next) => {
  const { content } = req.body;
  const userComment = new Comments({
    content,
    author: req.user.id
  });

  userComment
    .save()
    .then(() => {
      Post.findById(req.params.idPost)
        .then(post => {
          post.comments.push(userComment._id);
          post
            .save()
            .then(() => {
              res.redirect(`/post/${req.params.idPost}`);
            })
            .catch(err => {
              res.render("error");
            });
        })
        .catch(err => {
          res.render("error");
        });
    })
    .catch(err => {
      res.render("error");
    });
});

module.exports = commentRoute;
