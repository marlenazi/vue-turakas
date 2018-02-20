const clientStore = require('./clientStore')
const gameStore = require('./gameStore')

/** ==== Initialize Stores ====
 * 
 * start client store
 * import client store to game store to give access to clients
 * start game store
 * 
 * ---- Export Stores ----
 * ( used in server.js )
 */

const clients = clientStore()
const games = gameStore(clients)

module.exports = {
  clients: clients, 
  games: games
}