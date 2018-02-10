<template>
  <div class="gameInfo">

    <div class="villain">
      {{ villain.name }}
      <game-card
        id="villain"
        :card="villainCard">
      </game-card>
    </div>

    {{ moves }}
    <div class="trumpAndDeck">
      <game-card
        id="trumpCard"
        :card="trumpCard">
      </game-card>

      <game-card
        id="deck"
        :card="deckCard">
      </game-card>
    </div>


  </div>
</template>

<script>
import GameCard from './turakasGameCard'

export default {
  name: 'GameInfo',
  props: {
    heroId: String,
    deck: Number,
    players: Array,
    trump: Object,
    active: Number
  },
  components: {
    GameCard
  },
  data() {
    return {
      villain: this.players.find(player => player.id !== this.heroId),
      trumpCard: {rank: this.trump.rank, suit: this.trump.suit},
      deckCard: {rank: this.deck, suit: 'b'},
    }
  },
  methods: {
    $_getVillainCard() {
      console.log('i dont retr')
      return '2'
    }
  },
  computed: {
    moves() {
      return this.active === this.players.find(player => 
        player.id === this.heroId).ix ? 'You' : 'Not You'
    },
    villainCard() {
      return {rank: this.villain.hand, suit: 'b'}
    }
  },
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameInfo {
  border: .2rem solid $accent;
  padding: .5rem;
  flex: 1 1 auto;
  border-radius: .5rem;
  background: $action;

  overflow: hidden;
  display: flex;
  justify-content: space-around;
}

.trumpAndDeck {
  flex: 0 0 auto;
}

#trumpCard, #deck, #villain {
  height: 4rem;
  width: 3rem;
  margin: 0;
}
#deck {
  margin-left: -1rem;
}

.villain {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
</style>