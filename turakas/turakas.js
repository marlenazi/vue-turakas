const User = require('./modules/user')
const Game = require('./modules/game')

const users = []
const games = []

module.exports = {
  getUser,
  getWaitingGames,
  createGame,
  removePlayer,
  addPlayer,
}

function getUser(name, ip, socketId) {
  // get user from users collection or create a new user
  let user =  users.find(user => user.name === name && user.ip === ip) 
           || User(name, ip)
  
  if (user.hasOwnProperty('socketId')) {
    console.log('User exists') 
  } else { 
    console.log('Adding new user')
    users.push(user)
  }
  // store socketId in case we want to send data to specific socket
  user.socketId = socketId

  return user
}
// makes a new game and joins the player to it. 
// returns game state for initiating player
function createGame(playerId) {
  console.log('Creating new game for ' + playerId)
  let newGame = Game(2)

  games.push(newGame)
  addPlayer(newGame.id, playerId)
  console.log(newGame.state)

  return newGame.getStateFor(playerId)
}
// adds a player to game
// returns game state for added player
function addPlayer(gameId, playerId) {
  // find a game and join player into it
  let game = games.find( game => game.id === gameId )
  if (game) {
    game.join(playerId)
  } else {
    console.log('Game does not exist in turakas.addPlayer')
    return
  }
  // find user and assign game to it
  let user = users.find( user => user.id === playerId )
  if (user) {
    user.game = gameId
  } else {
    console.log('User does not exist in turakas.addPlayer')
    return
  }

  return game.getStateFor(playerId)
}
// closes game with passed id
// removes game id from all players who were registered to removed game
// returns empty object to pass to client
function removePlayer(id, playerId) {
  game = games.find( game => game.id === id )
  if (game) {
    console.log(game.players.filter( player => player.id === playerId))
    // games.splice(games.indexOf(game), 1)
  } else {
    console.log('Game does not exist in turakas.closeGame')
  }

  return {}
}
// returns games that are waiting for players
// these will be displayed in the lobby and players can join them
function getWaitingGames() {
  console.log(games)
  return games.filter(game => game.state === 'Waiting')
}