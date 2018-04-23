const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const isAdmin = require("../middlewares/isAdmin");
const uploadCloud = require("../config/cloudinary");
const User = require("../models/User");

/* GET profile page */
router.get("/", ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("user/profile", { user: req.user });
});

router.get("/edit/:id", isAdmin(), (req, res, next) => {
  const id = req.params.id;

  console.log("dentro");

  User.findById(id)
    .then(user => res.render("user/admin/edit", { user }))
    .catch(err => next(err));
});

router.get("/edit", ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("user/edit", { user: req.user });
});

router.post("/edit/:id", [isAdmin(), uploadCloud.single("photo")], (req, res, next) => {
  const id = req.params.id;

  console.log("==>"+req.file);

  User.findById(id)
    .then(user => { 
      user.fullName = req.body && req.body.fullName ? req.body.fullName : user.fullName;
      user.username = req.body && req.body.username ? req.body.username : user.username;
      user.email = req.body && req.body.email ? req.body.email : user.email;
      user.bootcamp = req.body && req.body.bootcamp ? req.body.bootcamp : user.bootcamp;
      user.imgName = req.file && req.file.originalname ? req.file.originalname : user.imgName;
      user.imgPath = req.file && req.file.url ? req.file.url : user.imgPath;

      user.save()
      .then( () => res.redirect("/user/list"))
      .catch( err => next(err))
    })
    .catch(err => next(err));
});

router.post(
  "/edit",
  [ensureLoggedIn("/auth/login"), uploadCloud.single("photo")],
  (req, res, next) => {
    req.user.fullName = req.body && req.body.fullName ? req.body.fullName : req.user.fullName;
    req.user.username = req.body && req.body.username ? req.body.username : req.user.username;
    req.user.email = req.body && req.body.email ? req.body.email : req.user.email;
    req.user.bootcamp = req.body && req.body.bootcamp ? req.body.bootcamp : req.user.bootcamp;
    req.user.imgName = req.file && req.file.originalname ? req.file.originalname : req.user.imgName;
    req.user.imgPath = req.file && req.file.url ? req.file.url : req.user.imgPath;

    req.user
      .save()
      .then(() => res.redirect("/user"))
      .catch(err => next(err));
  }
);

router.get("/list", isAdmin(), (req, res, next) => {
  User.find()
    .then(users => res.render("user/admin/list", { users }))
    .catch(err => next(err));
});

router.get("/delete/:id", isAdmin(), (req, res, next) => {
  const id = req.params.id;

  User.remove({ _id: id })
    .then(() => res.redirect("/user/list"))
    .catch(err => next(err));
});

module.exports = router;
