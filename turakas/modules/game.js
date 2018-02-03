const shortId = require('shortid')

module.exports = function Game(playerId) {
  

  return {
    id: shortId.generate(),
    player: {
      playerId: {}
    }
  }
}