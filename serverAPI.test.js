const io = require("socket.io-client");
const { login, client } = require("./turakas/stores/mockStore");
const address = "http://192.168.0.103:2000"

var socket;

beforeAll((done) => {
  socket = io.connect(address, {
    "reconnectionDelay": 0,
    "reopen delay": 0,
    "forceNew": true
  });
  socket.on("connect", function() {
    console.log("Connected");
    done();
  });
  socket.on("disconnect", function() {
    console.log("Disconnected");
  });
});

test("Socket connection", () => {
  expect(socket.connected).toBe(true)
});

describe('Login process', () => {

  
  test('Emit name, get client object', done => {
    socket.emit('login', login.name)
    socket.on('loggedIn', clientObj => {

      it('should be an object', clientObj => {
        expect(clientObj).toBeDefined()
        expect(typeof clientObj).toBe('object')
      })
      it('Should have valid properties', () => {
        expect(Object.keys(clientObj)).toHaveLength(5)
        expect(Object.keys(clientObj)).toContain(
          "id",
          "ip",
          "name",
          "rank",
          "game"
        );
        expect(clientObj.name).toBe(login.name)
      })

      done()
    })

  })
})



test('Emit wrong type Name, get error', done => {
  socket.emit('login', client)

  socket.on('serverError', err => {
    expect(err).toBeDefined()
    expect(typeof err).toBe('string')
    // console.log(err)
    done()
  })
})