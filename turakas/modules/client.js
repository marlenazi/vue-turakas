const shortId = require('shortid')

module.exports = function NewClient(client) {
  if (!client) throw new Error('no parameters provided')
  
  let {name, ip } = client
  let id = shortId.generate()
  
  console.log('Create new client: ' + client.name)
  return {
    id, name, ip,
    status: 'idle',
    rank: 0,
    game: null,
    away: null,
  }
}