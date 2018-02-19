const shortId = require('shortid')

module.exports = function User(name, ip) {
  return {
    id: shortId.generate(),
    ip,
    name,
    socketIds: [],
    game: null,
    away: null,
    rank: 0
  }
}