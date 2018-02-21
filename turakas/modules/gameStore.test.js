const gameStore = require("./gameStore");
const { login, client, clientStore } = require("./../stores/mockStore");

/** ==== Test gameStore ====
 * 
 * gameStore is intialized with clients store to have access to clients
 * gameStore is intialized with previously initialised clients store 
 *    to have access to clients.
 * gameStore(clientStore) returns an object with methods:
 * 
 *    -- create()
 *       creates a new game
 * 
 *    -- destroy(id)
 *       takes a game id
 *       removes game with matching id from the store
 *       returns true or false depending if operation was successful 
 * 
 *    -- get(id) 
 *       takes an id of a game and 
 *       returns matching game
 * 
 *    -- getAll()
 *       returns all games in the store
 * 
 *    -- getAvailable(clientId)
 *       takes a client id
 *       gets games that are connected with that id
 *       gets all waiting games.
 *       returns a concated array with all available games
 * 
 *   All passed ids are strings
 */


// initialize the store with mock clientStore
const games = gameStore(clientStore)

let testId = client.id;
let testGameId;

describe('Init gameStore', () => {
  
  it("Exists", () => {
    expect(typeof games).toBe("object");
  });
  it("Starts empty", () => {
    // console.log(games);
    expect(games.getAll()).toHaveLength(0);
  });
})

describe('gameStore methods', () => {
  it("Creates a new game", () => {
    let newGame = games.create();
    testGameId = newGame.id;
  
    expect(typeof newGame).toBe("object");
    expect(Object.keys(newGame)).toContain(
      "id",
      "status",
      "state",
      "join",
      "leave",
      "hand",
      "move",
      "pickUp",
      "muck"
    );
  });
  
  it("Gets a specific game", () => {
    // should throw because no id passed
    expect(() => games.getGame()).toThrow()
    // should throw because id is not string
    expect(() => games.getGame(123456)).toThrow()
    expect(() => games.getGame(client)).toThrow()
    
    let gottenGame = games.get(testGameId);
    
    expect(typeof gottenGame).toBe("object");
    expect(Object.keys(gottenGame)).toContain(
      "id",
      "status",
      "state",
      "join",
      "leave",
      "hand",
      "move",
      "pickUp",
      "muck"
    );
    expect(gottenGame.status()).toBe("Closed");
  });
  it("Joins a client", () => {
    // this tests also game instance, but we need to do it here
    //    so that we can test methods that require a joined client
    let waitingGame = games.get(testGameId).join(client);
  
    expect(typeof waitingGame).toBe("object");
    expect(waitingGame.status).toBe("Waiting");
    expect(waitingGame.players).toHaveLength(1);
  });
  it('Gets all games', () => {
    let allGames = games.getAll()
    expect(Array.isArray(allGames)).toBe(true)
    expect(allGames).toHaveLength(1)
  })
  it('Gets available games', () => {
    let availableGames = games.getAvailable(testId)

    expect(Array.isArray(availableGames)).toBe(true)
  })
  it('Destroys specific game', () => {
    // should throw because no id passed
    expect(() => games.destroy()).toThrow()
    // should throw because id is not string
    expect(() => games.destroy(123456)).toThrow()
    expect(() => games.destroy(client)).toThrow()

    let response = games.destroy(testGameId)

    expect(response).toBe(true)
    expect(games.getAll()).toHaveLength(0)
  })
})



