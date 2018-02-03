const User = require('./modules/user')
const Game = require('./modules/game')

const users = []
const games = []

module.exports = {
  getUser,
  createGame: Game,
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