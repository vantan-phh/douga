const router = require("express").Router();
const db = require("../db");
const User = require("../models/user");

router.get("/", (req, res) => {
  if(req.session.userId) {
    res.redirect("/");
    return;
  }

  res.render("register");
});

router.post("/", (req, res) => {
  if(req.session.userId) {
    res.redirect("/");
    return;
  }

  User.register(req.body)
  .then((userId) => {
    req.session.userId = userId;
    res.redirect("/");
  }).catch((err) => {
    console.error(err);
  });
})

module.exports = router;
