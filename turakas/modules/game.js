const shortId = require('shortid')

module.exports = function Game(gameSize) {
  const status = 'Created'
  const id = shortId.generate()
  const size = gameSize
  const players = []

  
  function join(playerId) {
    if (status !== 'started') {
      players.push(playerId)
    } else return

    if (players.length === size) {
      startGame()
    }
  }
  function startGame() {
    status = 'Playing'
    return 'let the games begin'
  }
  function getState(playerId) {
    return {
      id,
      status,
      players: `${players.length}/${size}`,
      hero: playerId,
    }
  }
  

  return {
    status,
    id,
    players,
    join,
    getState,
  }
}