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

      User.find(info.user_id).then((user) => {
        let query = "INSERT INTO `posts` (user_id, text, created_at) VALUES(?, ?, ?)";
        let date = new Date();
        let insertData = [
          info.user_id,
          info.text,
          date
        ];

        db.query(query, insertData, (err, res) => {
          if(err) reject(err);

          elasticSearchClient.index("psns", "posts", {
            id: res.insertId,
            text: info.text,
            user_id: info.user_id
          })
          .on("data", (data) => {
            resolve({id: res.insertId, user_id: info.user_id, text: info.text, user: user, created_at: date});
          })
          .on("error", (err) => {
            reject(err);
          })
          .exec();
        });
      }).catch((err) => {
        reject(err);
      })
    })
  }

  static search(info) {
    return new Promise((resolve, reject) => {
      let text = "\"" + info.text + "\"";

      let searchQuery = {
        "query" : {
          "query_string": {
            "default_field" : "text",
            "query": text
          }
        },
        "size": 15,
        "sort": [{
          "id": {
            "order": "desc"
          }
        }]
      }

      if(info.lastId) {
        searchQuery.query = {
          "filtered": {
            "query": {
              "query_string": {
                "default_field" : "text",
                "query": text
              }
            },
            "filter": {
              "range": {
                "id": {
                  "gt": info.lastId
                }
              }
            }
          }
        }
      }



      elasticSearchClient.search("psns", "posts", searchQuery)
      .on("data", (data) => {
        data = JSON.parse(data);

        if(data.error) {
          reject(data);
          return;
        }


        let posts = {};
        let duplicateId = {};
        let ids = [];

        data.hits.hits.forEach((hit) => {
          let post = hit._source;

          posts[post.user_id]
          ? posts[post.user_id].push(post)
          : posts[post.user_id] = [post];

          if(!duplicateId[post.user_id]) {
            duplicateId[post.user_id] = true;
            ids.push(post.user_id)
          }
        });

        User.publicFinds(ids).then((users) => {
          let sendData = [];

          users.forEach((user) => {
            posts[user.id].forEach((post) => {
              post.user = user;
              sendData.push(post)
            })
          });

          resolve(sendData);
        }).catch((err) => {
          reject(err);
        })
      })
      .on("error", (err) => {
        reject(err)
      })
      .exec();
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
