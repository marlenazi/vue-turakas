const shortId = require('shortid')

module.exports = function Game(gameSize) {
    let state = 'Created'
  const id = shortId.generate()
  const size = gameSize
  const players = []

  
  function join(playerId) {
    if (state !== 'Playing') {
      players.push(playerId)
      state = 'Waiting'
    } else return

    if (players.length === size) {
      startGame()
    }
  }
  function leave(playerId) {

  }
  function startGame() {
    state = 'Playing'
    return 'let the games begin'
  }
  function getStateFor(playerId) {
    return {
      id,
      state,
      players: `${players.length}/${size}`,
      hero: playerId,
    }
  }
  

  return {
    id,
    get state() {
      return state
    },
    players,
    join,
    leave,
    getStateFor,
  }
}