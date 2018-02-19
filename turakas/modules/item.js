const shortId = require('shortid')

module.exports = function NewClient(client) {
  if (!client) throw new Error('no parameters provided')
  
  let {name, ip, socketId } = client
  let id = shortId.generate()
  
  console.log('Create new client: ' + client.name)
  return {
    id, name, ip,
    sockets: [socketId],
    rank: 0,
  }
}