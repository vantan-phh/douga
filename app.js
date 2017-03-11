const express = require("express");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const http = require("http");

const rooting = require("./src/rooting");
const peerServer = require("./src/other/peerServer");

let app = express();
let server = http.createServer(app);

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
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(rooting);

process.on('uncaughtException', function(err) {
  console.error(err);
});

var listened = app.listen(process.env.PORT || 3000, '0.0.0.0');
app.use("/api", peerServer(listened));

app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error(err);
  res.render("error");
});

module.exports = server;
