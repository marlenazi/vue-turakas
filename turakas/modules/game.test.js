let NewGame = require("./game");
let { clientStoreMock } = require("./../stores/mockStore");

let hups = clientStoreMock[0]
let tups = clientStoreMock[1]
let lups = clientStoreMock[2]
let game1 = NewGame();

it("Works", () => {
  expect(NewGame).toBeDefined();
  expect(game1).toBeDefined();
});

test("Joining first client", () => {
  let state = game1.join(hups);

  expect(typeof state.players[0]).toBe("object");
  expect(state.players[0]).toEqual({
    id:   hups.id,
    name: hups.name,
    rank: hups.rank,
    away: false,
  });
});
test("Joining second client", () => {
  let state = game1.join(tups);

  expect(typeof state.players[1]).toBe("object");
  expect(state.players[1]).toMatchObject({
    id: tups.id,
    name: tups.name,
    rank: tups.rank,
    away: false,
  });
  expect(state.players[0].hand).toBeDefined()
  expect(state.players[1].hand).toBeDefined() 
  expect(game1.status()).toBe('Playing')
});
test('Joining third client to a two player game', () => {
  let answer = game1.join(lups)

  expect(answer).toBe(false)
})