const db = require("../db");

class User {
  static find(id) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM `users` WHERE `id` = ? LIMIT 1";

      db.query(query, [id], (err, res) => {
        if(err) reject(err);
        if(res.length == 0) reject(new Error(`ID: ${id} is not found`));

        resolve(new User(res));
      });
    });
  }

  static register(info) {
    return new Promise((resolve, reject) => {
      let query = "INSERT INTO `users` (mail, name, password, salt, created_at, update_at) VALUES(?, ?, ?, ?, ?)";
      let date = new Date();
      let salt = saltCreate();
      let password = hash(info.password, salt);

      let insertData = [
        info.mail,
        info.name,
        password,
        salt,
        date,
        date
      ];

      db.query(query, insertData, (err, res) => {
        if(err) reject(err);

        resolve(res.id);
      })
    })
  }

  static login(name, password) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM `users` WHERE name = ? LIMIT 1";

      db.query(query, [name], (err, res) => {
        if(err) reject(err);
        if(!res.id) reject("missing user account");

        password = hash(password, res.solt);

        if(password == res.password) {
          resolve(res.id);
        }else {
          reject("password is incorrect");
        }
      })
    })
  }

  constructor(parts) {
    this.id = parts.id;
    this.mail = parts.mail;
    this.name = parts.name;
    this.password = parts.password;
    this.salt = parts.salt;
    this.created_at = parts.created_at;
    this.updated_at = parts.updated_at;
  }

  fields() {
    return {
      mail: this.mail,
      name: this.name,
      password: this.password,
      salt: this.salt,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }

  update() {
    this.updated_at = new Date();

    return new Promise((resolve, reject) => {
      let query = "UPDATE `users` SET ? WHERE `id` = ? LIMIT 1";

      db.query(query, [this.fields(), this.id], (err, res) => {
        if(err) reject(err);

        resolve(this);
      });
    });
  }

  delete() {
    return new Promise((resolve, reject) => {
      let query = "DELETE FROM `users` WHERE `id` = ?";

      db.query(query, [this.id], (err, res) => {
        if(err) reject(err);

        resolve();
      })
    });
  }
}

module.exports = User;
