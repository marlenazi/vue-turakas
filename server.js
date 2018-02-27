const socket = require("socket.io");
const http = require("http");
const fs = require("fs");

const port = 2000;

const index = fs.readFileSync("./index.html", (err, file) => {
  if (err) throw err;
  return file;
});
const bundle = fs.readFileSync("./dist/build.js", (err, file) => {
  if (err) throw err;
  return file;
});
const logo = fs.readFileSync("./dist/theFool.svg", (err, file) => {
  if (err) throw err;
  return file;
});
const watermark = fs.readFileSync(
  "./dist/theFoolWatermark.svg",
  (err, file) => {
    if (err) throw err;
    return file;
  }
);
const map = fs.readFileSync("./dist/build.js.map", (err, file) => {
  if (err) throw err;
  return file;
});

const zzz = require("./turakas/modules/emitter");
const clientStore = require("./turakas/modules/clientStore");
const gameStore = require("./turakas/modules/gameStore");

// collections for clients and games
// initialize games with clients, so games would have access to clients
const clients = clientStore();
const games = gameStore(clients);

const io = socket(
  http
    .createServer((req, res) => {
      //send index.html
      console.log(`${req.url} requested`);
      //console.log(req.url)
      if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(index);
      } else if (req.url === "/dist/build.js") {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        res.end(bundle);
      } else if (
        req.url === "/dist/theFool.svg?5861719d7334e93a1ca838dae1b6236f"
      ) {
        res.writeHead(200, { "Content-Type": "image/svg+xml" });
        res.end(logo);
      } else if (
        req.url ===
        "/dist/theFoolWatermark.svg?5f7d429da9a9bf6132aa70328b2c1804"
      ) {
        res.writeHead(200, { "Content-Type": "image/svg+xml" });
        res.end(watermark);
      } else if (req.url === "/dist/build.js.map") {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        res.end(map);
      }
    })
    .listen(port)
);
console.log("Listening to " + port);

