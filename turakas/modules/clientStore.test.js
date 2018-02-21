const clients = require("./clientStore")();

/** ==== Test Client Store ====
 * 
 * clientStore() reads store from JSON object
 * returns an object with methods:
 * 
 *    -- add( {name, ip} )
 *       takes an object containing name and ip
 *       name property should be string
 *       adds a new client
 *       saves the data to JSON   !!! should be a stream !!!
 *       returns client
 * 
 *       throws error if 
 *          client is not passed
 *          client is wrong type
 *          client has wrong type keys
 * 
 *    -- remove(id)
 *       takes a client id (string)
 *       requests the client object with getClient(id)  ??? unnecessary ???
 *       removes client with matching id from the store
 *       saves the data to JSON
 *       returns true or false depending if operation was successful 
 * 
 *    -- get(id) 
 *       takes an id of a client (string)
 *       returns matching client
 *       if no match, return null
 * 
 *       throws error if 
 *          id is not passed
 *          id is wrong type 
 * 
 *    -- getAll()
 *       returns all clients in the store
 *       if empty, returns an empty array
 * 
 *    -- match( {parameters} )
 *       takes an object containing paramteres
 *       compares the paramters with all clients on the store
 *       returns first that matches all parameters
 *       if none match, returns null
 * 
 * 
 * Private methods:
 * 
 *    -- _saveStore()
 *       saves the store to JSON object sync    !!! should be async !!!
 */


let testClient = {
  name: "Tomm",
  ip: "192.0.0.1",
  socketId: 'socketId0123456',
};
// for matching tests we use testMatch, because testClient gets modified when 
// added to the store and does not have all equal properties
let testMatch = {
  name: "Tomm",
  ip: "192.0.0.1"
};
let initialLength = clients.getAll().length

describe("clients", () => {
  it("should return an object", () => {
    expect(typeof clients).toBe("object");
  });
  it("should have following properties", () => {
    expect(Object.keys(clients)).toContain("add", "remove", "get", "getAll");
  });
});

describe("clients.getAll()", () => {
  let result = clients.getAll();

  it("Returns an array", () => {
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(initialLength);
  });
});

describe("clients.add()", () => {
  let result = clients.add(testClient);

  it("Returns an object", () => {
    expect(typeof result).toBe("object");
    expect(Object.keys(result)).toContain(
      "id",
      "ip",
      "name",
      "sockets",
      "rank",
      "game"
    );
  });
  it("Added the object to store", () => {
    expect(clients.getAll()).toHaveLength(initialLength + 1);
  });
});

describe("clients.match()", () => {

  let testMatchFalse1 = {
    // name does not match case
    name: "tomm",
    ip: "192.0.0.1"
  };
  let testMatchFalse2 = {
    // ip is nr instead of string
    name: "tomm",
    ip: 192.001
  };

  it("returns a correct object", () => {
    expect(typeof clients.match(testMatch)).toBe("object");
  });
  it("returns null if not found", () => {
    expect(clients.match(testMatchFalse1)).toBeFalsy();
    expect(clients.match(testMatchFalse2)).toBe(null);
  });
});

describe('clients.get()', () => {
  let id = clients.match(testMatch).id;

  it("returns a correct object", () => {
    expect(typeof clients.get(id)).toBe("object");
    expect( clients.get(id) ).toMatchObject( testMatch )
  });
  it("returns null when wrong id", () => {

    expect( clients.get('randomString10ng3n0ugh') ).toBeFalsy()
    expect( clients.get('r263m88ring10ngY$0u312') ).toBe( null )
  });
})

describe("clients.remove()", () => {
  let id = clients.match(testMatch).id;

  it("throws error when id is not string", () => {
    // needs to be wrapped in a function, or err will not be caught
    expect(() => clients.remove(testClient)).toThrow();
  });
  it("is true when finds a matching id and can delete", () => {
    expect(clients.remove(id)).toBeTruthy();
  });
  it("Removed the object from store", () => {
    expect(clients.getAll()).toHaveLength(initialLength);
  });
});
