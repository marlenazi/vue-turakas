/** 
 * Have to be careful for socket listeners not to overwrite properties, because
 *    already run tests still hear and react to previous socket action.
 * 
*/


const io = require("socket.io-client");
const { logins, client } = require("./turakas/stores/mockStore");
const address = "http://192.168.0.103:2000";

var socket;

var firstClient;
var secondClient;

var firstGame;
var secondGame;

var firstHand
var secondHand

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
    socket.emit("login", logins[0].name);

    socket.on("loggedIn", clientObj => {
      if (clientObj.name === 'Miki') {
        
        firstClient = clientObj
      }
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
    expect(firstClient.name).toBe(logins[0].name);
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
    console.log(socket.connected)
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

      firstGame = gameState;
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
    socket.emit("login", logins[1].name);

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
    expect(secondClient.name).toBe(logins[1].name);
  });
});


describe('Joining a waiting game', () => {
  test('Emit "joinGame", receive game state', done => {
    // Emits joinGame request to server, where user is joined and game starts
  
    // For client, event 'joinedGame' is sent together with game state
    // Server also sends all players an update that a game has been closed
    socket.emit("joinGame", secondClient.id, firstGame.id);

    socket.on("joinedGame", gameState => {
      expect(gameState).toBeDefined();
      expect(typeof gameState).toBe('object');
      expect(gameState.id).toBe(firstGame.id)

      secondGame = gameState;
      
      done();
    });
  });
})

describe('Receiving a hand for first player', () => {
  test('Emit "getHand", receive array of cards', done => {
    socket.emit("getHand", firstClient.id);

    socket.on("hand", hand => {
      // console.log(hand)
      expect(hand).toBeDefined();
      expect(typeof hand).toBe('object');

      if (hand.name === 'Miki') {
        firstHand = hand
      }
      
      done();
    });
  });
})

describe('Receiving a hand for second player', () => {
  test('Emit "getHand", receive array of cards', done => {
    socket.emit("getHand", secondClient.id);

    socket.on("hand", hand => {
      // console.log(hand)
      expect(hand).toBeDefined();
      expect(typeof hand).toBe('object');

      secondHand = hand;
      
      done();
    });
  });
})

describe('Moving a card to board', () => {
  test('Both clients should have same state', () => {
    expect(firstGame).toEqual(secondGame)
  })
  test('Board is empty', () => {
    expect(firstGame.board).toHaveLength(0)
  })
  it('Emits move(id, card) and moves a card to board', done => {
    let id = firstGame.players[firstGame.active].id
    let card = firstGame.active === 0 ? firstHand.hand[1] : secondHand.hand[1]

    // console.log(firstClient.name, secondClient.name)
    // console.log(firstGame.active, secondGame.active)
    // console.log(firstHand)
    // console.log(secondHand)
    // console.log(card)
    socket.emit("move", id, card);

    socket.on('updateGame', state => {
      // firstGame = state

      expect(state.board).toHaveLength(1)
      expect(state.board[0]).toEqual(card)
      done()
    })
  })
})