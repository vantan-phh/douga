let peerServer = require("peer").PeerServer({port: 9000, path: "/peerjs"});

module.exports = peerServer;
