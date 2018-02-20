const clients = require("./clients")();

/**
 * Clients returns and object with following methods:
 *    getAll  -- returns a copy of an array with all clients in collection
 *    get     -- accepts: id
 *                   returns a client with matching id
 *    add     -- accepts: {name, ip, socketId}
 *                   checks if client is returning
 *                   if not returning, creates new client,
 *                       adds new client to collection
 *                   returns the client object
 */
describe("clients", () => {
  it("should return an object", () => {
    expect(typeof clients).toBe("object");
  });
  it('should have properties', () => {
    expect(Object.keys(clients)).toContain('add', 'remove', 'get', 'getAll');
  })
});

test('clients.add() returns an object', () => {
  let testClient = {
    name: 'Tomm',
    ip: '192.0.0.1'
  }
  let arr = Object.keys( clients.add(testClient) )

  expect( typeof clients.add(testClient) ).toBe('object')
  expect( arr ).toContain('id', 'ip', 'name', 'sockets', 'rank', 'game')
})

describe('clients.match()', () => {
  let testMatch = {
    name: 'Tomm',
    ip: '192.0.0.1'
  }
  let testMatchFalse1 = {
    // name does not match case
    name: 'tomm',
    ip: '192.0.0.1'
  }
  let testMatchFalse2 = {
    // ip is nr instead of string
    name: 'tomm',
    ip: 192.001
  }

  it('returns a correct object', () => {
    expect( typeof clients.match(testMatch) ).toBe('object')
    expect( clients.match(testMatchFalse1) ).toBeFalsy()
    expect( clients.match(testMatchFalse2) ).toBe(null)
  })

})