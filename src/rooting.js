const app = require("express")();
const session = require("express-session");
const sessionCheck = require("./other/sessionCheck.js");

const routes = require("./routes");

app.use("/register", routes.register);
app.use("/login", routes.login);
app.use("/", routes.home);

module.exports = app;
