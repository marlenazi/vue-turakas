const shortId = require('shortid')

module.exports = function Game(gameSize) {
  const status = 'Created'
  const id = shortId.generate()
  const size = gameSize
  const players = []

  
  function join(playerId) {
    if (game.status !== 'started') {
      players.push(playerId)
    } else return

    if (players.length === size) {
      startGame()
    }
  }
  function startGame() {
    return 'let the games begin'
  }
  function getState(playerId) {
    return 'state of player ' + playerId
  }
  

  return {
    status,
    id,
    players,
  }
}