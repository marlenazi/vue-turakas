const shortId = require('shortid')

module.exports = function User(name, ip) {
  return {
    id: shortId.generate(),
    ip,
    name,
    socketIds: [],
    game: null,
    away: false,
    rank: '0'
  }
}