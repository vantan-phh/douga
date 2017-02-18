var crypto = require("crypto");

var string = "qwertyuiopasdfghjklzxcvbnm1234567890";

function hashed(password, salt) {
  var sha256 = crypto.createHash("sha256");
  sha256.update(password + salt);
  return sha256.digest("hex");
}

module.exports = hashed;
