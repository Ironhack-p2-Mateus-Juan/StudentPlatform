const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const uploadCloud = require("../config/cloudinary");

/* GET profile page */
router.get("/", ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("user/profile", { user: req.user });
});

router.get("/edit", ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("user/edit", { user: req.user });
});

router.post(
  "/edit",
  [ensureLoggedIn("/auth/login"), uploadCloud.single("photo")],
  (req, res, next) => {
    user = req.user;
    const { fullName, username, email, bootcamp, password} = req.body;

    /* ====================== Remember to verify if empty fields in DOM are being updated in DB!! ====================== */
    const userUpdate = { fullName, username, email, bootcamp, password };

    if (req.file) {
      userUpdate.imgName = req.file.originalname;
      userUpdate.imgPath = req.file.url;
    }
    User.findByIdAndUpdate(user.id, userUpdate)
      .then(() => res.redirect("/user"))
      .catch(e => next(e));
  }
);

module.exports = router;
