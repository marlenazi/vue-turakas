const shortId = require('shortid')

const Cards = require('./cards')

module.exports = function Game(size) {
  let state = 'Created'
  const id = shortId.generate()
  const players = []
  const deck = Cards()
  const trump = deck.slice(-1)[0]
  const board = []
  const muck = []


  function join(playerId) {
    if (players.length < size) {
      players.push(playerId)
      state = 'Waiting'
    } else return

    if (players.length === size) {
      start()
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
  function start() {
    // make trump suited cards be stronger
    deck.map(card => {
      if (card.suit === trump.suit) {
          card.value += 10
      }
    })

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