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
  
      io.to(client.id).emit("loggedIn", client);

      if (client.game) {
        let game = games.get(client.game)
        socket.join(game.id)

        io.to(client.id).emit("joinedGame", game.state());
      }
      
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error.message)
    }
  });
  socket.on("getAvailableGames", clientId => {
    try {
      let availableGames = games.getAvailable(clientId)
      io.to(clientId).emit("availableGamesSent", availableGames);
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error.message)
    }
  });
  socket.on("newGame", clientId => {
    console.log(`Creating new game for ${clientId}`);

    try {
      let client = clients.get(clientId);
      let game = games.create().join(client);

      socket.join(game.id);

      console.log("Created game: " + game.id + " and joined " + clientId);

      io.to(clientId).emit("joinedGame", game);
      io.emit("gameCreated", {
        id: game.id,
        size: game.size,
        status: game.status,
        players: game.players
      });

    } catch (error) {
      console.log(error);
      socket.emit("serverError", error)
    }
  });
  
  socket.on("joinGame", (clientId, gameId) => {
    console.log(`Joining ${clientId} to game ${gameId}`);

    try {
      let client = clients.get(clientId);
      let game = games.get(gameId);
      let gameState = game.join(client);

      socket.join(game.id)

      io.to(clientId).emit("joinedGame", gameState);
      io.to(gameId).emit("updateGame", gameState);
      // emit this to all remove it from the lobby
      if (game.status() === "Playing") {
        io.emit("gameClosed", game.id);
      }

    } catch (error) {
      console.log(error);
      socket.emit("serverError", error);
    }
  });
  socket.on("leaveGame", clientId => {
    console.log(`leaving game for ${clientId}`)

    try {
      let client = clients.get(clientId)
      console.log(client)
      console.log(client.game)
      let game = games.get(client.game)
  
      game.leave(client)
      socket.leave(game.id);
      
      io.to(clientId).emit("leftGame");
      if (game.status() === "Playing") {
        io.to(game.id).emit("updateGame", game.state());
      }
      if (game.status() === "Closed") {
        io.emit("gameClosed", game.id);
      }
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error)
    }
  });
  socket.on("getHand", clientId => {
    console.log(`returning hand to player ${clientId}`)

    try {
      let client = clients.get(clientId);
      let game = games.get(client.game);

      io.to(clientId).emit("hand", game.hand(client));

    } catch (error) {
      console.log(error);
      socket.emit("serverError", error)
    }
  });

  // game actions
  socket.on("move", (clientId, card) => {
    try {
      let game = games.get(clients.get(clientId).game);
  
      io.to(game.id).emit("updateGame", game.move(card));
      
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error)
    }
  });
  socket.on("pickUp", clientId => {
    try {
      let client = clients.get(clientId);
      let game = games.get(client.game);
  
      io.to(game.id).emit("updateGame", game.pickUp(client));
      
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error);
    }
  });
  socket.on("muck", clientId => {
    try {
      let client = clients.get(clientId);
      let game = games.get(client.game);
  
      io.to(game.id).emit("updateGame", game.muck(client));
      
    } catch (error) {
      console.log(error);
      socket.emit("serverError", error)
    }
  });

  /**
   * When socket disconnects, remove it from the player
   */
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
    
  });

  // ======================
  // events that game emits
  // ======================

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

    if (!zzz.listeners("gameOver").length) {
      zzz.on("gameOver", state => {
        io.to(state.id).emit("gameOver", state);
      });
    }

    if (!zzz.listeners("closeGame").length) {
      /**
       * Listenes for closeGame from game
       * Emits leftGame to all players, so they are returned to the client lobby
       * Emits to all clients gameClosed, so it is removed from available games
       */

      zzz.on("closeGame", id => {
        try {
          console.log(`Closing game ${id}`);

          io.to(id).emit("leftGame");
          io.emit("gameClosed", id);

          console.log(games);

          games.destroy(id);
        } catch (error) {
          console.log(error);
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
 * -- Error handling is rudimentary and uses a bad pattern
 * -- Client validation should be handled smarter
 * -- File serving must be handled. Express?
 * -- When client gets stuck, send back error event that resets the game
 * -- Clicking on board cards should pick them up
 *
 *
 *    =================================================
 *    =================  Bug  list ====================
 *    =================================================
 *
 * -- Killer should pick up last
 */
