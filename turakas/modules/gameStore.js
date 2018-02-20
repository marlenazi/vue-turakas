const NewGame = require("./game");
// const fs = require("fs");

/**
 * Collection of games
 *
 * Return an object with games store closed in with following methods:
 *  -- addGame takes an game object and returns game obj
 *       if no game provided or game is not an object, throws an error
 *  -- getGame finds a user from the list matching the id and returns that obj
 *       if id does not match any game ids, returns null
 *       if no id provided, throws error
 *  -- getAllGames returns a copy of games store
 *  -- hasGame takes and object and tries to match all keys to all objects part
 *     of the collection.
 *       USE CASE: user logges in with name, check if name
 *                 and IP match to any players.
 *       returns the object if all match
 *       returns null if not a complete match
 */

module.exports = clientStore => {

  const clients = clientStore
  const games = []

  function addGame(clientId) {
    if (!game) throw new Error("No game provided");
    if (typeof game !== "object")
      throw new Error("Expected game object got " + typeof game);

    console.log(`Creating game and adding to gameStore`);

    let newGame = NewGame();

    newGame.join( clients.get(clientId) )
    games.push(newGame);

    return newGame;
  }
  function getGame(id) {
    if (!id) throw new Error("No parameter provided");
    console.log("Get game " + id);

    function _trySockets() {
      if (!games.length || !games[0].sockets) return null
      return games.find(game => game.sockets.find(socId => socId === id))
    }
    return games.find(game => game.id === id) || _trySockets() || null;
  }
  function getWaitingGames() {
    return games.filter(game => game.status() === 'Waiting')
  }
  function getAllGames() {
    console.log(`Get entire games store`);
    return games.slice();
  }
  
  function removeGame(id) {
    if (!id) throw new Error("No parameters provided");
    if (typeof id !== "string")
      throw new Error("Expected string got " + typeof id);

    console.log(`Remove game ${id} from games`);
    let game = getGame(id);

    if (game) {
      games.splice(games.indexOf(game), 1);
      return true;
    } else return false;
  }
  function matchGame(parameters) {
    if (!parameters) throw new Error("No parameter provided");
    if (typeof parameters !== "object")
      throw new Error("Expected object got " + typeof parameters);

    console.log(`Comparing parameters in games store`);

    let keys = Object.keys(parameters);

    return (
      games.find(game => keys.every(key => parameters[key] === game[key])) ||
      null
    );
  }
  function getAvailableGames(clientId) {
    
    return games.filter(game => game.status() === 'Waiting')
  }

  console.log('==== Setting up games store ====');
  console.log(clients)
  return {
    getComa() {
      // console.log(this)
      // console.log(clients.get('rJLzg6FwG'))
      return clients.get('rJLzg6FwG')
    },
    add: addGame,
    remove: removeGame,
    get: getGame,
    getAll: getAllGames,
    getWaiting: getWaitingGames,
    getAvailable: getAvailableGames,
    match: matchGame,
  };
};
