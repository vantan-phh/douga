var router = require("express").Router();
var io;

router.get("/", function(req, res) {
  if(!io) {
    io = require("../app.js");
  }
  socketStart();
  res.render("test");
});

function socketStart() {
  io.sockets.on("connection", function(socket) {

  });
}

module.exports = router;
