const shortId = require('shortid')
const Cards = require('./cards')

module.exports = function Game(gameSize = 2) {
  
  let inited = false
  let status = () => {
    if (inited) {
      if (players.length === size) { return 'Playing' }
      if (players.length  <  size) { return 'Halted'  }
    } else {
      if (players.length  >   0  ) { return 'Waiting' }
      else                         { return 'Closed'  }
    }
  }

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
  function state() {
    return {
      board,
      attacking,
      defending,
      active,
      attackerCard,
      players: () => players.map(player => {
        return {
          hand: player.hand.length,
          name: player.name,
        }
      }),
    }
  }

  return {
    id,
    status,
    join,
    leave
  }
}