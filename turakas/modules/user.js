const shortId = require('shortid')

module.exports = function User(name, ip, socketId) {
  return {
    id: shortId.generate(),
    socket: socketId,
    ip,
    name,
    game: null
  }
}