// socket connection and events
io.on("connection", socket => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("login", name => {
    console.log('Logging in ' + name)
    /**
     * we get connection ip and compare both name and ip to existing clients
     * if we have a match, we return that client obj to the client,
     * if not, we create a new client obj and return it to the client
     *
     * then we check if it had a game attached and if so, emit the state
     * to all sockets that are connected to client
     */

    try {
      let ip = socket.request.connection.remoteAddress;
      let client = clients.match({ name, ip }) || clients.add({ name, ip });
  
      socket.join(client.id);
      // remember the client, so on disconnect we have access
      socket.$_client = client.id
  
      io.to(client.id).emit("loggedIn", {
        id: client.id,
        name: client.name
      });
      io.to(client.id).emit('updateHero', client)

      if (client.game) {
        let game = games.get(client.game)
        socket.join(game.id)
        // remember the game so on disconnect we have access
        socket._rooms.push(game.id)

        io.to(client.id).emit("joinedGame");
        io.to(client.id).emit("updateGame", game.state());
      }
      
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error.message)
    }
  });
  socket.on("getGameList", clientId => {
    try {
      let availableGames = games.getAvailable(clientId)
      io.to(clientId).emit("gameList", availableGames);
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error.message)
    }
  });
  socket.on("newGame", clientId => {
    console.log(`Creating new game for ${clientId}`);

    try {
      let client = clients.get(clientId);

      if (client.game) {
        io.to(clientId).emit("serverMessage", 'Already part of a game');
        return
      }

      let game = games.create()
      let response = game.join(client);
      console.log(response.msg)

      switch (response.msg) {
      case "Closed":
        io.to(clientId)
          .emit("serverMessage", "Tried to join a closed game");
        break
      case 'Joined':
        console.log("Created game: " + game.id + " and joined " + clientId);
       
        client.game = game.id
        socket.join(game.id);
        socket._rooms.push(game.id)
        
        io.to(client.id).emit("joinedGame");
        io.to(client.id).emit('updateHero', client)
        io.to(client.id).emit("updateGame", response.state);
        io.emit("updateGameList", {
          id: response.state.id,
          size: response.state.size,
          status: response.state.status,
          players: response.state.players
        });
        break
      }

    
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error.message)
    }
  });
  
  socket.on("joinGame", (clientId, gameId) => {
    console.log(`Joining ${clientId} to game ${gameId}`);

    try {
      let client = clients.get(clientId);
      let game = games.get(gameId);
      let response = game.join(client);
      console.log(response.msg)
      switch (response.msg) {
      case "Closed":
        io.to(clientId)
          .emit("serverMessage", "Game closed");
        break
      case 'Joined':
      case 'Resumed':
        console.log(`${client.id} ${client.name} ${response.msg} game ${game.id}`);
        
        client.game = gameId
        socket.join(game.id);
        socket._rooms.push(game.id)
        
        io.to(client.id).emit("joinedGame");
        io.to(client.id).emit('updateHero', client)
        io.to(game.id).emit("updateGame", response.state);

        io.emit("updateGameList", {
          id: response.state.id,
          size: response.state.size,
          status: response.state.status,
          players: response.state.players
        });
        break
      case 'Viewed':
        console.log(`${client.id} ${client.name} ${response.msg} game ${game.id}`);
        
        io.to(client.id).emit("joinedGame");
        io.to(client.id).emit("updateGame", response.state);
      } 

    } catch (error) {
      console.log(error);
      socket.emit("serverError", error.message);
    }
  });
  socket.on("leaveGame", clientId => {
    console.log(`leaving game for ${clientId}`)

    try {
      let client = clients.get(clientId)

      if (client.game) {
        let game = games.get(client.game)
        let response = game.leave(client)

        socket.leave(game.id);
        io.to(client.id).emit('updateHero', client)
        
        if (response.state.status === 'Closed') {
          console.log(`Client: ${clientId} left game: ${game.id}`)
          io.emit('updateGameList', response.state)
        }
      }
  
      io.to(clientId).emit("leftGame");

    } catch (error) {
      console.log(error);
      socket.emit("serverError", error.message)
    }
  });
  socket.on("getHand", clientId => {
    console.log(`returning hand to player ${clientId}`)

    try {
      let client = clients.get(clientId);
      let game = games.get(client.game);
      let hand = game.hand(client)

      io.to(clientId).emit("hand", hand);
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error.message)
    }
  });

  // game actions
  socket.on("move", (clientId, card) => {
    try {
      let client = clients.get(clientId)
      console.log(client)
      let game = games.get(client.game);
      let state = game.move(card)
      console.log(state.pagunidPossible)

      io.to(game.id).emit("updateGame", state);

    } catch (error) {
      console.log(error);
      socket.emit("serverError", error.message)
    }
  });
  socket.on("pickUp", clientId => {
    try {
      let client = clients.get(clientId);
      let game = games.get(client.game);
      let state = game.pickUp(client)
      console.log(state.pagunidPossible)

      io.to(game.id).emit("updateGame", state);
      
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error);
    }
  });
  socket.on("muck", clientId => {
    try {
      let client = clients.get(clientId);
      let game = games.get(client.game);
      let state = game.muck(client)

      console.log(state.pagunidPossible)

      io.to(game.id).emit("updateGame", state);
      
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error)
    }
  });

  socket.on('sendChat', chat => {
    console.log(chat.body)
    io.to(chat.gameId).emit('getChat', chat)
  })

  /**
   * When socket disconnects, remove it from the player
   */
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
    try {
      let client = clients.get(socket.$_client)

      socket._rooms.map(id => {
        let response = games.get(id).leave(client)
        io.emit('updateGameList', response.state)
      })
    } catch (error) {
      console.log(error)
    }
    
  });

  // ==========================
  //   events that game emits
  // ==========================

  function addGameListeners() {
    if (!zzz.listeners("refresh").length) {
      zzz.on("refresh", (gameId, state) => {
        // console.log(state)
        io.to(gameId).emit("updateGame", state);
      });
    }

    if (!zzz.listeners("time").length) {
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

      zzz.on("time", (gameId, timePassed, limit) => {
        // console.log(timePassed, limit)

        io.to(gameId).emit("time", {
          passed: timePassed,
          limit
        });
      });
    }

    if (!zzz.listeners("gameFinished").length) {
      zzz.on("gameFinished", state => {
        try {

          if (state.winner) {

            let winner = clients.get(state.winner.id)
            let turakas = clients.get(state.turakas.id)
  
            winner.rank++
            turakas.turakas++
            
            if (state.pagunid.length) {
  
              winner.madePagunid.push({
                to: turakas.id,
                cards: state.pagunid
              });    
              turakas.pagunid.push({
                from: winner.id,
                cards: state.pagunid
              });
  
            }
          }


          state.players.map(player => {
            let client = clients.get(player.id)
            if (state.id === client.game) {
              client.game = null
            }
            io.to(client.id).emit('updateHero', client)
          })
          
          io.to(state.id).emit("updateGame", state);
          io.emit('updateGameList', state)
        } catch (error) {
          console.log(error)
          socket.emit('serverError', error.message)
        }
      });
    }

    if (!zzz.listeners("closeGame").length) {
      /**
       * Listens for closeGame from game
       * Emits leftGame to all players, so they are returned to the client lobby
       * Emits gamelist update to all clients
       */

      zzz.on("closeGame", state => {
        try {
          console.log(`Server: closing game ${state.id}`);     

          state.players.map(player => {
            let client = clients.get(player.id)
            // if client has not started a new game, they might still be lingering 
            // in the closing game. So lets throw them out.
            if (!client.game) {
              io.to(client.id).emit("leftGame")
            }
          })

          io.emit("updateGameList", state);
        } catch (error) {
          console.log(error);
          socket.emit(error.message)
        }
      });
    }

    return;
  }
  addGameListeners();
});

/**
 *    =================================================
 *    =================   Thoughts   ==================
 *    =================================================
 *
 * -- File serving must be handled. Express?
 * -- Clicking on board cards should pick them up
 * ++ Error handling is rudimentary and uses a bad pattern
 * ++ Client validation should be handled smarter
 * ++ When client gets stuck, send back error event that resets the game
 *
 *
 *    =================================================
 *    =================  Bug  list ====================
 *    =================================================
 *
 * ++ Killer should pick up last
 */
