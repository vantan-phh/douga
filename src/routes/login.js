const router = require("express").Router();
const db = require("../db");
const User = require("../models/user");

router.get("/", (req, res) => {
  if(req.session.userId) res.redirect("/");

  res.render("login");
});


router.post("/", (req, res) => {
  if(!req.session.userId) {
    User.login(req.body)
    .then((userId) => {
      req.session.userId = userId;
    }).catch((err) => {
      if(err == "password is incorrect") {
        res.render("login", {err: "メールアドレスまたはパスワードが間違っています"});
      }
      console.error(err);
    });
  }

  res.redirect("/");
})
