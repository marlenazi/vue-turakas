const User = require('./modules/user')
const Game = require('./modules/game')

const users = []
const games = []

module.exports = {
  getUser,
  createGame: Game,
  addPlayer,
}

function getUser(name, ip) {

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
    
    let newUser = User(name, ip)
    users.push(newUser)

    return newUser
  }
}

function createGame(playerId) {
  let newGame = Game(playerId)

  newGame.join(playerId)

  users.find( user => user.playerId ).game = newGame.id
  games.push(newGame)

  return newGame.id
}