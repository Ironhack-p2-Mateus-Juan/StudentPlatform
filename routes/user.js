const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const isAdmin = require("../middlewares/isAdmin");
const uploadCloud = require("../config/cloudinary");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

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

//Admin route
router.post(
  "/edit/:id",
  [isAdmin(), uploadCloud.single("photo")],
  (req, res, next) => {
    const id = req.params.id;
    const password = req.body.password;

    User.findById(id)
      .then(user => {
        user.fullName = req.body.fullName ? req.body.fullName : user.fullName;
        user.username = req.body.username ? req.body.username : user.username;
        user.email = req.body.email ? req.body.email : user.email;
        user.bootcamp = req.body.bootcamp ? req.body.bootcamp : user.bootcamp;
        if (req.file) {
          user.imgName = req.file.originalname
            ? req.file.originalname
            : user.imgName;
          user.imgPath = req.file.url ? req.file.url : user.imgPath;
        }
        if (password) {
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);
          user.password = hashPass;
        }
        user
          .save()
          .then(() => res.redirect("/user/list"))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  }
);

//User route
router.post(
  "/edit",
  [ensureLoggedIn("/auth/login"), uploadCloud.single("photo")],
  (req, res, next) => {
    let user = req.user;
    const password = req.body.password;

    user.fullName = req.body.fullName ? req.body.fullName : user.fullName;
    user.username = req.body.username ? req.body.username : user.username;
    user.email = req.body.email ? req.body.email : user.email;
    user.bootcamp = req.body.bootcamp ? req.body.bootcamp : user.bootcamp;
    if (req.file) {
      user.imgName = req.file.originalname
        ? req.file.originalname
        : user.imgName;
      user.imgPath = req.file.url ? req.file.url : user.imgPath;
    }
    if (password) {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      user.password = hashPass;
    }

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

router.get("/remove-profile-pic/:id", ensureLoggedIn(), (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, { imgPath: "" })
    .then(() => {
      res.redirect("/");
    })
    .catch(() => res.render("error"));
});

module.exports = router;
