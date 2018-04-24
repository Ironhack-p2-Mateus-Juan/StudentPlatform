const express = require("express");
const router = express.Router();
const ensureLoggedOut = require("../middlewares/ensureLoggedOut");

router.get("/", ensureLoggedOut("/user"), (req, res, next) => {
  res.render("index");
});

module.exports = router;
