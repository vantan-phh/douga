const router = require("express").Router();
const User = require("../models/user");
const Post = require("../models/post");

router.get("/:id", (req, res) => {
  User.find(req.params.id).then((target) => {
    User.find(req.session.userId).then((user) => {
      if(!target) {
        res.render("injustice", {err: "このプロフィールは観覧できません"});
        return;
      }

      res.render("profile", {target: target, user: user});

    }).catch((err) => {
      console.error(err);
    });

  }).catch((err) => {
    console.error(err);
  });
});

module.exports = router;
