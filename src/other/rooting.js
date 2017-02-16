const app = require("express")();
const session = require("express-session");
const sessionCheck = require("./sessionCheck.js");

const routes = require("../routes");

app.use("/", routes.test);
//app.use("/home", sessionCheck, routes.home);

module.exports = app;
