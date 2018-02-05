const shortId = require('shortid')
const Cards = require('./cards')

module.exports = function Game(gameSize = 2) {
  
  let state = 'Created'

  const id = shortId.generate()
  const size = gameSize
  const deck = Cards()
  const trump = deck.slice(-1)[0]
  const board = []
  const players = []
  const attacking = Math.floor(Math.random() * size)
  const defending = attacking === (size - 1) ? 0 : attacking + 1
  const active = attacking
  const attackerCard = null

  function join(user) {
    players.push(user)
    user.game = id
  }
  function leave(user) {
    players.splice(players.indexOf(user), 1)
    user.game = null
  }

  return {
    id,
    join,
    leave
  }
}