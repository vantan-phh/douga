let router = require("express").Router();
let io;

router.get("/", (req, res) => {
  if(!io) {
    io = require("../../app");
  }
  socketStart();
  res.render("test");
});

function socketStart() {
  io.sockets.on("connection", (socket) => {

  });
}

module.exports = router;
