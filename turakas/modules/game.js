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
  const mucked = []
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

    if (players.length === size) { _start() }
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
      _nextActive()
      _nextAttacking()
      _nextDefending()
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

    inited = true
  }
  function _nextActive() {
    if (active === 0) {
      active += 1
    } else {
      active -= 1
    }
    console.log(active)
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
    players.forEach(player => {
      if (player.hand.length < 6) {
        player.hand.push(...deck.splice(0, 6 - player.hand.length))
      }
    })
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