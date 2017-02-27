const db = require("../db");
const hashCreate = require("../other/hashCreate");
const saltCreate = require("../other/saltCreate");

class User {
  static find(id) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM `users` WHERE `id` = ? LIMIT 1";

      db.query(query, [id], (err, res) => {
        if(err) reject(err);
        if(res.length == 0) reject(new Error(`ID: ${id} is not found`));

        resolve(new User(res[0]));
      });
    });
  }

  static publicFind(id) {
    return new Promise((resolve, reject) => {
      User.find(id).then((user) => {
        let publicUser = {
          id: user.id,
          name: user.name,
          follow_count: user.follow_count,
          follower_count: user.follower_count
        };
        resolve(publicUser);

      }).catch((err) => {
        reject(err)
      })
    })
  }

  static register(info) {
    return new Promise((resolve, reject) => {
      let query = "INSERT INTO `users` SET ?";
      let date = new Date();
      let salt = saltCreate();
      let password = hashCreate(info.password, salt);
      let icon = "undefined";

      let insertData = [
        info.email,
        info.userName,
        password,
        salt,
        icon,
        0,
        0,
        date,
        date
      ];

      db.query(query, insertData, (err, res) => {
        if(err) reject(err);
        resolve(res.insertId);
      })
    })
  }

  static login(info) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM `users` WHERE mail = ? LIMIT 1";

      db.query(query, [info.email], (err, res) => {
        if(err) reject(err);
        if(!res[0].id) reject("missing user account");

        let password = hashCreate(info.password, res[0].salt);

        if(password == res[0].password) {
          resolve(res[0].id);
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
    this.follow_count = parts.follow_count;
    this.follower_count = parts.follower_count;
    this.created_at = parts.created_at;
    this.updated_at = parts.updated_at;
  }

  fields() {
    return {
      mail: this.mail,
      name: this.name,
      password: this.password,
      salt: this.salt,
      follow_count: this.follow_count,
      follower_count: this.follower_count,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }

  finds(ids) {
    return new Promise((resolve, reject) => {
      if(!ids[0]) {
        resolve([]);
        return
      }
      ids.push(ids.length);

      let query = "SELECT * FROM `users` WHERE IN (?"

      for(var i = 0; i < ids.length; i++) query += ",?";
      query += ") LIMIT ?";

      db.query(query, ids, (err, res) => {
        if(err) reject(err);
        resolve(res)
      })
    })
  }

  followUser() {
    return new Promise((resolve, reject) => {
      let query = "SELECT `target_id` FROM `to_follow` WHERE `follower_id` = ? LIMIT ?";

      db.query(query, [this.id, this.follow_count], (err, res) => {
        if(err) reject(err);
        let targetId = [];

        for(var i = 0; i < res.length; i++) {
          targetId.push(res.target_id);
        }

        this.finds(targetId).then((data) => {
          resolve({data: data, ids: targetId});
        }).catch((err) => {
          reject(err);
        })
      })
    })
  }

  getTimeLine() {
    return new Promise((resolve, reject) => {

      this.followUser().then((result) => {
        let data = result.data;
        let ids = result.ids;

        User.publicFind(this.id).then((user) => {
          data.push(user);
          ids.push(this.id);

          var usersData = {};

          for(var i = 0; i < data.length; i++) {
            usersData[data[i].id] = data[i];
          }
          let query = "SELECT * FROM `posts` WHERE `user_id` IN (?";

          for(var i = 0; i < data.length - 1; i++) query += ",?";
          query += ")";

          db.query(query, ids, (err, res) => {
            if(err) reject(err);
            for(var i = 0; i < res.length; i++){
              res[i].user = usersData[res[i].user_id];
            }
            resolve(res)
          })

        }).catch((err) => {
          console.error(err);
        })

      }).catch((err) => {
        console.error(err);
      })
    })
  }

  whatFollow(targetId) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM `to_follow` WHERE follower_id = ? & target_id = ? LIMIT 1";

      db.query(query, [this.id, target_id], (err, res) => {
        if(err) reject(err);
        resolve(data);
      })
    })
  }

  toFollow(targetId) {
    return new Promise((resolve, reject) => {
      this.whatFollow(targetId).then((data) => {
        if(!data[0]) {
          let query = "INSERT INTO `to_follow` (follower_id, target_id) SET ?";
          let insertData = [{
            follower_id: this.id,
            target_id: targetId
          }]

          db.query(query, insertData, (err, res) => {
            if(err) reject(err);
            resolve(true);
          })
        }
        resolve(false);
      })
    })
  }

  unFollow(targetId) {
    return new Promise((resolve, reject) => {
      this.whatFollow(targetId).then((data) => {
        if(data[0]) {
          let query = "DELETE FROM `to_follow` WHERE follower_id = ?, target_id = ?";

          db.query(query, [this.id, targetId], (err, res) => {
            if(err) reject(err);
            resolve(true);
          })
        }
        resolve(false);
      })
    })
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
