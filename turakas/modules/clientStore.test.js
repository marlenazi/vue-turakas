const clients = require("./clientStore")();
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
  let socketId = clients.match(testMatch).sockets[0];

  it("returns a correct object", () => {
    expect(typeof clients.get(id)).toBe("object");
    expect( clients.get(id) ).toMatchObject( testMatch )
  });
  it("returns a correct obj when id longer than 14 chars (socket id)", () => {
    expect(typeof clients.get(socketId)).toBe("object");
    expect( clients.get('randomString10ng3n0ugh') ).toBeFalsy()
    expect( clients.get(socketId) ).toMatchObject( testMatch )
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
