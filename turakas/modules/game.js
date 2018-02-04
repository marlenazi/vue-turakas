const shortId = require('shortid')
const Cards = require('./cards')

module.exports = function Game(init) {
  init = {
    size: 2,
    users: [{
      id: shortId.generate(),
      name: 'Mart',
    }, {
      id: shortId.generate(),
      name: 'Tomm',
    }]
  }

  // init = {
  //   size: 4,
  //   users: [{
  //     id: shortId.generate(),
  //     name: 'Mart',
  //   }, {
  //     id: shortId.generate(),
  //     name: 'Tomm',
  //   }, {
  //     id: shortId.generate(),
  //     name: 'Lisa',
  //   }, {
  //     id: shortId.generate(),
  //     name: 'Mihkel',
  //   }]
  // }

  if (typeof init !== 'object') {
    console.log('Game must be initialized with an object')
    return
  } else if (init.users.length !== init.size) {
    console.log('Game is not full')
    return
  }
  
  const id = shortId.generate()
  const size = init.size
  const deck = Cards()
  const trump = deck.slice(-1)[0]
  const board = []
  const attacking = Math.ceil(Math.random() * size)
  const defending = attacking === size ? 1 : attacker + 1
  const active = attacker
  const attackerCard = null
  const players = init.users.reduce((obj, user, ix) => {
    obj['p' + (ix + 1)] = {id: user.id, name: user.name}
    return obj
  }, {})
  
  function start() {
    console.log('Starting game')
    
    return {
      active,
      attacking,
      defending,
      attackerCard,
      board,
      players,
    }
  }

  function deal(game) {
    console.log('Dealing cards to players')
    
    game = JSON.parse(JSON.stringify(game))

    Object.keys(game.players).forEach(player => {
      game.players[player].hand = deck.slice(0, 6)
    })

    return game
  }

  function move(game, cards) {
    console.log('Move ' + cards)

    let activeP =  game.players['p' + game.active]
    console.log(activeP)

    

    return game
  }

  function flow() {
    console.log('Start traversing the game')
    
    const method = action => action.split(':')[0]
    const args = action => {
      let args = action.split(':')[1]
      
      if (args) {
        return args.split(',')
      } else return undefined
    }

    return actions.reduce((game, action, ix) => {

      console.log(method(action))
      console.log(args(action))

      return methods[method(action)](game, args(action))
    }, {})
  }

  const methods = {
    start,
    deal,
    move,
  }
  const actions = ['start', 'deal', 'move:5s']

  return flow()
}