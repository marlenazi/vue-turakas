const items = require('./items')()

/**
 * Items returns and object with following methods:
 *    getAllItems  -- returns a copy of an array with all items in collection
 *    getItem      -- accepts: id
 *                      returns a item with matching id
 *    addItem      -- accepts: {name, ip, socketId}
 *                      checks if item is returning
 *                      if not returning, creates new item, 
 *                          adds new item to collection
 *                      returns the item object
 */


function addItem(args) {
  try {
    return items.addItem(args)
  } catch (error) {
    return true
  }
} 
function removeItem(args) {
  try {
    return items.removeItem(args)
  } catch (error) {
    return 'true: !!!error'
  }  
}
console.log(`
  Items exists: ${items}
  ===============================
  ${typeof items === 'object'}: items returns an object.
  ${Array.isArray(items.getAllItems())}: getAllItems returns an array.
  ${ addItem() }: creating new item with no args throws error
  ${ addItem('1') }: creating new item with bad args throws error
  ${ removeItem() }: remove item with no args returns error
`)


// Add new item
console.log(`==== Add new item
--- LOG`)

let newItem = {
      name: 'Odin',
      ip: '192.0.0.1',
      socketId: 'm0ck1d18'
    }
let addedItem = items.addItem( newItem )
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
  ${items.getAllItems().length > 0}: collection is populated
  ${!!items.hasItem({
    name: 'Odin',
    ip: '192.0.0.1',
  })}: item is in the collection
`)


// Get all items
console.log(`==== Get all items
--- LOG`)

let allItems = items.getAllItems()

console.log(`--- END LOG ---
  ${Array.isArray(allItems)}: return an array
  ${allItems.length > 0}: array is populated
`)


// Remove a item
console.log(`==== Remove an item
--- LOG`)

let removeResult = items.removeItem(addedItemId)

console.log(`--- END LOG ---
  ${removeResult}: item removed
  ${!items.removeItem(addedItemId)}: fail to remove from empty store
  ${items.getAllItems().length === 0}: item store is empty again
`)