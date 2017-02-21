const router = require("express").Router();
const server = require("../../app");
const Post = require("../models/post");

router.get("/", (req, res) => {
  res.render("home");
});

router.post("/posting", (req, res) => {
  Post.create({user_id: req.session.userId, text: req.body.text})
  .then((data) => {
    res.send(JSON.stringify(data));
  }).catch((err) => {
    console.error(err);
  });
});

module.exports = router;
