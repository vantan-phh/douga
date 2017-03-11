const db = require("../db");
const hashCreate = require("../other/hashCreate");
const saltCreate = require("../other/saltCreate");

class User {
  static find(id) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM `users` WHERE `id` = ? LIMIT 1";

      db.query(query, [id], (err, res) => {
        if(err) {
          reject(err);
          return;
        }

        if(res.length == 0) {
          resolve(false);
          return;
        }

        resolve(new User(res[0]));
      });
    });
  }

  static finds(ids) {
    return new Promise((resolve, reject) => {
      if(!ids[0]) {
        resolve([]);
        return;
      }
      let query = "SELECT * FROM `users` WHERE `id` IN (?) LIMIT ?";

      db.query(query, [ids, ids.length], (err, res) => {
        if(err) {
          reject(err);
          return;
        }

        resolve(res)
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
      });
    });
  }

  static publicFinds(ids) {
    return new Promise((resolve, reject) => {
      User.finds(ids).then((users) => {
        let publicUsers = [];

        users.forEach((user) => {
          publicUsers.push({
            id: user.id,
            name: user.name,
            follow_count: user.follow_count,
            follower_count: user.follower_count
          });
        });

        resolve(publicUsers);

      }).catch((err) => {
        reject(err);
      });
    });
  }

  static register(info) {
    return new Promise((resolve, reject) => {
      let query = "INSERT INTO `users` SET ?";
      let date = new Date();
      let salt = saltCreate();
      let password = hashCreate(info.password, salt);
      let icon = "undefined";

      let insertData = {
        mail: info.email,
        name: info.userName,
        password: password,
        salt: salt,
        icon: icon,
        follow_count: 0,
        follower_count: 0,
        created_at: date,
        update_at: date
      };

      db.query(query, insertData, (err, res) => {
        if(err) {
          reject(err);
          return;
        }

        resolve(res.insertId);
      });
    });
  }

  static login(info) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM `users` WHERE mail = ? LIMIT 1";

      db.query(query, [info.email], (err, res) => {
        if(err) {
          reject(err);
          return;
        }
        if(!res[0].id) reject("missing user account");

        let password = hashCreate(info.password, res[0].salt);

        if(password == res[0].password) {
          resolve(res[0].id);
        }else {
          reject("password is incorrect");
        }
      });
    });
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

  followUser() {
    return new Promise((resolve, reject) => {
      let query = "SELECT `target_id` FROM `to_follow` WHERE `follower_id` = ? LIMIT ?";

      db.query(query, [this.id, this.follow_count], (err, res) => {
        if(err) {
          reject(err);
          return;
        }
        let targetId = [];

        for(var i = 0; i < res.length; i++) {
          targetId.push(res[i].target_id);
        }

        User.finds(targetId).then((data) => {
          console.log("c");
          resolve({data: data, ids: targetId});

        }).catch((err) => {
          reject(err);
        });
      });
    });
  }

  getTimeLine(lastId) {
    return new Promise((resolve, reject) => {
      this.followUser().then((result) => {
        let data = result.data;
        let ids = result.ids;

        User.find(this.id).then((user) => {

          data.push(user);
          ids.push(this.id);

          var usersData = {};

          for(var i = 0; i < data.length; i++) {
            usersData[data[i].id] = data[i];
          }

          let query = "SELECT * FROM `posts` WHERE `user_id` IN (?)";

          query += lastId
            ? (" LIMIT 30 OFFSET " + (lastId - 46))
            : " ORDER BY `created_at` DESC LIMIT 30";

          db.query(query, [ids], (err, res) => {
            if(err) {
              reject(err);
              return;
            }

            if(res[0]) {
              for(var i = 0; i < res.length; i++) {
                res[i].user = usersData[res[i].user_id];
              }
            }
            resolve(res)
          });

        }).catch((err) => {
          reject(err);
        });

      }).catch((err) => {
        reject(err);
      });
    });
  }

  getPosts(lastId) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM `posts` WHERE user_id = ? LIMIT 30 ";

      if(lastId) query += "OFFSET " + (lastId - 46);

      db.query(query, [this.id], (err, res) => {
        if(err) {
          reject(err);
          return;
        }

        resolve(res);
      });
    });
  }

  whatFollow(targetId) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM `to_follow` WHERE follower_id = ? & target_id = ? LIMIT 1";

      db.query(query, [this.id, target_id], (err, res) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
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
            if(err) {
              reject(err);
              return;
            }

            resolve(true);
          });
        }

        resolve(false);
      });
    });
  }

  unFollow(targetId) {
    return new Promise((resolve, reject) => {
      this.whatFollow(targetId).then((data) => {
        if(data[0]) {
          let query = "DELETE FROM `to_follow` WHERE follower_id = ?, target_id = ?";

          db.query(query, [this.id, targetId], (err, res) => {
            if(err) {
              reject(err);
              return;
            }

            resolve(true);
          });
        }

        resolve(false);
      });
    });
  }

  update() {
    this.updated_at = new Date();

    return new Promise((resolve, reject) => {
      let query = "UPDATE `users` SET ? WHERE `id` = ? LIMIT 1";

      db.query(query, [this.fields(), this.id], (err, res) => {
        if(err) {
          reject(err);
          return;
        }

        resolve(this);
      });
    });
  }

  delete() {
    return new Promise((resolve, reject) => {
      let query = "DELETE FROM `users` WHERE `id` = ?";

      db.query(query, [this.id], (err, res) => {
        if(err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }
}

module.exports = User;
