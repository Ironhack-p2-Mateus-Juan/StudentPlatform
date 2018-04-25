const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const postRoute = express.Router();
const ensureLoggedOut = require("../middlewares/ensureLoggedOut");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const uploadCloud = require("../config/cloudinary");

// Show all posts
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

// Create new post
postRoute.get("/new", ensureLoggedIn(), (req, res, next) => {
 res.render("posts/new");
});

postRoute.post("/new", [ensureLoggedIn(), uploadCloud.single("image")], (req, res, next) => {
 const user = req.user;
 const { title, type, content } = req.body;
 const imagePath = req.file ? req.file.url : "";

 content.length > 200
   ? (thumb = content.slice(0, 200) + "...")
   : (thumb = content);

 const post = new Post({
   title,
   type,
   content,
   thumb,
   author: user.id,
   imagePath
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

// Update post
postRoute.get("/edit", ensureLoggedIn(), (req, res, next) => {
 let userPosts = [];

 Post.find()
   .populate("author")
   .then(publications => {
     publications.forEach(post => {
       if (post.author.id === req.user.id) {
         userPosts.push(post);
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

postRoute.post("/edit/:id", [ensureLoggedIn(), uploadCloud.single("image")], (req, res, next) => {
 const { title, content } = req.body;
 const imagePath = req.file ? req.file.url : "";
 console.log(req.file);
 const update = { title, content, imagePath };

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

// Delete post
postRoute.get("/delete/:id", ensureLoggedIn(), (req, res, next) => {
 let postToRemove = req.params.id;

 Post.findByIdAndRemove(postToRemove)
   .then(() => res.redirect("/post/edit"))
   .catch(err => {
     res.render("error");
   });
});

// Read individual post
postRoute.get("/:id", ensureLoggedIn(), (req, res, next) => {
 Post.findById(req.params.id)
   .populate("author")
   .populate({ path: "comments", populate: { path: "author" } })
   .then(post => {
     res.render("posts/read", { post });
   });
});

module.exports = postRoute;