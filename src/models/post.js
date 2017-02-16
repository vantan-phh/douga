const db = require("../db");

class Post {
  static find(id) {
    return new Promsie((resolve, reject) => {
      let query = "SELECT * FROM `posts` WHERE `id` = ? LIMIT 1";

      db.query(query, [id], (err, res) {
        if(err) reject(err);
        if(!res.id) reject(new Error(`POST: ${id} is not found`));

        resolve(new Post(res));
      });
    });
  }

  static create(info) {
    return new Promise((resolve, reject) => {
      let query = "INSERT INTO `posts` (user_id, text, created_at) VALUES(?, ?, ?)";
      let insertData = [
        info.user_id,
        info.text,
        info.created_at
      ]

      db.query(query, insertData, (err, res) => {
        if(err) reject(err);

        resolve(new Post(res));
      });
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