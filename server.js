const socket = require('socket.io')
const http = require("http")
const url = require("url")
const fs = require('fs')

const port = 2000
const index = fs.readFile('index.html', (error, file) => file)

const User = require('./turakas/modules/user')
const Game = require('./turakas/modules/game')
const users = []
const games = []

const turakas = require('./turakas/turakas')

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
    return users.find(user => user.id === id)
  }
  function getWaitingGames() {
    return games.filter(game => game.state === 'Waiting')
  }
  function createGame(userId) {
    console.log('Creating new game for ' + userId)
    // create new game with max players x
    let game = Game(2)
        game.join(userId)
    // add game to collection
    games.push(game)
    // create a channel for this socket
    socket.join(game.id)
  
    return game.getStateFor(userId)
  }
  
  socket.on('login', name => {
    let userIp = socket.request.connection.remoteAddress

    function getUser(name, ip, socketId) {
      // cant use getUser() because we have extra conditions
      let user = users.find( user => 
        user.name     === name      && 
        user.ip       === ip        && 
        user.socketId === socket.id
      )
    
      if (user) {
        console.log('User exists')
        user.socketId = socketId
    
        return user
      } else {
        console.log('Adding new user')
        
        let newUser = User(name, ip, socketId)
        users.push(newUser)
    
        return newUser
      }
    }

    socket.emit('userRegistered', getUser(name, userIp, socket.id))
  })

  socket.on('newGame', userId => {
    socket.emit('updateGame', createGame(userId))
    io.emit('waitingGames', getWaitingGames())
  })

  socket.on('joinGame', (gameId, userId) => {
    let game = getGame(gameId)
        game.join(userId)

    socket.join(game.id)

    game.players.forEach(player => {
      io.to( getUser(player).socketId )
        .emit( 'updateGame', game.getStateFor(userId) )
    })
  })

  socket.on('leaveGame', (gameId, userId) => {
    let game = getGame(gameId)
        game.leave(userId)
    let user = getUser(userId)
        user.game = null
    console.log(user)
    console.log(games)
    socket.leave(game.id)

    if (game.state !== 'Closed') {
      socket.emit('updateGame', {})
      game.players.forEach(player => {
        io.to( getUser(player).socketId )
        .emit( 'updateGame', game.getStateFor(userId) )
      })
    } else {
      // remove game from collection
      games.splice(games.indexOf(game), 1)
      socket.emit('updateGame', {state: game.state})
      // send lobby update to all others
      socket.broadcast.emit('waitingGames', getWaitingGames())
    }
  })

  socket.on('getWaitingGames', () => {
    socket.emit('waitingGames', getWaitingGames())
  })

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)
    let user = users.find(user => user.socketId === socket.id)
    if (user) {
      user.socketId = null
    }
  })
})