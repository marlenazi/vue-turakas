const socket = require('socket.io')
const http = require("http")
const url = require("url")
const fs = require('fs')

const port = 2000
const index = fs.readFile('index.html', (error, file) => file)

const User = require('./turakas/modules/user')
const Game = require('./turakas/modules/game')
const zzz = require('./turakas/modules/emitter')
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
    return users.find(user => user.id === id)                             || 
           users.find(user => user.socketIds.some(socId => socId === id)) || 
           null
  }
  function getAvailableGames(user) {
    let playingGame  = [],
      availableGames = []

    if (user && user.game && getGame(user.game)) {
      playingGame = [getGame(user.game)]
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

    let user = getUser(userId)
    if (!user.game) return null
    let game = getGame(user.game)
    
    if (game) {
      
      game.leave(user)
      
      let gameState = game.state()
      if (gameState.status === 'Closed') {
        console.log('Closing game ' + game.id)
        games.splice(games.indexOf(game), 1)
      }
      
      return gameState
    } else return
  }
  function emitToUser(event, data) {
    // this loops over all socketIds connected to user and 
    // emits same event and data
    console.log('checking from emitToUser')
    console.log(event, data)
    getUser(socket.id).socketIds.forEach(socId => {
      io.to(socId).emit(event, data)
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

    emitToUser('loggedIn', user)

    if (user.game && getGame(user.game)) {
      emitToUser('joinedGame', getGame(user.game).state())
    } else if (user.game) {
      delete user.game
    }
  })
  socket.on('getAvailableGames', userId => {
    if (!getUser(userId)) return

    let games = getAvailableGames(getUser(userId))

    socket.emit('availableGames', games)
  })
  socket.on('newGame', userId => {
    if (!getUser(userId)) return

    let gameState = createGame(userId)

    socket.emit('joinedGame', gameState)
    io.emit('gameCreated', {
      id: gameState.id, 
      size: gameState.size, 
      status: gameState.status, 
      players: gameState.players, 
    })
  })
  socket.on('joinGame', (gameId, userId) => {
    if (!getUser(userId)) return
    if (!getGame(gameId)) return

    let gameState = joinGame(gameId, userId)

    socket.emit('joinedGame', gameState)
    io.to(gameState.id).emit('updateGame', gameState)
    io.emit('gameClosed', gameState.id)
  })
  socket.on('leaveGame', userId => {
    if (!getUser(userId) || !getUser(userId).game ) return

    let gameState = leaveGame(userId)
    let status = gameState.status

    socket.leave(gameState.id)
    socket.emit('leftGame')

    if (status === 'Waiting') {
      io.to(gameState.id).emit('updateGame', gameState)
    }
    if (status === 'Closed') {
      io.emit('gameClosed', gameState.id)
    }

  })
  socket.on('getHand', userId => {
    if (!getUser(userId)) return
    if (!getGame(getUser(userId))) return

    let user = getUser(userId)
    let game = getGame(user.game)

    emitToUser('hand', game.hand(user))
  })
  socket.on('move', (gameId, card) => {
    if (!getGame(gameId)) return

    let game = getGame(gameId)

    io.to(game.id).emit('updateGame', game.move(card))
  })
  socket.on('pickUp', userId => {
    if (!getUser(userId)) return
    if (!getGame(getUser(userId))) return

    let user = getUser(userId)
    let game = getGame(user.game)

    io.to(game.id).emit('updateGame', game.pickUp(user))
  })
  socket.on('muck', userId => {
    if (!getUser(userId)) return
    if (!getGame(getUser(userId))) return

    let user = getUser(userId)
    let game = getGame(user.game)

    io.to(game.id).emit('updateGame', game.muck(user))
  })
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)
    if (!getUser(socket.id)) return

    let user = getUser(socket.id)

    if (user.game) {
      let gameId = user.game
      let gameState = leaveGame(socket.id)
      let status = gameState.status

      if (status === 'Closed') {
        io.emit('gameClosed', gameState.id)
      }
      if (status === 'Playing') {
        io.to(gameId).emit('updateGame', gameState)
      }
    }

    user.socketIds = user.socketIds.filter(id => id !== socket.id)

  })
})

// ======================
// events that game emits
// ======================

zzz.on('refresh', (gameId, state) => {
  console.log(state)
  io.to(gameId).emit('updateGame', state)
})
zzz.on('time', (gameId, timePassed) => {
  // console.log(timePassed)
  io.to(gameId).emit('time', timePassed)
})
zzz.on('gameOver', state => {
  io.to(state.id).emit('gameOver', state)
})
zzz.on('closeGame', gameId => {

  io.to(gameId).emit('leftGame')
  games.splice(games.findIndex(game => game.id === gameId), 1)
})