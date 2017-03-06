$(() => {
  let update = document.getElementsByClassName("update")[0];
  let text = document.getElementsByClassName("textarea")[0].value;
  let postingPlace = document.getElementsByClassName("posts")[0];

  let lastId;

  function postsGet() {
    $.post("/search/update", {lastId: lastId, text: text}, (data) => {

      let posts = data.posts;

      if(posts[0]) {
        lastId = posts[0].id;
        postPush(posts);
      }
    }, "json");
  }

  postsGet();

  update.onclick = () => {
    postsGet();
  }

  function postPush(data) {

    for(var i = data.length - 1; i >= 0; i--) {
      var newPost = document.createElement("div");
      newPost.innerHTML = `<a href=/profile/${data[i].user_id}><img class="icon" src=/images/${data[i].user.icon}.png></a><div class="postRight"><div class="nameSpace"><h5>${data[i].user.name}</h5><div class="textSpace"><p>${data[i].text}</p></div></div></div>`
      newPost.className = "allPosts";
      postingPlace.insertBefore(newPost, postingPlace.firstChild);
    }
  }
});
