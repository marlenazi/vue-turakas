const shortId = require('shortid')
const Cards = require('./cards')
const zzz = require('./emitter')

module.exports = function Game(gameSize = 2) {
  
  let inited = false
  let status = () => {
    if (inited) {
      // console.log('====================')
      // console.log(players)
      if (players.every(player => 
            player.away === true)) { return 'Closed'   }
      if (_checkForEnding()      ) { return 'Finished' }
      if (players.length === size) { return 'Playing'  }
    } else {
      if (players.length  >   0  ) { return 'Waiting'  }
      else                         { return 'Closed'   }
    }
  }

  const id = shortId.generate()
  const size = gameSize
  const deck = Cards()
  const trump = deck.slice(-1)[0]
  const board = []
  const hands = []
  const mucked = []
  const timers = {}
  const players = []

  let attacking = Math.floor(Math.random() * size)
  let defending = attacking === (size - 1) ? 0 : attacking + 1
  let active = attacking
  let attackerCard = null
  let timer, actionTimer

  let winner, turakas

  function join(user) {

    if (players.length < size) {
      players.push(user)
      // in case the user has left a game before and has 'away' attached
      if (user.away) { user.away = false } // maybe its better to use delete?
      user.game = id
    } else console.log('Game full')

    if (status() === 'Playing') {
      players.find(player => player.id === user.id)
        .away = false
    }

    if (players.length === size && !inited) { _start() }

    return state()
  }
  function leave(user) {
    if (status() === 'Waiting') {
      players.splice(players.indexOf(user), 1)
      user.game = null
    }
    if (status() === 'Playing' || status() === 'Finished') {
      // we want to leave id, so if user reconnects, they can continue
      let leavingPlayer = players.find(player => player.id === user.id)
      leavingPlayer.away = true
      console.log(`${user.name} has left the game`)

      if (status() === 'Closed' && timer) {
        clearInterval(timer)
        timer = false
      }
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
      winner,
      turakas,
      players: (() => players.map(player => {
        if (inited) {
          return {
            id: player.id,
            ix: player.ix,
            name: player.name,
            hand: hands[player.ix].length,
          }
        } else {
          return {
            id: player.id,
            name: player.name,
      }}}))(),
    }
  }
  function hand(user) {
    
    return inited ? hands[players.findIndex(player => player.id === user.id)] : []
  }
  function move(card) {
    
    let ix = hands[active].findIndex( pCard => 
                                      pCard.suit === card.suit && 
                                      pCard.rank === card.rank    )

    function isValid() {
      // console.log(card)
      
      //  so lets get corresponding serverside card
      if (ix > -1) { 
        card = hands[active][ix]
      } else return false
      // console.log(card)
      // console.log(attackerCard)
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
      board.push(...hands[active].splice(ix, 1))
      _nextActive()
    }
    

    return state()
  }
  function pickUp(user) {

    if (inited && players[active].id === user.id && defending === active) {
      hands[active].push(...board.splice(0))

      attackerCard = null

      _replenish()
      _nextActive()
    }

    return state()
  }
  function muck(user) {

    if (inited && players[active].id === user.id && attacking === active) {
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
      hands.push(deck.splice(0, 6))
    })

    _setTimerToActive(5)

    inited = true
  }
  function _nextActive() {

    if (active === 0) { active += 1 } 
    else              { active -= 1 }

    attackerCard = (board.length % 2 === 0) ? null
                                            : board[board.length - 1]

    

    _setTimerToActive(5)
    zzz.emit('refresh', id, state())

    if (deck.length < 6) { 
      if (_checkForEnding()) {

        zzz.emit('gameOver', state())
      }
    }
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
      if (hands[ix].length < 6 && deck.length && ix !== active) {
        hands[ix].push(...deck.splice(0, 6 - hands[ix].length))
      }
    })

    // we skipped the killer and it gets replenished last
    let hand = hands[active]
    if (hand.length < 6 && deck.length) {
      hand.push(...deck.splice(0, 6 - hand.length))
    }
  }
  function _timer(seconds = 30, callback) {

    let timePassed = seconds

    timer = setInterval(() => {
      // console.log(timer)
      if (timePassed <= -1) {

        if (callback === move) {
          callback(hands[active][Math.floor(Math.random() * hands[active].length)])
        } else { callback(players[active]) }
        
      } else {
        
        zzz.emit('time', id, timePassed)
      }

      timePassed -= 1
    }, 1000)

  }
  function _setTimerToActive(seconds = 30) {
    // console.log('setting timer to active. Sec: ' + seconds)

    if (timer) { 
      // console.log('clearing timer')
      clearInterval(timer)
      timer = false
    }

    if (players[active].away) { seconds = 2 }

    if (active === attacking && board.length > 0) {
      
      _timer(seconds, muck)

    } else if (active === attacking && board.length === 0) {

      _timer(seconds, move)
      
    } else {
      
      _timer(seconds, pickUp)

    }

  }
  function _checkForEnding() {

    if (!deck.length) {
      if (players.some((player, ix) => !hands[ix].length)) {
        console.log('We have a winner')
        if (timer) { 
          // console.log('clearing timer')
          clearInterval(timer)
          timer = false
        }

        winner = players.find((player, ix) => !hands[ix].length)
        turakas = players.find(player => player !== winner)

        setTimeout(() => {
          zzz.emit('closeGame', id)
        }, 1000 * 5)

        return true
      }
    }
    return false
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