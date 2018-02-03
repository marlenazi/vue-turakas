const shortId = require('shortid')

module.exports = function User(name, ip, socketId) {

  return {
    id: shortId.generate(),
    ip,
    socketId,
    name,
    game: null
  }
}