const express = require('express');
const router  = express.Router();
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const uploadCloud = require("../config/cloudinary");

/* GET profile page */
router.get('/', ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render('user/profile', {user: req.user});
});

router.get("/edit", ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("user/edit", {user: req.user});
})

router.post("/edit", [ensureLoggedIn("/auth/login"), uploadCloud.single("photo")], (req, res, next) => {
  req.user.fullName = req.body.fullName;
  req.user.username = req.body.username;
  req.user.email = req.body.email;
  req.user.imgName = req.file.originalname;
  req.user.imgPath = req.file.url;

  req.user.save()
  .then( () => res.redirect("/user"))
  .catch( e => next(e) );
})

module.exports = router;