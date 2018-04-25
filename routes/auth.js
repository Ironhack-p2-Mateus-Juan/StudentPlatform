require("dotenv").config();
const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const authRoutes = express.Router();
const ensureLoggedOut = require("../middlewares/ensureLoggedOut");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const nodemailer = require("nodemailer");

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
      const confirmationCode = encodeURIComponent(bcrypt.hashSync(email, salt));

      const newUser = new User({
        email,
        password: hashPass,
        confirmationCode
      });

      newUser.save(err => {
        if (err) {
          res.redirect("/");
        } else {
          const activationURL = `${
            process.env.HOST
          }/auth/confirm/${confirmationCode}`;

          const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: process.env.GMAILUSER,
              pass: process.env.GMAILPASS
            }
          });

          transporter
            .sendMail({
              from: process.env.GMAILUSER,
              to: email,
              subject: "Activate account",
              html: `<a href="${activationURL}">Activate account</a>`
            })
            .then(info => console.log(info))
            .catch(err => console.log(err));

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

authRoutes.get("/confirm/:confirmCode", (req, res, next) => {
  let confirmationCode = encodeURIComponent(req.params.confirmCode);

  User.findOneAndUpdate({ confirmationCode }, { isActive: true })
    .then(userActive => res.render("auth/confirmation", { userActive }))
    .catch(() => res.redirect("/"));
});

authRoutes.get("/logout", ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
