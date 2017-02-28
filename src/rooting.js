const app = require("express")();
const session = require("express-session");
const sessionCheck = require("./other/sessionCheck.js");

const routes = require("./routes");

app.use("/register", routes.register);
app.use("/session", routes.session);
app.use("/", sessionCheck, routes.home);
app.use("/search", routes.search);

module.exports = app;
