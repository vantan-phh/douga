const router = require("express").Router();
const socket = require("socket.io");
const server = require("../../app");

let io = socket(server);

router.get("/", (req, res) => {
  res.render("home");
});

io.sockets.on("connection", (socket) => {
  console.log("a");
});

module.exports = router;
