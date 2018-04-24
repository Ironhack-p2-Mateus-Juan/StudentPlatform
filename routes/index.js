const express = require("express");
const ensureLoggedOut = require("../middlewares/ensureLoggedOut");
const router = express.Router();

router.get("/", ensureLoggedOut("/user"), (req, res, next) => {
  res.render("index", { user: req.user });
});

router.get("/about", (req, res, next) => {
  res.render("about", { user: req.user });
})

module.exports = router;
