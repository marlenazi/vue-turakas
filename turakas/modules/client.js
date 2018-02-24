const shortId = require('shortid')

module.exports = function NewClient(client) {
  if (!client) throw new Error('no parameters provided')
  
  let {name, ip } = client
  let id = shortId.generate()
  let game = null
  let status = () => game ? 'playing' : 'idle'
  let rank = 0

  function addRank() {
    console.log('Bump up the rank')
    rank = rank + 1

    return
  }
  console.log('Creating new client: ' + client.name)
  return {
    id, 
    name, 
    ip,
    rank,
    game,
    status: status(),
    addRank,
  }
}