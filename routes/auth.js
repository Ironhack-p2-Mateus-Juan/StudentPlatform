const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const authRoutes = express.Router();
const ensureLoggedOut = require("../middlewares/ensureLoggedOut");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.redirect("/");
      return;
    } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        email,
        password: hashPass
      });

      newUser.save(err => {
        if (err) {
          res.redirect("/");
        } else {
          req.login(newUser, function(err) {
            if (!err) {
              res.redirect("/user");
            } else {
              res.render("error", err);
            }
          });
        }
      });
    }
  });
});

authRoutes.get("/logout", ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
