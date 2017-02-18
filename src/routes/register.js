const router = require("express").Router();
const db = require("../db");
const User = require("../models/user");

router.get("/", (req, res) => {
  if(req.session.userId) res.redirect("/");

  res.render("register");
});

router.post("/", (req, res) => {
  if(!req.session.userId) {
    User.register(req.body)
    .then((userId) => {
      req.session.userId = userId;
    }).catch((err) => {
      console.error(err);
    });
  }

  res.redirect("/");
})

module.exports = router;
