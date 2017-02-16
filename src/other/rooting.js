var app = require("express")();
var session = require("express-session");
var sessionCheck = require("./sessionCheck.js");

var routes = require("../routes");

app.use("/", routes.test);
//app.use("/home", sessionCheck, routes.home);

module.exports = app;
