const router = require("express").Router();
const server = require("../../app");
const User = require("../models/user")
const Post = require("../models/post");
const fs = require("fs");

let filePath = "/Users/qazwsxedcrfvtgbyhnujmikol/src/github.com/myApp/douga/";

router.get("/", (req, res) => {
  User.find(req.session.userId).then((user) => {
    user.getTimeLine().then((data) => {
      res.render("home", {posts: data});
    }).catch((err) => {
      console.error(err);
    });
  }).catch((err) => {
    console.error(err);
  });
});

router.post("/posting", (req, res) => {
  Post.create({user_id: req.session.userId, text: req.body.text})
  .then((data) => {
    res.send(JSON.stringify(data));
  }).catch((err) => {
    console.error(err);
  });
});

router.get("/profile_image/:image_name", (req, res) => {
  fs.readFile(`${filePath}/public/images/${req.params.image_name}`, (err, image) => {
    if(err) {
      console.error(err);
      return;
    }

    res.set("Content-Type", "image/png");
    res.send(image);
  });
});

module.exports = router;
