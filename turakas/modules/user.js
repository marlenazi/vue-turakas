const shortId = require('shortid')

module.exports = function User(name, ip) {

  return {
    id: shortId.generate(),
    ip,
    name,
    socketIds: [],
    game: null,
    left: false,
    rank: '0'
  }
}