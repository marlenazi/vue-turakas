const { clients, games } = require('./stores')

it('has access to other module', () => {
  console.log(games.getComa())
  expect(typeof games.getComa()).toBe('object')
  expect(games.getComa().name).toBe('Coma')
})