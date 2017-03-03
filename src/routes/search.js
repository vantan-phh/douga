const router = require("express").Router();
const User = require("../models/user")
const Post = require("../models/post");

router.post("/", (req, res) => {
  Post.search(req.body.text).then((posts) => {
    User.find(req.session.userId).then((user) => {
      res.render("search", {posts: posts, user: user});
    })
  }).catch((err) => {
    console.error(err);
  })
})

module.exports = router;
