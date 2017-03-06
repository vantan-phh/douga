const router = require("express").Router();
const User = require("../models/user");
const Post = require("../models/post");

router.get("/", (req, res) => {
  User.find(req.session.userId).then((user) => {
    res.render("home", {user: user});
  }).catch((err) => {
    console.error(err);
  });
});

router.post("/postsget", (req, res) => {
  User.find(req.session.userId).then((user) => {
    user.getTimeLine(req.body.lastId).then((data) => {
      res.send(data);
    }).catch((err) => {
      console.error(err);
    })
  }).catch((err) => {
    console.error(err);
  })
})

router.post("/posting", (req, res) => {
  Post.create({user_id: req.session.userId, text: req.body.text})
  .then((data) => {
    res.send(data);
  }).catch((err) => {
    console.error(err);
  });
});

module.exports = router;
