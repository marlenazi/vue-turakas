const NewClient = require("./client");
const fs = require("fs");

/** ==== Client Store ====
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
 *       takes an object containing paramteres (min 2 different)
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

module.exports = () => {
  // read the store
  const clients = []
  
  // JSON.parse(
  //   fs.readFileSync(
  //     `./turakas/stores/clients.json`,
  //     (err, store) => (err ? err : store)
  //   )
  // );

  function addClient(client) {
    if (!client) throw new Error("No parameters provided");
    if (typeof client !== "object")
      throw new Error("Expected object got " + typeof client);
    if (typeof client.name !== 'string')
      throw new Error("Expected client.name to be string got " + typeof client.name);

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
    if (typeof id !== 'string')
      throw new Error("Expected id as string got " + typeof id);
    console.log("Get client " + id);

    return clients.find(client => client.id === id) || null;
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
    if (!parameters) throw new Error("No parameters provided");
    if (typeof parameters !== "object")
      throw new Error("Expected object got " + typeof parameters);
    if (Object.keys(parameters).length < 2)
      throw new Error("Expected at least 2 parameters");

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
      JSON.stringify(
        clients.map(client => {
          client.game = null;
          client.away = null;

          return client;
        })
      ),
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
