let peer = require("peer");

module.exports = function(server, options) {
  return peer.ExpressPeerServer(server, options);
}
