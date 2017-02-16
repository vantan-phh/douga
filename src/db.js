const mysql = require("mysql2");

let db = mysql.createPool({
  connectionLimit : 10,
  host : "localhost",
  user : "root",
  database : "douga"
});

module.exports = db;
