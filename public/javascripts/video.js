window.addEventListener("load", function() {


// window.addEventListener("load", function() {
//
//   var video = document.getElementsByClassName("video");
//   var offer = document.getElementsByClassName("offer")[0];
//
//   window.URL = window.URL || window.webkitURL;
//
//   offer.addEventListener("click", offer);
//
//   var peer = new RTCPeerConnection({
//     iceServers: [
//       {url: "stun:stun.l.google.com:19302"}
//     ]
//   });
//
//   var socket = io("ws://" + location.host);
//
//   socket.on("message", function(data) {
//     data = JSON.parse(data);
//
//     peer.setRemoteDescription(new RTCSessionDescription(data.spd), function() {
//       if(discription.type == "offer") answer();
//     });
//
//     peer.addIceCandidate(new RTCIceCandidate(data.candidate));
//   });
//
//   peer.addEventListener("icecandidate", function(data) {
//     socket.emit("icecandidate", JSON.stringify({candidate: data.candidate}));
//   });
//
//   peer.addEventListener("addstream", function(data) {
//     video[1].src = URL.createObjectURL(data.stream);
//     video[1].play();
//   });
//
//   navigator.mediaDevices.getUserMedia({video: true, audio: true})
//   .then(function (stream) {
//     video[0].src = window.URL.createObjectURL(stream);
//     video[0].play();
//     peer.addStream(stream);
//   }).catch(function (error) {
//     console.error(error);
//     return;
//   });
// });
//
// function offer() {
//   peer.createOffer(function(offer) {
//     peer.setLocalDesctiption(offer, function() {
//       socket.emit("offer", JSON.stringify({spd: offer}));
//     });
//   }, function(error) {
//     console.error(error);
//   });
// }
//
// function answer() {
//   peer.createAnsewr(function(answer) {
//     peer.setLocalDesctiption(answer, function() {
//       socket.emit("answer", JSON.stringify({spd: answer}));
//     });
//   }, function(error) {
//     console.log(error);
//   });
// }
