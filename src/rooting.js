const app = require("express")();
const session = require("express-session");
const sessionCheck = require("./sessionCheck.js");

const routes = require("./routes");

// app.use("/call", sessionCheck, routes.topPage);
app.use("/register", routes.register);
app.use("login", routes.login);
app.use("/", sessionCheck, routes.topPage);


module.exports = app;
