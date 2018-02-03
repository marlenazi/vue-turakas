const socket = require('socket.io')
const http = require("http")
const url = require("url")
const fs = require('fs')

const port = 2000
const index = fs.readFile('index.html', (error, file) => file)

const turakas = require('./turakas/turakas')

const io = socket(http.createServer( (req, res) => {
  //send index.html
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
}).listen(port))
console.log('Listening to ' + port)

// socket connection and events
io.on('connection', socket => {
  console.log(`Socket ${socket.id} connected`)

  socket.on('login', name => {
    let userIp = socket.request.connection.remoteAddress
    let user = turakas.getUser(name, userIp, socket.id)
    console.log(user)

    socket.emit('user', user)
  })

  socket.on('newGame', playerId => {
    console.log(playerId)

    turakas.createGame(playerId)


  })


  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)
  })
})