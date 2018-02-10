module.exports = function Cards() {

  function makeCards() {

    let suits = ["h", "d", "s", "c"]
    let ranks = ["9", "8", "7", "6", "5", "4", "3", "2", "1"]
    let cards = []

    for (rank of ranks) {
      for (suit of suits) {
        cards.push({ rank, suit, value: +rank })
      }
    }
    
    return cards
  } //returns an unshuffled deck of 36 cards
  function shuffle(deck) {

    let lth = deck.length
    let i
    let j

    while (lth) {
      i = Math.floor(Math.random() * lth--)
      j = deck[lth]
      deck[lth] = deck[i]
      deck[i] = j
    }

    return deck
  } 
  //returns shuffled deck
  return shuffle( makeCards() )
}