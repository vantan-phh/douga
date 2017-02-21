$(() => {
  let posting = document.getElementsByClassName("posting")[0];
  let textArea = document.getElementsByClassName("postingText")[0];
  let inputFlag = false;

  textArea.onkeyup = () => {
    let text = document.getElementsByClassName("postingText")[0].value;
    if(!inputFlag && text != "") {
      inputFlag = true;
      posting.style.backgroundColor = "#4285F4";
      posting.style.color = "white";
      posting.style.cursor = "pointer";
    }else if(text == "") {
      inputFlag = false;
      posting.onclick = null;
      posting.style.backgroundColor = "#E6E6E6";
      posting.style.color = "#9F9F9F"
      posting.style.cursor = null;
    }
  };

  posting.onclick = () => {
    if(!inputFlag) return;
    let postingText = document.getElementsByClassName("postingText")[0].value;
    let date = new Date();
    $.post("/posting", {text: postingText}, (data) => {
      console.log(data)
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
});
