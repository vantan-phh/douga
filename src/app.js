const express = require("express");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const socket = require("socket.io");
const debug = require("debug")("douga:server");
const http = require("http");

const rooting = require("./other/rooting");
const peerServer = require("./other/peerServer");

let app = express();

let server = http.createServer(app);

let io = socket(server);

module.exports = io;

server.listen(process.env.PORT || 3000);
server.on("error", onError);
server.on("listening", onListening);

app.set("views", __dirname + "/views");
app.set("view engine", "jade");

let option = {
  host: "localhost",
	port: 3306,
	user: "root",
	database: "douga"
};

app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(option),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  }
}));

//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(rooting);
app.use(peerServer);

app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});



process.on('uncaughtException', function(err) {
  console.error(err);
});

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") throw error;

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  debug("Listening on " + bind);
}