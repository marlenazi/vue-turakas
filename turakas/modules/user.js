const shortId = require('shortid')

module.exports = function User(name, ip) {

  return {
    id: shortId.generate(),
    ip,
    name,
    game: null,
    left: false
  }
}