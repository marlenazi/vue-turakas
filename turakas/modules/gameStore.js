const NewGame = require("./game");
// const fs = require("fs");

/** ==== gameStore ====
 * 
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
 *       if no match, return null
 * 
 *    -- getAll()
 *       returns all games in the store
 *       if empty, return an empty array
 * 
 *    -- getAvailable(clientId)
 *       takes a client id
 *       gets games that are connected with that id
 *       gets all waiting games.
 *       returns a concated array with all available games
 * 
 * 
 *   All passed ids are strings
 */

module.exports = () => {

  const games = [];

  function createGame() {
    console.log(`Creating game and adding to gameStore`);

    let newGame = NewGame();

    games.push(newGame);

    return newGame;
  }
  function getGame(id) {
    if (!id) throw new Error("No id passed");
    if (typeof id !== 'string') throw new Error(`Expected string got ${typeof id} ${id}`);
    console.log("Get game " + id);

    return games.find(game => game.id === id) || null;
  }
  function getAllGames(status) {
    console.log(`Get all games`);
    if (!status || status === 'all') {
      return games.slice()
    }
    return games.filter(game => game.status === status);
  }

  function destroyGame(id) {
    if (!id) throw new Error("No parameters provided");
    if (typeof id !== "string") throw new Error("Expected string got " + typeof id);
    
    console.log(`Destroy game ${id} from games`);
    let game = getGame(id);
    
    if (game) {
      games.splice(games.indexOf(game), 1);
      return true;
    } else return false;
  }
  
  function getGameList(clientId) {
    if (!clientId || typeof clientId !== 'string') {
      console.log("No client id provided or not string. Instead sending waiting games");
      return _getWaitingGames();
    }
    console.log("Get all available games");
    
    // let clientGames = getAllGames().filter(game =>
    //   game.state().players.some(id => id === clientId)
    // );
    
    // MODIFIED
    // clientGames.concat(_getWaitingGames()).map(...
    return getAllGames().map(game => {
      let state = game.state();

      return { 
        id: state.id,
        size: state.size,
        status: state.status,
        players: state.players
      };
    });
  }

  function _getWaitingGames() {
    console.log("Get games with status: Waiting");
    return games.filter(game => game.status() === "Waiting");
  }
  
  console.log("==== Setting up games store ====");
  // console.log(clients);
  return {
    create: createGame,
    destroy: destroyGame,
    get: getGame,
    getAll: getAllGames,
    getAvailable: getGameList
  };
};
