const NewGame = require("./game");
// const fs = require("fs");

/**
 * Collection of games
 *
 * Return an object with games store closed in with following methods:
 *  -- createGame takes an game object and returns game obj
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
  const clients = clientStore;
  const games = [];

  function createGame() {
    console.log(`Creating game and adding to gameStore`);

    let newGame = NewGame();

    games.push(newGame);

    return newGame;
  }
  function getGame(id) {
    if (!id) throw new Error("No parameter (game id) provided");
    console.log("Get game " + id);

    return games.find(game => game.id === id) || null;
  }
  function getWaitingGames() {
    console.log("Get games with status: Waiting");
    return games.filter(game => game.status() === "Waiting");
  }
  function getAllGames() {
    console.log(`Get all games`);
    return games.slice();
  }

  function destroyGame(id) {
    if (!id) throw new Error("No parameters provided");
    if (typeof id !== "string")
      throw new Error("Expected string got " + typeof id);

    console.log(`Destroy game ${id} from games`);
    let game = getGame(id);

    if (game) {
      games.splice(games.indexOf(game), 1);
      return true;
    } else return false;
  }

  function getAvailableGames(clientId) {
    if (!clientId) {
      console.log("No client id provided. Instead sending waiting games");
      return getWaitingGames();
    }
    console.log("Get all available games");

    let clientGames =
    // if we find no matching player, try returning game with the matching id
    // if all fails, pass empty array
      games.filter(game =>
        game.state().players.some(player => player.id === clientId)
      ) ||
      games.get(clients.get(clientId).game) ||
      [];

    return getWaitingGames().concat(clientGames);
  }

  console.log("==== Setting up games store ====");
  // console.log(clients);
  return {
    create: createGame,
    destroy: destroyGame,
    get: getGame,
    getAll: getAllGames,
    getWaiting: getWaitingGames,
    getAvailable: getAvailableGames
  };
};
