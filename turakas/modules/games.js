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

module.exports = function games() {

  // read the store
  const games = []

  function addGame(game) {
    if (!game) throw new Error("No parameters provided");
    if (typeof game !== "object")
      throw new Error("Expected object got " + typeof game);

    console.log(`Adding game to games`);

    let newGame = NewGame(game);
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

  console.log(`==== Returning games store ====`);
  return {
    add: addGame,
    remove: removeGame,
    get: getGame,
    getAll: getAllGames,
    getWaiting: getWaitingGames,
    match: matchGame,
  };
};
