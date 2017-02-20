const router = require("express").Router();
const server = require("../../app");

router.get("/", (req, res) => {
  res.render("home");
});

module.exports = router;
