const io = require("socket.io-client");
var socket;

let testUser = {
  name: 'Coma'
}
let client;



beforeAll((done) => {
  socket = io.connect("http://192.168.0.103:2000", {
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

test('Emitting', done => {
  socket.emit('test', 'testData')

  socket.on('test', data => {
    expect(data).toBe('testData')
    done()
  })
})
test('Emit Name, get Client obj', done => {
  socket.emit('login', testUser)

  socket.on('loggedIn', clientObj => {
    expect(clientObj).toBeDefined()
    expect(typeof clientObj).toBe('object')
    expect(Object.keys(clientObj)).toBeGreaterThanOrEqual(6)
    expect(Object.keys(clientObj)).toContain(
      "id",
      "ip",
      "name",
      "sockets",
      "rank",
      "game"
    );
    expect(clientObj.name).toBe(testUser.name)
    expect(Array.isArray(clientObj.sockets)).toBe(true)
    expect(clientObj.sockets).toHaveLength(1)

    done()
  })
})