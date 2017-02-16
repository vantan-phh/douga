$(function() {

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
  .then(function (stream) {
    video[0].src = window.URL.createObjectURL(stream);
    video[0].play();
    myStream = stream;
  }).catch(function (error) {
    console.error(error);
    return;
  });

  peer.on("open", function() {
    console.log(peer.id);
  });

  peer.on("call", function(call) {
    call.answer(myStream);

    call.on("stream", function(stream) {
      video[1].src = window.URL.createObjectURL(stream);
    });
  });

  button.click(function() {
    let peerId = document.getElementsByClassName("peerId")[0];
    let call = peer.call(peerId, myStream);

    call.on("stream", function(stream) {
      video[1].src = window.URL.createObjectURL(stream);
      video[1].play();
    });
  });
});
