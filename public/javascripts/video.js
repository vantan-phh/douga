$(() => {
  let peer = new Peer({
    host: 'localhost',
    port: 9000,
    path: '/peerjs',
    debug: 3,
    config: {'iceServers': [
      {url: 'stun:stun1.l.google.com:19302'},
      {url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'}
    ]}
  });

  let button = document.getElementsByClassName("call")[0];
  let video = document.getElementsByClassName("video");

  let myVideo = video[0];
  let partnerVideo = video[1];

  let myStream;

  navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then((stream) => {
    myVideo.src = window.URL.createObjectURL(stream);
    myVideo.play();
    myStream = stream;
  }).catch((error) => {
    console.error(error);
    return;
  });

  peer.on("open", () => {
    console.log(peer.id);
  });

  peer.on("call", (call) => {
    call.answer(myStream);
    call.on("stream", (stream) => {
      partnerVideo.src = window.URL.createObjectURL(stream);
    });
  });

  button.click(() => {
    let peerId = document.getElementsByClassName("peerId")[0];
    let call = peer.call(peerId, myStream);

    call.on("stream", (stream) => {
      partnerVideo.src = window.URL.createObjectURL(stream);
      partnerVideo.play();
    });
  });
});
