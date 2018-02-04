const shortId = require('shortid')

const Cards = require('./cards')

module.exports = function Game(size) {
  let state = 'Created'
  const id = shortId.generate()
  // array of users makes it simple to manipulate users joining and leaving etc
  const users = []
  // user object is created when game starts and assigns methods to each user
  const user = {}
  const deck = Cards()
  const trump = deck.slice(-1)[0]
  const board = []
  const muck = []


  function join(userId) {
    if (users.length < size) {
      users.push(userId)
      state = 'Waiting'
    } else return

    if (users.length === size) {
      start()
    }
  }
  function leave(userId) {
    if (users.indexOf(userId) > -1) {
      users.splice(users.indexOf(userId), 1)
      state = 'Waiting'
    }
    if (users.length === 0) {
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
    // users.forEach(user => {
    //   user.
    // })

    state = 'Playing'
    return 'let the games begin'
  }
  function getStateFor(userId) {
    return {
      id,
      state,
      users: `${users.length}/${size}`,
      hero: userId,
    }
  }
  

  return {
    id,
    get state() {
      return state
    },
    users,
    join,
    leave,
    getStateFor,
  }
}