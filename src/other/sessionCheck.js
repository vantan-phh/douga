function sessionCheck(req, res, next) {
  if(req.session.userId) {
    next();
  }else {
    res.redirect("/register");
  }
}

module.exports = sessionCheck;
