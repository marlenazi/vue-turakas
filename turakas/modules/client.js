const shortId = require('shortid')

module.exports = function NewClient(client) {
  if (!client) throw new Error('no parameters provided')
  
  let {name, ip } = client
  let id = shortId.generate()
  let game = null
  let status = () => game ? 'playing' : 'idle'
  let rank = 0
  let turakas = 0
  let pagunid = []
  let madePagunid = []

  console.log('Creating new client: ' + client.name)
  return {
    id, 
    name, 
    ip,
    rank,
    game,
    status: status(),
    pagunid,
    turakas,
    madePagunid,
  }
}