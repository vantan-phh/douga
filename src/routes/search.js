const router = require("express").Router();
const User = require("../models/user")
const Post = require("../models/post");

router.post("/", (req, res) => {
  User.find(req.session.userId).then((user) => {
    res.render("search", {user: user, searchText: req.body.text});
  })
})

router.post("/update", (req, res) => {
  Post.search(req.body).then((posts) => {
    res.send({posts: posts})

  }).catch((err) => {
    console.error(err);
  });
});

module.exports = router;
