

const shortId = require('shortid')
const Cards = require('./cards')
const zzz = require('./emitter')

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
  const mucked = []
  const timers = {}
  const players = []

  let attacking = Math.floor(Math.random() * size)
  let defending = attacking === (size - 1) ? 0 : attacking + 1
  let active = attacking
  let attackerCard = null

  function join(user) {

    if (players.length < size) {
      players.push(user)
      user.game = id
    } else console.log('Game full')

    if (players.length === size && !inited) { _start() }

    return state()
  }
  function leave(user) {
    if (status() === 'Waiting') {
      players.splice(players.indexOf(user), 1)
      user.game = null
    }
    if (status() === 'Playing') {
      // we want to leave id, so if user reconnects, they can continue
      let leavingPlayer = players.find(player => player.id === user.id)

      console.log(`Player ${user.name} has left the game`)
    }
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
  function hand(user) {
    
    return inited ? players.find(player => player.id === user.id).hand : []
  }
  function move(card) {

    let ix = players[active].hand.findIndex( pCard => 
                                             pCard.suit === card.suit && 
                                             pCard.rank === card.rank    )
    function isValid() {
      console.log(card)

      //  so lets get corresponding serverside card
      if (ix > -1) { 
        card = players[active].hand[ix]
      } else return false
      console.log(card)
      console.log(attackerCard)
      if (attackerCard) {
        // when there is an attackerCard check if our card is:
        // -- same suit or trump
        // -- has higher value
        if (card.value > attackerCard.value && 
           (card.suit === attackerCard.suit || card.suit === trump.suit)) {
          return true
        } else return false
        // if there is no attacker, card (new attacker) can go on the board
      } else if (board.length && board.length < 6) {
        if (board.some( el => el.rank === card.rank)) {
          return true
        } else return false
      } else return true
    }
      
    if (isValid()) {
      board.push(...players[active].hand.splice(ix, 1))
      _nextActive()
    }
    
    attackerCard = (board.length % 2 === 0) ? null
                                            : board[board.length - 1]

    return state()
  }
  function pickUp(user) {

    if (players[active].id === user.id && defending === active) {
      players[active].hand.push(...board.splice(0))

      attackerCard = null

      _replenish()
      _nextActive()
    }

    return state()
  }
  function muck(user) {

    if (players[active].id === user.id && attacking === active) {
      mucked.push(...board.splice(0))

      attackerCard = null

      _replenish()
      _nextAttacking()
      _nextDefending()
      _nextActive()
    }

    return state()
  }

  function _start() {
    console.log('Starting game ' + id)

    deck.forEach(card => {
      if (card.suit === trump.suit) {
        card.value += 10
    }})

    players.forEach((player, ix) => {
      player.ix = ix
      player.hand = deck.splice(0, 6)
    })

    _timer(30, players[active], move)

    inited = true
  }
  function _nextActive() {

    if (active === 0) { active += 1 } 
    else              { active -= 1 }

    if (deck.length < 6) { _checkForEnding() }

    _setTimerToActive()
    zzz.emit('refresh', id, state())
  }
  function _nextAttacking() {
    if (attacking === 0) {
      attacking += 1
    } else {
      attacking -= 1
    }
  }
  function _nextDefending() {
    if (defending === 0) {
      defending += 1
    } else {
      defending -= 1
    }
  }
  function _replenish() {

    // killer is replenished last
    // replenishing should go in the order that the last round was played

    players.forEach((player, ix) => {
      if (player.hand.length < 6 && deck.length && ix !== active) {
        player.hand.push(...deck.splice(0, 6 - player.hand.length))
      }
    })

    // we skipped the killer and it gets replenished last
    let hand = players[active].hand
    if (hand.length < 6 && deck.length) {
      hand.push(...deck.splice(0, 6 - hand.length))
  }
  function _timer(seconds = 30, player, callback) {
    const time = (seconds + 2) * 1000
    let timePassed = seconds
    // we use ticToc to send updates on time to client
    let ticToc = setInterval(() => {
      zzz.emit('time', id, timePassed)
      timePassed -= 1
    }, 1000)

    setTimeout(() => {
      if (callback === move) {
        callback(player.hand[Math.floor(Math.random() * player.hand.length)])
      } else {
        callback(player)
      }
      clearInterval(ticToc)
    }, time);

  }
  function _setTimerToActive(seconds = 30) {

    if (active === attacking && board.length > 0) {
      
      _timer(seconds, players[active], muck)

    } else if (active === attacking && board.length === 0) {

      _timer(seconds, players[active], move)
      
    } else {
      
      _timer(seconds, players[active], pickUp)
      
    }

  }
  function _checkForEnding() {

  }

  return {
    id,
    status,
    state,
    join,
    leave,
    hand,
    move,
    pickUp,
    muck,
  }
}