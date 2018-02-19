const clients = require('./clients')()

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

function add(args) {
  try {
    return clients.add(args)
  } catch (error) {
    return true
  }
} 
function remove(args) {
  try {
    return clients.remove(args)
  } catch (error) {
    return 'true: !!!error'
  }  
}
console.log(typeof clients)
console.log(`
  Clients exists: ${clients}
  ===============================
  ${ typeof clients === 'object' }: clients returns an object.
  ${ Array.isArray(clients.getAll()) }: getAll returns an array.
  ${ add() }: creating new client with no args throws error
  ${ add('1') }: creating new client with bad args throws error
  ${ remove() }: remove client with no args returns error
`)


// Add new client
console.log(`==== Add new client
--- LOG`)

let newClient = {
      name: 'Odin',
      ip: '192.0.0.1',
      socketId: 'm0ck1d18'
    }
let addedClient = clients.add( newClient )
let addedClientId = addedClient.id

console.log(`--- END LOG ---
  ${typeof addedClient === 'object'}: returns a client object
  ${typeof addedClient.id === 'string'}: client has an id (string)
  ${typeof addedClient.ip === 'string'}: client has an ip (string)
  ${typeof addedClient.name === 'string'}: client has an name (string)
  ${Array.isArray(addedClient.sockets)}: client has an sockets property (array)
  ${addedClient.sockets.length > 0}: client's sockets store is not empty
`)

// Check if client exists

console.log(`==== Check if client exists
--- END LOG`)
console.log(`--- END LOG ---
  ${clients.getAll().length > 0}: collection is populated
  ${!!clients.match({
    name: 'Odin',
    ip: '192.0.0.1',
  })}: client is in the collection
`)


// Get all clients
console.log(`==== Get all clients
--- LOG`)

let allClients = clients.getAll()

console.log(`--- END LOG ---
  ${Array.isArray(allClients)}: return an array
  ${allClients.length > 0}: array is populated
`)


// Remove a client
console.log(`==== Remove an client
--- LOG`)

let removeResult = clients.remove(addedClientId)

console.log(`--- END LOG ---
  ${removeResult}: client removed
  ${!clients.remove(addedClientId)}: fail to remove from empty store
  ${clients.getAll().length === 0}: client store is empty again
`)