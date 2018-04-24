const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const isAdmin = require("../middlewares/isAdmin");
const uploadCloud = require("../config/cloudinary");
const User = require("../models/User");

/* GET profile page */
router.get("/", ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("user/profile");
});

router.get("/edit/:id", isAdmin(), (req, res, next) => {
  const id = req.params.id;

  User.findById(id)
    .then(user => res.render("user/admin/edit"))
    .catch(err => next(err));
});

router.get("/edit", ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("user/edit");
});

router.post(
  "/edit/:id",
  [isAdmin(), uploadCloud.single("photo")],
  (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    const file = req.file;

    console.log("==>" + file);

    User.findById(id)
      .then(user => {
        (user.fullName = body && body.fullName) ? body.fullName : user.fullName;
        (user.username = body && body.username) ? body.username : user.username;
        (user.email = body && body.email) ? body.email : user.email;
        (user.bootcamp = body && body.bootcamp) ? body.bootcamp : user.bootcamp;
        (user.imgName = file && file.originalname)
          ? file.originalname
          : user.imgName;
        (user.imgPath = file && file.url) ? file.url : user.imgPath;

        user
          .save()
          .then(() => res.redirect("/user/list"))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  }
);

router.post(
  "/edit",
  [ensureLoggedIn("/auth/login"), uploadCloud.single("photo")],
  (req, res, next) => {
    const user = req.user;
    const body = req.body;
    const file = req.file;

    (user.fullName = body && body.fullName) ? body.fullName : user.fullName;
    (user.username = body && body.username) ? body.username : user.username;
    (user.email = body && body.email) ? body.email : user.email;
    (user.bootcamp = body && body.bootcamp) ? body.bootcamp : user.bootcamp;
    (user.imgName = file && file.originalname)
      ? file.originalname
      : user.imgName;
    (user.imgPath = file && file.url) ? file.url : user.imgPath;

    user
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

router.post("/remove-profile-pic/:id", ensureLoggedIn(), (req, res, next) => {
  user.imgPath = "";
  user
    .save()
    .then(() => {
      res.redirect("/user/edit");
    })
    .catch(() => res.render("error"));
});

module.exports = router;
