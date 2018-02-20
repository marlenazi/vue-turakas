const NewClient = require("./client");
const fs = require("fs");

/**
 * Collection of clients
 *
 * Read the clients store from file.
 * Return an object with clients store closed in with following methods:
 *  -- addClient takes an object { name, id, socketId } and returns client obj
 *       if no client provided or client is not an object, throws an error
 *  -- getClient finds a user from the list matching the id and returns that obj
 *       if id does not match any client ids, returns null
 *       if no id provided, throws error
 *  -- getAllClients returns a copy of clients store
 *  -- hasClient takes and object and tries to match all keys to all objects part
 *     of the collection.
 *       USE CASE: user logges in with name, check if name
 *                 and IP match to any players.
 *       returns the object if all match
 *       returns null if not a complete match
 */

module.exports = () => {
  // read the store
  const clients = JSON.parse(
    fs.readFileSync(
      `./turakas/stores/clients.json`,
      (err, store) => (err ? err : store)
    )
  );

  function addClient(client) {
    if (!client) throw new Error("No parameters provided");
    if (typeof client !== "object")
      throw new Error("Expected object got " + typeof client);

    console.log(`Adding client to clients`);

    let newClient = NewClient(client);
    clients.push(newClient);

    _saveStore();

    return newClient;
  }
  function getAllClients() {
    console.log(`Get entire clients store`);
    return clients.slice();
  }
  function getClient(id) {
    if (!id) throw new Error("No parameter provided");
    console.log("Get client " + id);
    // id has max length 14. Socket id is always longer
    return id.length > 14
      ? _findSocket()
      : clients.find(client => client.id === id) || null;

    function _findSocket() {
      if (!clients.length || !clients[0].sockets) return null;
      return clients.find(client => client.sockets.find(socId => socId === id));
    }
  }
  function removeClient(id) {
    if (!id) throw new Error("No parameters provided");
    if (typeof id !== "string")
      throw new Error("Expected string got " + typeof id);

    console.log(`Remove client ${id} from clients`);
    let client = getClient(id);

    if (client) {
      clients.splice(clients.indexOf(client), 1);
      _saveStore();
      return true;
    } else return false;
  }
  function matchClient(parameters) {
    if (!parameters) throw new Error("No parameter provided");
    if (typeof parameters !== "object")
      throw new Error("Expected object got " + typeof parameters);

    console.log(`Comparing parameters in clients store`);

    let keys = Object.keys(parameters);

    return (
      clients.find(client =>
        keys.every(key => parameters[key] === client[key])
      ) || null
    );
  }

  function _saveStore() {
    console.log(`Save clients store`);

    fs.writeFileSync(
      `./turakas/stores/clients.json`,
      JSON.stringify(clients),
      err => {
        if (err) throw err;
        console.log(`clients.json updated`);
      }
    );
  }

  console.log(`==== Setting up clients store ====`);
  return {
    add: addClient,
    remove: removeClient,
    get: getClient,
    getAll: getAllClients,
    match: matchClient
  };
};
