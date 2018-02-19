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
const watermark = fs.readFileSync('./dist/theFoolWatermark.svg', (error, file) => {
  if (err) throw err 
  return file
})
const map = fs.readFileSync('./dist/build.js.map', (error, file) => {
  if (err) throw err 
  return file
})
const Game = require('./turakas/modules/game')
const zzz = require('./turakas/modules/emitter')
const items = require('./turakas/modules/items')
// collections for users and games
const clients = items('clients')
const games = items('games')

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
  }else if (req.url === '/dist/theFool.svg?5861719d7334e93a1ca838dae1b6236f') {
  
    res.writeHead(200, {'Content-Type': 'image/svg+xml'});
    res.end(logo);
  } else if (req.url === '/dist/theFoolWatermark.svg?5f7d429da9a9bf6132aa70328b2c1804') {
  
    res.writeHead(200, {'Content-Type': 'image/svg+xml'});
    res.end(watermark);
  } else if (req.url === '/dist/build.js.map') {
  
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(map);
  }
}).listen(port))
console.log('Listening to ' + port)

// socket connection and events
io.on('connection', socket => {
  console.log(`Socket ${socket.id} connected`)

  function userHasParallelSockets(id) {
    
    return clients.get(id).sockets.length > 1 ? true : false
  }
  function getAvailableGames(client) {
    let playingGame  = []
    let availableGames = []

    if (client && client.game && games.get(client.game)) {
      if (games.get(client.game).status() !== 'Waiting') {

        playingGame = [games.get(client.game)]
      }
    }
    console.log(games.getAll())
    availableGames = games.getAll().filter( game => game.status() === 'Waiting')

    return playingGame.concat(availableGames).map(game => game.state())
      
  }
  function createGame(userId) {

    let client = clients.get(userId)
    let game = Game()

    games.add(game)
    game.join(client)
    socket.join(game.id)

    return game.state()
  }
  function joinGame(gameId, userId) {
    let client = clients.get(userId)
    let game = games.get(gameId)

    game.join(client)
    socket.join(game.id)

    return game.state()
  }
  function leaveGame(userId) {
    console.log('Func leaveGame')
    if (!clients.get(userId)) {
      console.log('User not found @ leaveGame')
      return
    }
    if (!games.get(clients.get(userId).game)) return

    let client = clients.get(userId)
    let game = games.get(client.game)
      
    game.leave(client)
    
    let gameState = game.state()

    if (gameState.status === 'Closed') {
      console.log('Closing game ' + game.id)
      client.game = null
      games.splice(games.indexOf(game), 1)
    }
      
    return gameState
  }
  function destroyGame(id) {
    /**
     * For all players playing, sets game property to null
     * Removes the game from games collection
     */

    try {
      let game = games.get(id)
    
      game.state().players
      
      games.splice(games.findIndex(game => game.id === id), 1)
    } catch (error) {
      console.log(error)
    }
    
  }
  function emitToClient(event, data = '', id = socket.id) {
    // this loops over all sockets connected to client and 
    // emits same event and data
    let theOne = clients.get(id)

    if (theOne) {
      theOne.sockets.forEach(socId => {
        io.to(socId).emit(event, data)
      })
    } else {
      console.log(`client not found, sending - ${event} - to socket`)
      socket.emit(event, data)
    }
  }
  function emitToPlayers(gameId, event, data = '') {
    /**
     * Emits to all players who are registered to a game with provided id
     * If a player is listed in the game, but does not have the same game id
     *    attached any more (perhaps left and started another game), we skip
     *    the player, not to unexpectedly throw them out of the new game.
     *    If player is listed, but game property is null, they are new users 
     *    and should get update that game has started.
     * If provided game id does not match any ongoing games, we return a 
     *    GAME_NOT_FOUND error
     */

    let game = games.get(gameId)
    if (!game) return new Error('emitToPlayers: GAME_NOT_FOUND')

    let players = game.state().players

    players.forEach(player => {
      if (player.game === game.id || !player.game) {

        emitToClient(event, data, player)
      }
    })
  }

  socket.on('login', name => {
    if (!name || typeof name !== 'string') return
    /**
     * we get connection ip and compare both name and ip to existing users
     * if we have a match, we return that client to the client, 
     * if not, we create a new one and return it to the client
     * 
     * then we check if it had a game attached and if so, emit the state
     * to all sockets that are connected to client 
     */

    let ip = socket.request.connection.remoteAddress;
    let client = clients.match({ ip, name }) || clients.add({ ip, name });

    client.sockets.push(socket.id);

    emitToClient('loggedIn', client)

    if (client.game && games.get(client.game)) {

      emitToPlayers(client.game, 'updateGame', games.get(client.game).state())
    }
  })
  socket.on('getAvailableGames', userId => {
    if (!clients.get(userId) || !clients.get(socket.id)) {
      console.log(`${userId} not found @ on.getAvailableGames`)
      emitToClient('serverError') 
      return
    }

    let games = getAvailableGames(clients.get(userId))

    emitToClient('availableGamesSent', games, userId)
  })
  socket.on('newGame', userId => {
    if (!clients.get(userId)) {
      console.log(`${userId} not found @ on.newGame`)
      emitToClient('serverError')
      return
    }
    if (clients.get(userId).game && games.get(clients.get(userId).game)) {
      console.log(`${userId} @ on.newGame: already registered`)
      return
    }
    console.log(clients.get(userId))

    let gameState = createGame(userId)
    console.log('created game: ' + gameState.id)
    emitToClient('joinedGame', gameState)
    io.emit('gameCreated', {
      id: gameState.id, 
      size: gameState.size, 
      status: gameState.status, 
      players: gameState.players, 
    })
  })
  socket.on('joinGame', (gameId, userId) => {
    if (!clients.get(userId)) {
      console.log(`User ${userId} not found @ on.joinGame`)
      console.log(clients.getAll())
      emitToClient('serverError')
      return
    }
    if (!games.get(gameId)) {
      console.log(`Game ${gameId} not found @ on.joinGame`)
      console.log(games.getAll())
      return
    }

    let gameState = joinGame(gameId, userId)

    emitToClient('joinedGame', gameState)
    emitToPlayers(gameId, 'updateGame', gameState)
    // emit this to remove it from the lobby
    io.emit('gameClosed', gameState.id)
  })
  socket.on('leaveGame', userId => {
    if (!clients.get(userId) || 
        !clients.get(userId).game || 
        !games.get(clients.get(userId).game)) {
      let client = clients.get(socket.id)

      let err = !client ?              'NO USER' 
                      : !client.game ? 'NO GAME SET FOR USER' 
                                   : 'GAME DOES NOT EXIST'

      console.log('failed @ leaveGame: ' + err) 
      if (client) {
        emitToClient('leftGame')
      } else {
        emitToClient('serverError')
      }     
    return
    }

    let gameState = leaveGame(userId)
    let status = gameState.status

    socket.leave(gameState.id)
    emitToClient('leftGame')

    if (status === 'Waiting') {
      emitToPlayers(gameState.id, 'updateGame', gameState)
    }
    if (status === 'Closed') {
      io.emit('gameClosed', gameState.id)
    }

  })
  socket.on('getHand', userId => {
    let client = clients.get(userId)

    if (!client) {
      console.log(`User ${userId} not found @ on.getHand`)
      emitToClient('serverError')
      return
    }
    if (!client.game || !games.get(client.game)) {
      console.log(`Game ${client.game} not found @ on.getHand`)
      emitToClient('leftGame')
      return
    }

    let game = games.get(client.game)

    emitToClient('hand', game.hand(client))
  })

  // game actions
  socket.on('move', card => {
    if (!clients.get(socket.id) || !clients.get(socket.id).game) {
      console.log(`User for socketId ${socket.id} not found OR has not game attached @ on.move`)
      console.log(users)
      if (!clients.get(socket.id)) { 
        emitToClient('serverError') 
      }
      return
    }
    if (!games.get(clients.get(socket.id).game)) {
      console.log(`Game ${clients.get(socket.id).game} not found @ on.move`)
      console.log(games)
      return
    }

    let game = games.get(clients.get(socket.id).game)

    emitToPlayers(game.id, 'updateGame', game.move(card))
  })
  socket.on('pickUp', userId => {
    if (!clients.get(socket.id) || !clients.get(socket.id).game) {
      console.log(`User for socketId ${socket.id} not found OR has not game attached @ on.pickUp`)
      console.log(users)
      if (!clients.get(socket.id)) { 
        emitToClient('serverError') 
      }
      return
    }
    if (!games.get(clients.get(socket.id).game)) {
      console.log(`Game ${clients.get(socket.id).game} not found @ on.pickUp`)
      console.log(games)
      return
    }

    let client = clients.get(userId)
    let game = games.get(client.game)

    emitToPlayers('updateGame', game.pickUp(client), game.id)
  })
  socket.on('muck', userId => {
    if (!clients.get(socket.id) || !clients.get(socket.id).game) {
      console.log(`User for socketId ${socket.id} not found OR has not game attached @ on.muck`)
      console.log(users)
      if (!clients.get(socket.id)) { 
        emitToClient('serverError') 
      }
      return
    }
    if (!games.get(clients.get(socket.id).game)) {
      console.log(`Game ${clients.get(socket.id).game} not found @ on.muck`)
      console.log(games)
      return
    }

    let client = clients.get(userId)
    let game = games.get(client.game)

    emitToPlayers('updateGame', game.muck(client), game.id)
  })

  /**
   * When socket disconnects, remove it from the player
   */
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)

    // get disconnecting player

    if (!clients.get(socket.id)) {
      console.log('tried to disconnect, but client was not found: socId: ' + socket.id)
      emitToClient('serverError') 
      return
    }

    let client = clients.get(socket.id)
    console.log(client)
    if (client.game) {
      if (!games.get(client.game)) {
        console.log('failed to get game for gameId: ' + client.game)
        client.game = null
        return
      }
      
      if (userHasParallelSockets(client.id)) {
        console.log(`@ disconnect: client ${client.id} has parallel connections`)
        console.log(client.sockets)
      } else {
        let gameState = leaveGame(socket.id)
        let status = gameState.status
        console.log('========= Disconnect =========')
        console.log(gameState.id)
        console.log(status)
        if (status === 'Closed') {
          io.emit('gameClosed', gameState.id)
        }
        if (status === 'Playing') {
          emitToPlayers('updateGame', gameState, gameState.id)
        }
      }

    }

    client.sockets = client.sockets.filter(id => id !== socket.id)

    
  })

  // ======================
  // events that game emits
  // ======================

  function addGameListeners() {

    if (!zzz.listeners('refresh').length) {
      zzz.on('refresh', (gameId, state) => {
        // console.log(state)
        emitToPlayers(gameId, 'updateGame', state)
      })
    }

    if (!zzz.listeners('time').length) {
      /**
       * Game emits timer info.
       * 
       * Parameters: 
       *    gameId: id of a game that is sending
       *    timePassed: how many seconds have gone
       *    limit: limit of seconds that triggers action
       * 
       * Sends timer info to client as a time object with properties 
       *    passed and limit
       */

      zzz.on('time', (gameId, timePassed, limit) => {
        // console.log(timePassed, limit)
        
        emitToPlayers(gameId, 'time', {
          passed: timePassed,
          limit
        })
      })
    }
    
    if (!zzz.listeners('gameOver').length) {
      zzz.on('gameOver', state => {
        emitToPlayers(state.id, 'gameOver', state)
      })
    }

    if (!zzz.listeners('closeGame').length) {
      /**
       * Listenes for closeGame from game
       * Emits leftGame to all players, so they are returned to the client lobby
       * Emits to all users gameClosed, so it is removed from available games
       */

      zzz.on('closeGame', id => {
        try {
          console.log(`Closing game ${id}`)

          emitToPlayers(id, 'leftGame')
          io.emit('gameClosed', id)

          console.log(games)

          destroyGame(id)
        } catch (error) {
          console.log(error)
        }
      })
    }

    return
  } addGameListeners()

})
