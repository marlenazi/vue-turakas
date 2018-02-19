const items = require('./items')('test')

/**
 * Items returns and object with following methods:
 *    getAll  -- returns a copy of an array with all items in collection
 *    get      -- accepts: id
 *                      returns a item with matching id
 *    add      -- accepts: {name, ip, socketId}
 *                      checks if item is returning
 *                      if not returning, creates new item, 
 *                          adds new item to collection
 *                      returns the item object
 */


function add(args) {
  try {
    return items.add(args)
  } catch (error) {
    return true
  }
} 
function remove(args) {
  try {
    return items.remove(args)
  } catch (error) {
    return 'true: !!!error'
  }  
}
console.log(`
  Items exists: ${items}
  ===============================
  ${typeof items === 'object'}: items returns an object.
  ${Array.isArray(items.getAll())}: getAll returns an array.
  ${ add() }: creating new item with no args throws error
  ${ add('1') }: creating new item with bad args throws error
  ${ remove() }: remove item with no args returns error
`)


// Add new item
console.log(`==== Add new item
--- LOG`)

let newItem = {
      name: 'Odin',
      ip: '192.0.0.1',
      socketId: 'm0ck1d18'
    }
let addedItem = items.add( newItem )
let addedItemId = addedItem.id

console.log(`--- END LOG ---
  ${typeof addedItem === 'object'}: returns a item object
  ${typeof addedItem.id === 'string'}: item has an id (string)
  ${typeof addedItem.ip === 'string'}: item has an ip (string)
  ${typeof addedItem.name === 'string'}: item has an name (string)
  ${Array.isArray(addedItem.sockets)}: item has an sockets property (array)
  ${addedItem.sockets.length > 0}: item's sockets store is not empty
`)

// Check if item exists

console.log(`==== Check if item exists
--- END LOG`)
console.log(`--- END LOG ---
  ${items.getAll().length > 0}: collection is populated
  ${!!items.has({
    name: 'Odin',
    ip: '192.0.0.1',
  })}: item is in the collection
`)


// Get all items
console.log(`==== Get all items
--- LOG`)

let allItems = items.getAll()

console.log(`--- END LOG ---
  ${Array.isArray(allItems)}: return an array
  ${allItems.length > 0}: array is populated
`)


// Remove a item
console.log(`==== Remove an item
--- LOG`)

let removeResult = items.remove(addedItemId)

console.log(`--- END LOG ---
  ${removeResult}: item removed
  ${!items.remove(addedItemId)}: fail to remove from empty store
  ${items.getAll().length === 0}: item store is empty again
`)