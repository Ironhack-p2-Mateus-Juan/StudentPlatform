const express = require("express");
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
  const { title, type, content } = req.body;
  /* ========================== Verificar **imagePath** ====================== */
  const post = new Post({
    title,
    type,
    content,
    author: req.user.id
    /* imagePath: req.file.filename */
  });

  post
    .save()
    .then(() => {
      console.log("Post saved in DB");
    })
    .catch(err => {
      res.render("error", err);
    });

  res.redirect("/post/new");
});


/* Update post */
postRoute.get("/update", (req, res, next) => {

    

    res.render("posts/update");
  });



module.exports = postRoute;
