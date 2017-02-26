const router = require("express").Router();
const db = require("../db");
const User = require("../models/user");

router.get("/", (req, res) => {
  if(req.session.userId) {
    res.redirect("/");
    return;
  }

  res.render("login");
});


router.post("/login", (req, res) => {
  if(req.session.userId) {
    res.redirect("/");
    return;
  }

  User.login(req.body)
  .then((userId) => {
    req.session.userId = userId;
    res.redirect("/");
  }).catch((err) => {
    if(err == "password is incorrect" || err == "missing user account") {
      res.render("login", {err: "メールアドレスまたはパスワードが間違っています"});
    }
    console.error(err);
    res.render("error")
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
})



module.exports = router;
