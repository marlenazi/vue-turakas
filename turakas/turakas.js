const User = require('./modules/user')
const Game = require('./modules/game')

const users = []
const games = []

module.exports = {
  getUser,
  createGame: Game,
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
  let newGame = Game(2)
  games.push(newGame)

  addPlayer(newGame.id, playerId)
  
  return newGame
}
function addPlayer(gameId, playerId) {
  // find a game and join player into it
  games.find( game => game.id === gameId ).join(playerId)
  // find user and assign game to it
  users.find( user => user.id === playerId ).game = gameId
}