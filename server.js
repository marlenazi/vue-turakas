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
  console.log(users)

  function login(name, ip, socketId) {
    console.log(`Logging in ${name}`)
    // get user from users or create a new one
    console.log(users)
    let user = users.find(user => user.name === name && user.ip === ip)
             || User(name, ip)

    if (user.hasOwnProperty('socketId')) {
      console.log('User exists')
      /* here might check if connection is still active (ie one client, two tabs)
         and then send a message to alert or handle double connection*/
    } else {
      console.log('Adding new user')
      users.push(user)
    }
    // assign socketId, so we can send data to specific user
    user.socketId = socketId

    return user
  }
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
    // if user does not exist, don't create a game
    if (!getUser(userId)) return
    // create new game with max users x
    let game = Game(2)
        game.join(userId)
    // add game to collection
    games.push(game)
    // create a channel for this socket
    socket.join(game.id)
    // assign game to user
    getUser(userId).game = game.id

    console.log(games)
    return game.getStateFor(userId)
  }
  function addPlayer(gameId, userId) {
    let game = getGame(gameId)

    if (game) {
      // if game exists, join user and assign gameId to user
      if (game.users.indexOf(userId) === -1) {
        game.join(userId)
        getUser(userId).game = gameId
      } else {
        console.log('User already registered')
        console.log(users)
      }

      return game          
    } else return
  }
  function removePlayer(gameId, userId) {
    let game = getGame(gameId)
    game.leave(userId)
    let user = getUser(userId)
    user.game = null

    return game
  }
  function sendStateToPlayers(game) {
    game.users.forEach(userId => {
      io.to( getUser(userId).socketId )
        .emit( 'updateGame', game.getStateFor(userId) )
    })
  }
  socket.on('login', name => {
    let ip = socket.request.connection.remoteAddress
    // define it here for we want to use it inside and outside of newUser() 
    let user = login(name, ip, socket.id)
    
    socket.emit('loggedIn', user)
    // if user has a game attached, try to connect them with that game
    // if it does not exist any more, remove assigned game
    if (user.game) {
      console.log(user)
      let game = addPlayer(user.game, user.id)

      if (game) {
      /* because we added reconnected player, 
         lets update state to all who are connected */
        sendStateToPlayers(game)
      } else {
        user.game = null
      }
    }
  })

  socket.on('newGame', userId => {
    socket.emit('updateGame', createGame(userId))
    io.emit('waitingGames', getWaitingGames())
  })

  socket.on('joinGame', (gameId, userId) => {
    let game = addPlayer(gameId, userId)

    socket.join(game.id)
    
    sendStateToPlayers(game)
  })

  socket.on('leaveGame', (gameId, userId) => {
    if (!getGame(gameId)) {
      console.log('Game does not exist in leaveGame()')
      socket.emit('updateGame', {})
      return
    }
    let game = removePlayer(gameId, userId)

    socket.leave(gameId)

    if (game.state !== 'Closed') {
      // emit to user who left
      socket.emit('updateGame', {})
      // emit changes to all others
      game.users.forEach(user => {
        io.to(getUser(user).socketId)
          .emit('updateGame', game.getStateFor(userId))
      })
    } else {
      // remove game from collection
      games.splice(games.indexOf(game), 1)
      socket.emit('updateGame', {state: game.state})
      // send lobby update to all others
      io.emit('waitingGames', getWaitingGames())
    }
  })

  socket.on('getWaitingGames', () => {
    socket.emit('waitingGames', getWaitingGames())
  })

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)

    console.log(users)
    let user = users.find(user => user.socketId === socket.id)
    
    if (user) {
      if (user.game !== null) {
        let game = getGame(user.game)
        game.leave(user.id)

        game.users.forEach(user => {
          io.to( getUser(user).socketId )
            .emit( 'updateGame', game.getStateFor(user.Id) )
        })
        io.emit('waitingGames', getWaitingGames())
      }  
      user.socketId = null
    }
  })
})