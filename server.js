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
    if (!name || typeof name !== "string") {
      console.log(`tried to log in ${name} ${typeof name}`);
      socket.emit("serverError", `tried to log in ${name} ${typeof name}`);
      return;
    }
    /**
     * we get connection ip and compare both name and ip to existing clients
     * if we have a match, we return that client obj to the client,
     * if not, we create a new client obj and return it to the client
     *
     * then we check if it had a game attached and if so, emit the state
     * to all sockets that are connected to client
     */
    let ip = socket.request.connection.remoteAddress;

    let client =
      clients.match({ name, ip }) ||
      clients.add({ name, ip });
    // all sockets that this client might have,
    // connect to a room matching clients id
    socket.join(client.id);

    io.to(client.id).emit("loggedIn", client);

    // console.log(client.id, client.name)
    // if (client.game && getGame(client.game)) {
    //   console.log(`${client.id} resumes game: ${client.game}`)

    //   emitToOne('joinedGame', getGame(client.game).state())
    // } else if (client.game) {
    //   console.log(`did not find game ${client.game}, client.game will be null`)
    //   if (client.away) {
    //     console.log('client is set as Away. Setting away to null')
    //     client.away = null
    //   }
    //   client.game = null
    // }
  });
  socket.on("getAvailableGames", clientId => {
    if (!clients.get(clientId)) {
      console.log(`${clientId} not found @ on.getAvailableGames`);

      io.to(clientId)
        .emit(
          "serverError",
          `Client ${clientId} not found while fetching available games`
        );
      return;
    }

    io.to(clientId).emit("availableGamesSent", games.getAvailable(clientId));
  });
  socket.on("newGame", clientId => {
    console.log(`Creating new game for ${clientId}`)

    let client = clients.get(clientId)
    if (!client) {
      console.log(`${clientId} not found @ on.newGame`);
      io.to(clientId).emit("serverError", `${clientId} not found @ on.newGame`);
      return;
    }
    if (client.game && games.get(client.game)) {
      // here should send option to resume or opt out
      console.log(`${clientId} @ on.newGame: already registered`);
      io
        .to(clientId)
        .emit("serverError", `${clientId} already registered to a game`);
      return;
    }

    // creates a game, returns it
    // joins client to game, returns game state
    let game = games.create()
      .join(client);
    // join client to room game.id
    socket.join(game.id)

    console.log("Created game: " + game.id + " and joined " + clientId);

    io.to(clientId).emit("joinedGame", game);
    io.emit("gameCreated", {
      id: game.id,
      size: game.size,
      status: game.status,
      players: game.players
    });
  });
  socket.on("joinGame", (clientId, gameId) => {
    console.log(`Joining ${clientId} to game ${gameId}`)

    let client = clients.get(clientId)
    if (!client) {
      console.log(`Client ${clientId} not found @ on.joinGame`);
      io.to(clientId).emit("serverError");
      return;
    }
    let game = games.get(gameId)
    if (!game) {
      console.log(`Game ${gameId} not found @ on.joinGame`);
      return;
    }

    game.join(client);

    io.to(clientId).emit("joinedGame", game);
    io.to(gameId, "updateGame", game);
    // emit this to all remove it from the lobby
    if (game.status() === 'Playing') {
      io.emit("gameClosed", game.id);
    }
  });
  socket.on("leaveGame", clientId => {
    console.log(`leaving game for ${clientId}`)

    let client = clients.get(clientId)

    if (!client) {
      let err = `On leaveGame client ${clientId} not found`
      console.log(err);

      io.to(clientId)
        .emit("serverError", err)

      return
    }
    if (!client.game) {
      let err = `On leaveGame client ${clientId} no game assigned`
      console.log(err);

      io.to(clientId)
        .emit("serverError", err)

      return
    }

    let game = games.get(client.game)

    if (!game) {
      let err = `On leaveGame client ${client.game} game not found`
      console.log(err);

      io.to(clientId)
        .emit("serverError", err)

      return
    }

    game.leave(client)
    socket.leave(game.id);
    
    
    io.to(clientId).emit("leftGame");
    if (game.status() === "Playing") {
      io.to(game.id).emit("updateGame", game.state());
    }
    if (game.status() === "Closed") {
      io.emit("gameClosed", game.id);
    }
  });
  socket.on("getHand", clientId => {
    console.log(`returning hand to player &{clientId}`)
    let client = clients.get(clientId);

    if (!client) {
      let err = `Client ${clientId} not found @ on.getHand`
      console.log(err);
      io.to(clientId).emit("serverError", err);
      return;
    }
    if (!client.game) {
      let err = `Game for ${clientId} not assigned`
      console.log(err);
      io.to(clientId).emit("serverError", err);
      return;
    }

    let game = games.get(client.game);

    if (!game) {
      let err = `Game ${client.game} not found`
      console.log(err);
      io.to(clientId).emit("leftGame");
      io.to(clientId).emit("serverError", err);
      return;
    }


    io.to(clientId).emit("hand", game.hand(client));
  });

  // game actions
  socket.on("move", (clientId, card) => {
    if (!clients.get(clientId) || !clients.get(clientId).game) {
      console.log(
        `Client for socketId ${
          clientId
        } not found OR has not game attached @ on.move`
      );
      console.log(clients.getAll());
      if (!clients.get(clientId)) {
        io.to(clientId).emit("serverError");
      }
      return;
    }
    if (!games.get(clients.get(clientId).game)) {
      console.log(`Game ${clients.get(clientId).game} not found @ on.move`);
      console.log(games);
      return;
    }

    let game = games.get(clients.get(clientId).game);

    io.to(game.id, "updateGame", game.move(card));
  });
  socket.on("pickUp", clientId => {
    if (!clients.get(clientId) || !clients.get(clientId).game) {
      console.log(
        `Client for socketId ${
          clientId
        } not found OR has not game attached @ on.pickUp`
      );
      console.log(clients.getAll());
      if (!clients.get(clientId)) {
        io.to(clientId).emit("serverError");
      }
      return;
    }
    if (!games.get(clients.get(clientId).game)) {
      console.log(`Game ${clients.get(clientId).game} not found @ on.pickUp`);
      console.log(games);
      return;
    }

    let client = clients.get(clientId);
    let game = games.get(client.game);

    io.to(game.id).emit("updateGame", game.pickUp(client), game.id);
  });
  socket.on("muck", clientId => {
    if (!clients.get(clientId) || !clients.get(clientId).game) {
      console.log(
        `Client for socketId ${
          clientId
        } not found OR has not game attached @ on.muck`
      );
      console.log(clients.getAll());
      if (!clients.get(clientId)) {
        io.to(clientId).emit("serverError");
      }
      return;
    }
    if (!games.get(clients.get(clientId).game)) {
      console.log(`Game ${clients.get(clientId).game} not found @ on.muck`);
      console.log(games);
      return;
    }

    let client = clients.get(clientId);
    let game = games.get(client.game);

    io.to(game.id).emit("updateGame", game.muck(client), game.id);
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

        io.to(gameId).emit(gameId, "time", {
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
