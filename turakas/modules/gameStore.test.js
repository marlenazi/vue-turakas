const games = require("./gameStore")();
const { login, client, clientStore } = require("./../stores/mockStore");

let testId = client.id;
let testGameId;

it("Exists", () => {
  expect(typeof games).toBe("object");
});

it("Starts empty", () => {
  console.log(games);
  expect(games.getAll()).toHaveLength(0);
});

it("Creates a new game", () => {
  let newGame = games.create();
  testGameId = newGame.id;

  expect(typeof newGame).toBe("object");
  expect(Object.keys(newGame)).toContain(
    "id",
    "status",
    "state",
    "join",
    "leave",
    "hand",
    "move",
    "pickUp",
    "muck"
  );
});

it("Returns a game", () => {
  let gottenGame = games.get(testGameId);

  expect(typeof gottenGame).toBe("object");
  expect(Object.keys(gottenGame)).toContain(
    "id",
    "status",
    "state",
    "join",
    "leave",
    "hand",
    "move",
    "pickUp",
    "muck"
  );
  expect(gottenGame.status()).toBe("Closed");
});

it("Joins a client", () => {
  let waitingGame = games.get(testGameId).join(client);

  expect(typeof waitingGame).toBe("object");
  expect(waitingGame.status).toBe("Waiting");
  expect(waitingGame.players).toHaveLength(1);
});
