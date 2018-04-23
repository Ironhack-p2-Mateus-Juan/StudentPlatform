const isAdmin = (redirectTo = "/") => (req, res, next) => {
  if( req.user && req.user.isAdmin ) {
    next();
  } else {
    res.redirect(redirectTo);
  }
}

module.exports = isAdmin;