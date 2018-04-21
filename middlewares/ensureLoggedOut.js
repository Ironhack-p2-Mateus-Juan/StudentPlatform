const ensureLoggedOut = (redirectTo = "/") => (req, res, next) => {
  if(!req.user) {
    next();
  } else {
    res.redirectTo(redirectTo);
  }
}

module.exports = ensureLoggedOut;