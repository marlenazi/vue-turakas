const socket = require('socket.io')
const http = require("http")
const url = require("url")
const fs = require('fs')

const port = 2000
const index = fs.readFile('index.html', (error, file) => file)

const User = require('./turakas/modules/user')
const Game = require('./turakas/modules/game')
const zzz = require('./turakas/modules/emitter').setMaxListeners(50)
// collections for users and games
const users = []
const games = []

const io = socket(http.createServer( (req, res) => {
  //send index.html
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
}).listen(port))
console.log('Listening to ' + port)

// socket connection and events
io.on('connection', socket => {
  console.log(`Socket ${socket.id} connected`)

  function getGame(id) {
    return games.find(game => game.id === id)
  }
  function getUser(id) {
    /**
     * We return the user object either by id or socketId
     * If we cant find neither, we return null
     */
    return users.find(user => user.id === id) || users.find(user =>
        user.socketIds.some(socId => socId === id)
      ) || null;
  }
  function getAvailableGames(user) {
    let playingGame  = []
    let availableGames = []

    if (user && user.game && getGame(user.game)) {
      if (getGame(user.game).status() !== 'Waiting') {

        playingGame = [getGame(user.game)]
      }
    }

    availableGames = games.filter( game => game.status() === 'Waiting')

    return playingGame.concat(availableGames).map(game => game.state())
      
  }
  function login(name, ip) {
    console.log(`Logging in ${name}`)
    // get user from users or create a new one)
    let user = users.find(user => user.name === name && user.ip === ip)

    if (user) {
      console.log('User exists')
      /* here could check if connection is still active (ie one client, two tabs)
      and then send a message to handle double connection */
    } else {
      console.log('Creating new user')

      user = User(name, ip)
      users.push(user)
    }
    // if not already there, assign socketId, 
    // so we can send data to specific user
    // as user might use different tabs, we must collect several ids
    // when user disconnects, we remove corresponding ID from the array

    if (user.socketIds.indexOf(socket.id) === -1) {
      user.socketIds.push(socket.id)
    }

    return user
  }
  function createGame(userId) {

    let user = getUser(userId)
    let game = Game()

    games.push(game)
    game.join(user)
    socket.join(game.id)

    return game.state()
  }
  function joinGame(gameId, userId) {
    let user = getUser(userId)
    let game = getGame(gameId)

    game.join(user)
    socket.join(game.id)

    return game.state()
  }
  function leaveGame(userId) {
    console.log('Func leaveGame')
    if (!getUser(userId)) return
    if (!getGame(getUser(userId).game)) return

    let user = getUser(userId)
    let game = getGame(user.game)
      
    game.leave(user)
    
    let gameState = game.state()

    if (gameState.status === 'Closed') {
      console.log('Closing game ' + game.id)
      user.game = null
      games.splice(games.indexOf(game), 1)
    }
      
    return gameState
  }
  function emitToOne(event, data = '', theOne = getUser(socket.id)) {
    // this loops over all socketIds connected to user and 
    // emits same event and data
    theOne.socketIds.forEach(socId => {
      io.to(socId).emit(event, data)
    })
  }
  function emitToMany(gameId, event, data = '') {
    if (!getGame(gameId)) return

    let many = getGame(gameId).state().players

    many.forEach(player => {
      emitToOne(event, data, player)
    })
  }

  socket.on('login', name => {
    if (!name || typeof name !== 'string') return
    /**
     * we get connection ip and compare both name and ip to existing users
     * if we have a match, we return that user to the client, 
     * if not, we create a new one and return it to the client
     * 
     * then we check if it had a game attached and if so, emit the state
     * to all sockets that are connected to user 
     */

    let ip = socket.request.connection.remoteAddress
    let user = login(name, ip, socket.id)

    emitToOne('loggedIn', user)

    if (user.game && getGame(user.game)) {
      console.log('User has a game and will be logged on')

      emitToOne('joinedGame', getGame(user.game).state())
    } else if (user.game) {
      user.game = null
    }
  })
  socket.on('getAvailableGames', userId => {
    if (!getUser(userId)) return

    let games = getAvailableGames(getUser(userId))

    emitToOne('availableGamesSent', games)
  })
  socket.on('newGame', userId => {
    if (!getUser(userId)) return
    if (getUser(userId).game && getGame(getUser(userId).game)) {
      console.log(`${userId} @ on.newGame: already registered`)
      return
    }

    let gameState = createGame(userId)
    console.log('created game: ' + gameState.id)
    emitToOne('joinedGame', gameState)
    io.emit('gameCreated', {
      id: gameState.id, 
      size: gameState.size, 
      status: gameState.status, 
      players: gameState.players, 
    })
  })
  socket.on('joinGame', (gameId, userId) => {
    // ADD ABILITY TO JOIN WHEN LEFT GAME!!!
    if (!getUser(userId)) return
    if (!getGame(gameId)) return

    let gameState = joinGame(gameId, userId)

    emitToOne('joinedGame', gameState)
    emitToMany(gameId, 'updateGame', gameState)
    // emit this to remove it from the lobby
    io.emit('gameClosed', gameState.id)
  })
  socket.on('leaveGame', userId => {
    if (!getUser(userId) || 
        !getUser(userId).game || 
        !getGame(getUser(userId).game)) {
    return
    }

    let gameState = leaveGame(userId)
    let status = gameState.status

    socket.leave(gameState.id)
    emitToOne('leftGame')

    if (status === 'Waiting') {
      emitToMany(gameState.id, 'updateGame', gameState)
    }
    if (status === 'Closed') {
      io.emit('gameClosed', gameState.id)
    }

  })
  socket.on('getHand', userId => {
    if (!getUser(userId)) return
    if (!getGame(getUser(userId).game)) return

    let user = getUser(userId)
    let game = getGame(user.game)

    emitToOne('hand', game.hand(user))
  })

  // game actions
  socket.on('move', (gameId, card) => {
    if (!getGame(gameId)) return

    let game = getGame(gameId)

    emitToMany(gameId, 'updateGame', game.move(card))
  })
  socket.on('pickUp', userId => {
    if (!getUser(userId)) return
    if (!getGame(getUser(userId).game)) return

    let user = getUser(userId)
    let game = getGame(user.game)

    emitToMany('updateGame', game.pickUp(user), game.id)
  })
  socket.on('muck', userId => {
    if (!getUser(userId)) return
    if (!getGame(getUser(userId).game)) return

    let user = getUser(userId)
    let game = getGame(user.game)

    emitToMany('updateGame', game.muck(user), game.id)
  })

  /**
   * When socket disconnects, remove it from the player
   */
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)
    if (!getUser(socket.id)) return

    let user = getUser(socket.id)

    if (user.game) {
      if (!getGame(user.game)) {
        user.game = null
        return
      }

      let gameId = user.game
      let gameState = leaveGame(socket.id)
      let status = gameState.status
      console.log('==================')
      console.log(status)
      if (status === 'Closed') {
        io.emit('gameClosed', gameState.id)
      }
      if (status === 'Playing') {
        emitToMany('updateGame', gameState, gameState.id)
      }
    }

    user.socketIds = user.socketIds.filter(id => id !== socket.id)

  })

  // ======================
  // events that game emits
  // ======================

  function addGameListeners() {

    if (!zzz.listeners('refresh').length) {
      zzz.on('refresh', (gameId, state) => {
        // console.log(state)
        emitToMany(gameId, 'updateGame', state)
      })
    }

    if (!zzz.listeners('time').length) {
      zzz.on('time', (gameId, timePassed) => {
        // console.log(timePassed)
        emitToMany(gameId, 'time', timePassed)
      })
    }
    
    if (!zzz.listeners('gameOver').length) {
      zzz.on('gameOver', state => {
        emitToMany(state.id, 'gameOver', state)
      })
    }

    if (!zzz.listeners('closeGame').length) {
      zzz.on('closeGame', gameId => {   
        emitToMany(gameId, 'leftGame')
        io.emit('gameClosed', gameId)
        games.splice(games.findIndex(game => game.id === gameId), 1)
      })
    }

    return
  } addGameListeners()

})