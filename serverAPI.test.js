/** 
 * Should be ran on fresh server 
 * 
*/


const io = require("socket.io-client");
const { login1, login2, client } = require("./turakas/stores/mockStore");
const address = "http://192.168.0.103:2000";

var socket;

var firstClient;
var secondClient;

var firstClientGame;
var secondClientGame;

var firstClientHand
var secondClientHand

var availableGames;

beforeAll(done => {
  socket = io.connect(address, {
    reconnectionDelay: 0,
    "reopen delay": 0,
    forceNew: true
  });
  socket.on("connect", function() {
    console.log("Connected");
    done();
  });
  socket.on("disconnect", function() {
    console.log("Disconnected");
  });
});

test("Socket connection", () => {
  expect(socket.connected).toBe(true);
});

describe("Login process", () => {
  test("Emit name, get client object", done => {
    socket.emit("login", login1.name);

    socket.on("loggedIn", clientObj => {
      firstClient = clientObj;
      done();
    });
  });

  it("Should be an object", () => {
    expect(firstClient).toBeDefined();
    expect(typeof firstClient).toBe("object");
  });
  it("Should have valid properties", () => {
    expect(Object.keys(firstClient)).toContain(
      "id",
      "ip",
      "name",
      "rank",
      "game"
    );
    expect(firstClient.name).toBe(login1.name);
  });

  test("Emit wrong type Name, get error", done => {
    socket.emit("login", client);

    socket.on("serverError", err => {
      expect(err).toBeDefined();
      expect(typeof err).toBe("string");
      done();
    });
  });
});

describe("Getting available games", () => {
  test('Emit "getAvailableGames", get back an array of games', done => {
    socket.emit("getAvailableGames", firstClient.id);

    socket.on("availableGamesSent", games => {
      expect(games).toBeDefined();
      expect(Array.isArray(games)).toBe(true);

      availableGames = games;
      done();
    });
  });
});

describe("Starting a new game and observing game being created", () => {
  test('Emit "newGame", receive game state and update to lobby', done => {
    // Emits newGame request to server, where game is created and user is joined
    //  to created game.
    // For user event 'joinedGame' is sent together with game state
    // Server also sends all players an update that a game has been created
    socket.emit("newGame", firstClient.id);

    socket.on("joinedGame", gameState => {
      expect(gameState).toBeDefined();
      expect(typeof gameState).toBe('object');

      firstClientGame = gameState;
    });

    socket.on("gameCreated", gameState => {
      expect(gameState).toBeDefined();
      expect(typeof gameState).toBe('object');
      
      availableGames.push(gameState)

      done();
    });
  });
});

describe("Login process for second player", () => {
  test("Emit name, get client object", done => {
    socket.emit("login", login2.name);

    socket.on("loggedIn", clientObj => {
      secondClient = clientObj;
      done();
    });
  });

  it("Should be an object", () => {
    expect(secondClient).toBeDefined();
    expect(typeof secondClient).toBe("object");
  });
  it("Should have valid properties", () => {
    expect(Object.keys(secondClient)).toContain(
      "id",
      "ip",
      "name",
      "rank",
      "game"
    );
    expect(secondClient.name).toBe(login2.name);
  });
});


describe('Joining a waiting game', () => {
  test('Emit "joinGame", receive game state', done => {
    // Emits joinGame request to server, where user is joined and game starts
  
    // For client, event 'joinedGame' is sent together with game state
    // Server also sends all players an update that a game has been closed
    socket.emit("joinGame", secondClient.id, firstClientGame.id);

    socket.on("joinedGame", gameState => {
      expect(gameState).toBeDefined();
      expect(typeof gameState).toBe('object');
      expect(gameState.id).toBe(firstClientGame.id)

      secondClientGame = gameState;
      
      done();
    });
  });
})

describe('Receiving a hand for first player', () => {
  test('Emit "getHand", receive array of cards', done => {
    socket.emit("getHand", firstClient.id);

    socket.on("hand", hand => {
      console.log(hand)
      expect(hand).toBeDefined();
      expect(Array.isArray(hand)).toBe(true);

      firstClientHand = hand;
      
      done();
    });
  });
})

describe('Receiving a hand for second player', () => {
  test('Emit "getHand", receive array of cards', done => {
    socket.emit("getHand", secondClient.id);

    socket.on("hand", hand => {
      expect(hand).toBeDefined();
      expect(Array.isArray(hand)).toBe(true);

      secondClientHand = hand;
      
      done();
    });
  });
})