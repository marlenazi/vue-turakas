const shortId = require('shortid')

module.exports = function Game(size) {
  let state = 'Created'
  const id = shortId.generate()
  const players = []

  function join(playerId) {
    if (players.length < size) {
      players.push(playerId)
      state = 'Waiting'
    } else return

    if (players.length === size) {
      startGame()
    }
  }
  function leave(playerId) {
    if (players.indexOf(playerId) > -1) {
      players.splice(players.indexOf(playerId), 1)
      state = 'Waiting'
    }
    if (players.length === 0) {
      state = 'Closed'
    }
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