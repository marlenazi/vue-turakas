// const gamesStore = require("./games");
// const game = require("./game");

// const games = gamesStore()
/**
 * Games returns and object with following methods:
 *    getAll  -- returns a copy of an array with all games in collection
 *    get     -- accepts: id
 *                   returns a game with matching id
 *    add     -- accepts: {name, ip, socketId}
 *                   checks if game is returning
 *                   if not returning, creates new game,
 *                       adds new game to collection
 *                   returns the game object
 */

it('works', () => undefined)

// function add(args) {
//   try {
//     return games.add(args);
//   } catch (error) {
//     return true;
//   }
// }
// function remove(args) {
//   try {
//     return games.remove(args);
//   } catch (error) {
//     return "true: !!!error";
//   }
// }
// console.log(typeof games);
// console.log(`
//   Games exists: ${games}
//   ===============================
//   ${typeof games === "object"}: games returns an object.
//   ${Array.isArray(games.getAll())}: getAll returns an array.
//   ${add()}: creating new game with no args throws error
//   ${add("1")}: creating new game with bad args throws error
//   ${remove()}: remove game with no args returns error
// `);

// // Add new game
// console.log(`==== Add new game
// --- LOG`);

// let newGame = {
//   name: "Odin",
//   ip: "192.0.0.1",
//   socketId: "m0ck1d18"
// };
// let addedGame = games.add(newGame);
// let addedGameId = addedGame.id;

// console.log(`--- END LOG ---
//   ${typeof addedGame === "object"}: returns a game object
// `);

// // Check if game exists

// console.log(`==== Check if game exists
// --- END LOG`);
// console.log(`--- END LOG ---
//   ${games.getAll().length > 0}: collection is populated
//   ${!!games.match(game)}: game is in the collection
// `);

// // Get all games
// console.log(`==== Get all games
// --- LOG`);

// let allGames = games.getAll();

// console.log(`--- END LOG ---
//   ${Array.isArray(allGames)}: return an array
//   ${allGames.length > 0}: array is populated
// `);

// // Remove a game
// console.log(`==== Remove an game
// --- LOG`);

// let removeResult = games.remove(addedGameId);

// console.log(`--- END LOG ---
//   ${removeResult}: game removed
//   ${!games.remove(addedGameId)}: fail to remove from empty store
//   ${games.getAll().length === 0}: game store is empty again
// `);
