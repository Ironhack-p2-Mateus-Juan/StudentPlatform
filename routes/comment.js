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

// Update comment
commentRoute.post("/edit/:id", ensureLoggedIn(), (req, res, next) => {
  const { content } = req.body;

  Comments.findById(req.params.id)
    .then(userComm => {
      if (req.user.id == userComm.author) {
        userComm
          .update({ content })
          .then(() => {
            res.redirect("back");
          })
          .catch(err => {
            res.render("error");
          });
      } else {
        res.render("error");
      }
    })
    .catch(err => {
      res.render("error");
    });
});

// Delete comment
commentRoute.post("/delete/:id/:postId", ensureLoggedIn(), (req, res, next) => {
  Comments.findById(req.params.id)
    .then(userComm => {
      if (req.user.id == userComm.author) {
        userComm.remove({});
        Post.findById(req.params.postId)
          .then(post => {
            post.comments.splice(post.comments.indexOf(req.params.id, 1));
            post
              .save()
              .then(() => {
                res.redirect("back");
              })
              .catch(err => {
                res.render("error");
              });
          })
          .catch(err => {
            res.render("error");
          });
      } else {
        res.render("error");
      }
    })
    .catch(err => {
      res.render("error");
    });
});

module.exports = commentRoute;
