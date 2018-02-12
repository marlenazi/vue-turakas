const socket = require('socket.io')
const http = require("http")
const url = require("url")
const fs = require('fs')

const port = 2000
const index = fs.readFileSync('./index.html', (error, file) => {
  if (err) throw err 
  return file
})
const bundle = fs.readFileSync('./dist/build.js', (error, file) => {
  if (err) throw err 
  return file
})
const logo = fs.readFileSync('./dist/theFool.svg', (error, file) => {
  if (err) throw err 
  return file
})
const map = fs.readFileSync('./dist/build.js.map', (error, file) => {
  if (err) throw err 
  return file
})

const User = require('./turakas/modules/user')
const Game = require('./turakas/modules/game')
const zzz = require('./turakas/modules/emitter').setMaxListeners(50)
// collections for users and games
const users = []
const games = []

const io = socket(http.createServer( (req, res) => {
  //send index.html
  console.log(`${req.url} requested`)
  //console.log(req.url)
  if (req.url === '/') {
     res.writeHead(200, {'Content-Type': 'text/html'});
     res.end(index); 
  } else if (req.url === '/dist/build.js') {
  
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(bundle);
  }else if (req.url === '/dist/theFool.svg?691194fb28c221f6db35d9b6f1b23bdf') {
  
    res.writeHead(200, {'Content-Type': 'image/svg+xml'});
    res.end(logo);
  } else if (req.url === '/dist/build.js.map') {
  
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(map);
  }
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
  function userHasParallelSockets(id) {
    
    return getUser(id).socketIds.length > 1 ? true : false
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
    if (!getUser(userId)) {
      console.log('')
      return
    }
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
    if (theOne) {
      theOne.socketIds.forEach(socId => {
        io.to(socId).emit(event, data)
      })
    } else {
      socket.emit(event, data)
    }
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
    console.log(user.id, user.name)
    if (user.game && getGame(user.game)) {
      console.log(`${user.id} resumes game: ${user.game}`)

      emitToOne('joinedGame', getGame(user.game).state())
    } else if (user.game) {
      console.log(`did not find game ${user.game}, user.game will be null`)
      if (user.away) {
        console.log('user is set as Away. Setting away to null')
        user.away = null
      }
      user.game = null
    }
  })
  socket.on('getAvailableGames', userId => {
    if (!getUser(userId) || !getUser(socket.id)) {
      console.log(`${userId} not found @ on.getAvailableGames`)
      return
    }

    let games = getAvailableGames(getUser(userId))

    emitToOne('availableGamesSent', games)
  })
  socket.on('newGame', userId => {
    if (!getUser(userId)) {
      console.log(`${userId} not found @ on.newGame`)
      return
    }
    if (getUser(userId).game && getGame(getUser(userId).game)) {
      console.log(`${userId} @ on.newGame: already registered`)
      return
    }
    console.log(getUser(userId))

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
    if (!getUser(userId)) {
      console.log(`User ${userId} not found @ on.joinGame`)
      return
    }
    if (!getGame(gameId)) {
      console.log(`Game ${gameId} not found @ on.joinGame`)
      return
    }

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
      let user = getUser(socket.id)

      let err = !user ? 'NO USER' 
                      : !user.game ? 'NO GAME SET FOR USER' 
                                   : 'GAME DOES NOT EXIST'

      console.log('failed @ leaveGame: ' + err) 
      if (user) {
        emitToOne('leftGame')
      } else {
        emitToOne('serverError')
      }     
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
    if (!getUser(userId)) {
      console.log(`User ${userId} not found @ on.getGame`)
      return
    }
    if (!getGame(getUser(userId).game)) {
      console.log(`Game ${user.game} not found @ on.getGame`)
      return
    }

    let user = getUser(userId)
    let game = getGame(user.game)

    emitToOne('hand', game.hand(user))
  })

  // game actions
  socket.on('move', card => {
    if (!getUser(socket.id) || !getUser(socket.id).game) {
      console.log(`User for socketId ${socket.id} not found OR has not game attached @ on.move`)
      console.log(users)
      return
    }
    if (!getGame(getUser(socket.id).game)) {
      console.log(`Game ${getUser(socket.id).game} not found @ on.move`)
      console.log(games)
      return
    }

    let game = getGame(getUser(socket.id).game)

    emitToMany(game.id, 'updateGame', game.move(card))
  })
  socket.on('pickUp', userId => {
    if (!getUser(socket.id) || !getUser(socket.id).game) {
      console.log(`User for socketId ${socket.id} not found OR has not game attached @ on.pickUp`)
      console.log(users)
      return
    }
    if (!getGame(getUser(socket.id).game)) {
      console.log(`Game ${getUser(socket.id).game} not found @ on.pickUp`)
      console.log(games)
      return
    }

    let user = getUser(userId)
    let game = getGame(user.game)

    emitToMany('updateGame', game.pickUp(user), game.id)
  })
  socket.on('muck', userId => {
    if (!getUser(socket.id) || !getUser(socket.id).game) {
      console.log(`User for socketId ${socket.id} not found OR has not game attached @ on.muck`)
      console.log(users)
      return
    }
    if (!getGame(getUser(socket.id).game)) {
      console.log(`Game ${getUser(socket.id).game} not found @ on.muck`)
      console.log(games)
      return
    }

    let user = getUser(userId)
    let game = getGame(user.game)

    emitToMany('updateGame', game.muck(user), game.id)
  })

  /**
   * When socket disconnects, remove it from the player
   */
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)
    if (!getUser(socket.id)) {
      console.log('tried to disconnect, but user was not found: socId: ' + socket.id)
      return
    }

    let user = getUser(socket.id)
    console.log(user)
    if (user.game) {
      if (!getGame(user.game)) {
        console.log('failed to get game for gameId: ' + user.game)
        user.game = null
        return
      }
      
      if (userHasParallelSockets(user.id)) {
        console.log(`@ disconnect: user ${user.id} has parallel connections`)
        console.log(user.socketIds)
      } else {
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


/**
 *    =================================================
 *    =================   Thoughts   ==================
 *    =================================================
 * 
 * -- Error handling is rudimentary and uses a bad pattern 
 * -- User validation should be handled smarter
 * -- File serving must be handled. Express?
 * -- When user gets stuck, send back error event that resets the game
 */