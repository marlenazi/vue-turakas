const shortId = require("shortid");
const NewItem = require("./item");
const fs = require("fs");

/**
 * Collection of items
 *
 * Read the items store from file.
 * Return an object with items store closed in with following methods:
 *  -- addItem takes an object { name, id, socketId } and returns item obj
 *       if no item provided or item is not an object, throws an error
 *  -- getItem finds a user from the list matching the id and returns that obj
 *       if id does not match any item ids, returns null
 *       if no id provided, throws error
 *  -- getAllItems returns a copy of items store
 *  -- hasItem takes and object and tries to match all keys to all objects part
 *     of the collection.
 *       USE CASE: user logges in with name, check if name
 *                 and IP match to any players.
 *       returns the object if all match
 *       returns null if not a complete match
 */

module.exports = function items(storeName = 'store') {
  const name = storeName;
  // create the store to the disk
  fs.writeFileSync(`./turakas/stores/${name}.json`, JSON.stringify([]), err => {
    if (err) throw err;
    console.log(`${name}.json created`);
    return true;
  });
  // read the store
  const itemsStore = fs.readFileSync(
    `./turakas/stores/${name}.json`,
    (err, store) => (err ? err : store)
  );
  const items = JSON.parse(itemsStore);

  function addItem(item) {
    if (!item) throw new Error("No parameters provided");
    if (typeof item !== "object")
      throw new Error("Expected object got " + typeof item);

    console.log(`Adding item to ${name}`);

    let newItem = NewItem(item);
    items.push(newItem);

    _saveStore();

    return newItem;
  }
  function getAllItems() {
    console.log(`Get entire ${name} store`);
    return items.slice();
  }
  function getItem(id) {
    if (!id) throw new Error("No parameter provided");
    console.log("Get item " + id);

    return items.find(item => item.id === id) || null;
  }
  function removeItem(id) {
    if (!id) throw new Error("No parameters provided");
    if (typeof id !== "string")
      throw new Error("Expected string got " + typeof id);

    console.log(`Remove item ${id} from ${name}`);
    let item = getItem(id);

    if (item) {
      items.splice(items.indexOf(item), 1);
      _saveStore();
      return true;
    } else return false;
  }
  function hasItem(parameters) {
    if (!parameters) throw new Error("No parameter provided");
    if (typeof parameters !== "object")
      throw new Error("Expected object got " + typeof parameters);

    console.log(`Comparing parameters in ${name} store`);

    let keys = Object.keys(parameters);

    return (
      items.find(item => keys.every(key => parameters[key] === item[key])) ||
      null
    );
  }

  function _saveStore() {
    console.log(`Save ${name} store`);

    fs.writeFileSync(`./turakas/stores/${name}.json`, JSON.stringify(items), err => {
      if (err) throw err;
      console.log(`${name}.json updated`);
      return true;
    });
  }

  console.log(`==== Returning ${name} store ====`);
  return {
    get: getItem,
    getAll: getAllItems,
    add: addItem,
    remove: removeItem,
    has: hasItem
  };
};
