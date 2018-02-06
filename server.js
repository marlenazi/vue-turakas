const socket = require('socket.io')
const http = require("http")
const url = require("url")
const fs = require('fs')

const port = 2000
const index = fs.readFile('index.html', (error, file) => file)

const User = require('./turakas/modules/user')
const Game = require('./turakas/modules/game')
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
    return users.find(user => user.id === id) || users.find(user => user.socketId === id)
  }
  function getAvailableGames() {
    return games.filter(game => game.status() === 'Waiting')
  }
  function login(name, ip, socketId) {
    console.log(`Logging in ${name}`)
    // get user from users or create a new one
    console.log(users)
    let user = users.find(user => user.name === name && user.ip === ip)
             || User(name, ip)

    if (user.hasOwnProperty('socketId')) {
      console.log('User exists')
      /* here could check if connection is still active (ie one client, two tabs)
         and then send a message to handle double connection */
    } else {
      console.log('Adding new user')
      users.push(user)
    }
    // assign socketId, so we can send data to specific user
    user.socketId = socketId

    return user
  }
  function createGame(userId) {
    let user = getUser(userId)
    let game = Game()

    games.push(game)
    game.join(user)
    socket.join(game.id)

    console.log(games)
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
    let user = getUser(userId)
    let game = getGame(user.game)
    
    game.leave(user)
    
    let gameState = game.state()

    if (gameState.status === 'Closed') {
      games.splice(games.indexOf(game), 1)
    }

    return gameState
  }

  socket.on('login', name => {
    let ip = socket.request.connection.remoteAddress
    let user = login(name, ip, socket.id)

    socket.emit('loggedIn', user)

    if (user.game) {
      socket.emit('joinedGame', getGame(user.game).state())
    }
  })
  socket.on('getAvailableGames', userId => {
    socket.emit('availableGames', getAvailableGames())
  })
  socket.on('newGame', userId => {
    let gameState = createGame(userId)

    socket.emit('joinedGame', gameState)
    io.emit('availableGames', getAvailableGames())
  })
  socket.on('joinGame', (gameId, userId) => {
    let gameState = joinGame(gameId, userId)

    socket.emit('joinedGame', gameState)
    io.to(gameState.id).emit('updateGame', gameState)
    io.emit('availableGames', getAvailableGames())
  })
  socket.on('leaveGame', userId => {
    let gameState = leaveGame(userId)
    let status = gameState.status

    socket.emit('leftGame')

    if (status === 'Halted' || status === 'Waiting') {
      io.to(gameState.id).emit('updateGame', gameState)
    }

    io.emit('availableGames', getAvailableGames())
  })
  socket.on('getHand', userId => {
    // console.log('getting a hand')
    let user = getUser(userId)
    let game = getGame(user.game)

    socket.emit('hand', game.hand(user))
  })
  socket.on('move', (gameId, card) => {
    // console.log(card)
    let game = getGame(gameId)

    io.to(game.id).emit('updateGame', game.move(card))
  })
  socket.on('pickUp', userId => {
    let user = getUser(userId)
    let game = getGame(user.game)

    io.to(game.id).emit('updateGame', game.pickUp(user))
  })
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)

    let user = getUser(socket.id)

    if (user && user.game) {
      let gameId = user.game
      let gameState = leaveGame(socket.id)
      let status = gameState.status

      if (status === 'Closed') {
        io.emit('availableGames', getAvailableGames())
      }
      if (status === 'Playing') {
        io.to(gameId).emit('updateGame', gameState)
      }
    }

  })
})