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
    return users.find(user => user.id === id)
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

    console.log(games)
    return true
  }
  function leaveGame(userId) {
    let user = getUser(userId)
    let game = getGame(user.game)
    
    game.leave(user)
  }

  socket.on('login', name => {
    let ip = socket.request.connection.remoteAddress
 
    let user = login(name, ip, socket.id)
    
    socket.emit('loggedIn', user)
  })
  socket.on('newGame', userId => {
    createGame(userId)
    socket.emit('joinedGame')
  })
  socket.on('leaveGame', userId => {
    leaveGame(userId)

    socket.emit('leftGame')
  })
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)
  })
})