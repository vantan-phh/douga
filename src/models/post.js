const db = require("../db");
const User = require("./user");
const elasticSearchClient = require("../other/elasticServer.js");

class Post {
  static find(id) {
    return new Promsie((resolve, reject) => {
      let query = "SELECT * FROM `posts` WHERE `id` = ? LIMIT 1";

      db.query(query, [id], (err, res) => {
        if(err) reject(err);
        if(!res[0].id) reject(new Error(`POST: ${id} is not found`));

        resolve(new Post(res[0]));
      });
    });
  }

  static create(info) {
    return new Promise((resolve, reject) => {

      User.publicFind(info.user_id).then((user) => {
        let query = "INSERT INTO `posts` (user_id, text, created_at) VALUES(?, ?, ?)";
        let date = new Date();
        let insertData = [
          info.user_id,
          info.text,
          date
        ];

        db.query(query, insertData, (err, res) => {
          if(err) reject(err);

          elasticSearchClient.index("paku", "posts", {
            id: res.insertId,
            text: info.text
          })
          .on("data", (data) => {
            resolve({id: res.insertId, user_id: info.user_id, text: info.text, user: user, created_at: date});
          }).exec();
        });
      }).catch((err) => {
        reject(err);
      })
    })
  }

  constructor(parts) {
    this.id = parts.id;
    this.user_id = parts.user_id;
    this.text = parts.text;
    this.created_at = parts.created_at;
  }

  delete() {
    return new Promise((resolve, reject) => {
      let query = "DELETE FROM `posts` WHERE `id` = ?";

      db.query(query, [this.id], (err, res) => {
        if(err) reject(err);

        resolve();
      });
    });
  }
}

module.exports = Post;
