const router = require("express").Router();
const User = require("../models/user");
const Post = require("../models/post");

let userStatus = {};
let callUser = {};
let disconnection = {};

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

router.post("/connection", (req, res) => {
  userStatus[req.session.userId] = req.body.time;

  if(disconnection[req.session.userId]) {
    res.status(200).send({fail: true});

    disconnection[req.session.userId] = null;

  }else if(callUser[req.session.userId]){
    res.status(200).send({callUser: callUser[req.session.userId]});

    callUser[req.session.userId] = null;
  }else {
    res.send();
  }
});

router.post("/call", (req, res) => {
  let targetId = Number(req.body.target);
  let date = Date.parse(new Date);

  User.find(req.session.userId).then((user) => {
    if(userStatus[targetId] && date - userStatus[targetId] < 10000) {
      callUser[targetId] = {peerId: req.body.peerId, name: user.name, id: user.id};
      res.send();
    }else {
      res.send("fail");
    }
  });
});

router.post("/disconnection", (req, res) => {
  disconnection[req.body.userId] = true;
})

module.exports = router;
