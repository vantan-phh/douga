$(() => {
  let posting = document.getElementsByClassName("posting")[0];
  let postingPlace = document.getElementsByClassName("postingPlace")[0];
  let textArea = document.getElementsByClassName("postingText")[0];
  let hov = document.getElementsByClassName("hov")[0];
  let inputFlag = false;

  hov.style.borderBottom = "5px solid #0084B4";
  hov.style.color = "#0084B4";

  textArea.onkeyup = () => {
    let text = document.getElementsByClassName("postingText")[0].value;

    if(!inputFlag && text != "") {
      inputFlag = true;
      posting.style.backgroundColor = "#4285F4";
      posting.style.color = "white";
      posting.style.cursor = "pointer";
    }else if(text == "") {
      inputFlag = false;
      posting.style.backgroundColor = "#E6E6E6";
      posting.style.color = "#9F9F9F"
      posting.style.cursor = null;
    }
  };

  posting.onclick = () => {
    let postingText = document.getElementsByClassName("postingText")[0];
    if(!inputFlag && postingText != "") return;

    inputFlag = false;
    let date = new Date();

    $.post("/posting", {text: postingText.value}, (data) => {
      postPush([data]);
      postingText.value = "";
      posting.style.backgroundColor = "#E6E6E6";
      posting.style.color = "#9F9F9F"
      posting.style.cursor = null;
    }, "json");
  }

  posting.onmousedown = () => {
    if(!inputFlag) return;
    posting.style.backgroundColor = "#2C5BA7";
  }

  posting.onmouseup = () => {
    if(!inputFlag) return;
    posting.style.backgroundColor = "#4285F4";
  }

  posting.onmouseout = () => {
    if(!inputFlag) return;
    posting.style.backgroundColor = "#4285F4";
  }

  function postPush(data) {

    for(var i = 0; i < data.length; i++) {
      var newDiv = document.createElement("div");
      newDiv.innerHTML = `<img class="icon" src=/images/${data[i].user.icon}.png><div class="postRight"><div class="nameSpace"><h5>${data[i].user.name}</h5><div class="textSpace"><p>${data[i].text}</p></div></div></div>`
      newDiv.className = "allPosts";
      postingPlace.insertBefore(newDiv, postingPlace.firstChild);
    }
  }
});
