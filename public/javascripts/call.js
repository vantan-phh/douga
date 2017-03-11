$(() => {

  let onlineStatus = document.getElementsByClassName("online")[0];
  let online = true;

  onlineStatus.onclick = () => {
    if(online) {
      online = false;
      onlineStatus.innerHTML = "オフライン";
      onlineStatus.style.color = "red";
    }else {
      online = true;
      onlineStatus.innerHTML = "オンライン";
      onlineStatus.style.color = "green";
    }
  }

  let peerId;
  let myStream;
  let targetPeerId;
  let peer;

  let audio = document.getElementsByClassName("audio")[0];
  let phoneText = document.getElementsByClassName("phoneText")[0];
  let phone = document.getElementsByClassName("phone");

  function answer(call) {
    call.answer(myStream);
    call.on("stream", (stream) => {
      audio.src = window.URL.createObjectURL(stream);
    });
  }

  function createPeer() {
    peer = new Peer({
      host: location.hostname,
      port: location.port,
      path: '/api',
      debug: 3,
      config: {'iceServers': [
        {url: 'stun:stun1.l.google.com:19302'},
        {url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'}
      ]}
    });
  }

  function getMicrophone(callback, argument) {

    if(myStream) {
      callback(argument ? argument : "");
      return;
    }

    navigator.mediaDevices.getUserMedia({video: false, audio: true})
    .then((stream) => {
      myStream = stream;
      callback(argument ? argument : "");
    }).catch((error) => {
      console.error(error);
      return;
    });
  }

  function toCall(targetPeerId) {
    let call = peer.call(targetPeerId, myStream);

    call.on("stream", (stream) => {
      audio.src = window.URL.createObjectURL(stream);
      audio.play();
    });
  }

  setInterval(() => {
    if(online) {
      $.post("/connection", {time: Date.parse(new Date)}, (info) => {
        if(info.callUser) {
          callAnswer(info.callUser)
        }

        if(info.fail) {
          peer.destroy();
          peer = null;

          phoneReset(phone[0]);
          phoneReset(phone[1]);

          phoneText.innerHTML = "通話終了";

          setTimeout(() => {
            phoneText.innerHTML = "";
          }, 5000);
        }
      });
    }
  }, 5000);

  function callAnswer(callUser) {
    phone[1].style.backgroundColor = "green";
    phone[0].style.backgroundColor = "red";

    phone[1].style.cursor =
    phone[0].style.cursor = "pointer";

    phoneText.innerHTML = callUser.name +  " からの通話";

    phone[1].onclick = () => {

      createPeer();

      peer.on("open", () => {
        getMicrophone(toCall, callUser.peerId);
        phoneText.innerHTML = callUser.name;

        phoneReset(phone[1]);

        phone[0].onclick = () => {
          peer.destroy();
          peer = null;

          phoneText.innerHTML = "";

          phoneReset(phone[0]);

          $.post("/disconnection", {userId: callUser.id});
        }
      });
    }
    phone[0].onclick = () => {
      phoneReset(phone[0]);
      phoneReset(phone[1]);

      phoneText.innerHTML = "";

      $.post("/disconnection", {userId: callUser.id});
    }
  }

  function phoneReset(phone) {
    phone.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    phone.style.cursor = "";
    phone.onclick = null;
  }

  let callButton = document.getElementsByClassName("callButton")[0];

  if(callButton) {
    callButton.onclick = () => {

      if(phoneText.innerHTML) return;

      let target = window.location.href.split("/")[4];

      phoneText.innerHTML = "発信中";

      createPeer();

      peer.on("open", () => {
        peerId = peer.id;
        $.post("/call", {target: target, peerId: peerId});
      });

      peer.on("call", (call) => {
        getMicrophone(answer, call);

        let userName = document.getElementsByClassName("userName")[0];

        phoneText.innerHTML = userName.innerHTML;

        phone[0].style.backgroundColor = "red";
        phone[0].style.cursor = "pointer";

        phone[0].onclick = () => {
          peer.destroy();
          peer = null;

          phoneReset(phone[0])

          phoneText.innerHTML = "";

          $.post("/disconnection", {userId: target});
        }
      });
    }
  }
});
