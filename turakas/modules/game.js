const shortId = require('shortid')
const Cards = require('./cards')

module.exports = function Game(gameSize = 2) {
  
  let inited = false
  let status = () => {
    if (inited) {
      if (players.length === size) { return 'Playing' }
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
    if (players.length < size) {
      players.push(user)
      user.game = id
    } else console.log('Game full')

    if (players.length === size) { start() }
  }
  function leave(user) {
    if (status() === 'Waiting') {
      players.splice(players.indexOf(user), 1)
      user.game = null
    }
    if (status() === 'Playing' || status() === 'Halted') {
      // we want to leave id, so if user reconnects, they can continue
      players.find(player => player.id === user.id)
      console.log(`Player ${user.name} has left the game`)
    }
  }
  function start() {
    console.log('Starting game ' + id)

    deck.forEach(card => {
      if (card.suit === trump.suit) {
        card.value += 10
    }})

    players.forEach((player, ix) => {
      player.ix = ix
      player.hand = deck.splice(0, 6)
    })

    board.push(...deck.splice(0, 3))

    inited = true
  }
  function state() {
    return {
      id,
      status: status(),
      size,
      deck: deck.length,
      board,
      trump,
      attacking,
      defending,
      active,
      attackerCard,
      players: (() => players.map(player => {
        if (inited) {
          return {
            id: player.id,
            ix: player.ix,
            name: player.name,
            hand: player.hand.length,
          }
        } else {
          return {
            id: player.id,
            name: player.name,
      }}}))(),
    }
  }

  return {
    id,
    status,
    state,
    join,
    leave,
  }
}