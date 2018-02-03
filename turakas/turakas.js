const User = require('./modules/user')
const Game = require('./modules/game')

const users = []
const games = []

module.exports = {
  getUser,
  createGame,
  closeGame,
  addPlayer,
}

function getUser(name, ip, socketId) {

  function checkForUser(name, ip) {
    return users.find( user => 
      user.name === name && user.ip === ip
    )
  }

  if (checkForUser(name, ip)) {
    console.log('User exists')

    return checkForUser(name, ip)
  } else {
    console.log('Adding new user')
    
    let newUser = User(name, ip, socketId)
    users.push(newUser)

    return newUser
  }
}
function createGame(playerId) {
  console.log('Creating new game for ' + playerId)
  let newGame = Game(2)

  games.push(newGame)
  addPlayer(newGame.id, playerId)

  return newGame.getState(playerId)
}
function addPlayer(gameId, playerId) {
  // find a game and join player into it
  games.find( game => game.id === gameId ).join(playerId)
  // find user and assign game to it
  users.find( user => user.id === playerId ).game = gameId
}
function closeGame(id) {
  games.find( game => game.id === id ).players.map( player => player.game = null)
  games.splice(games.findIndex( game => game.id === id ), 1)
}