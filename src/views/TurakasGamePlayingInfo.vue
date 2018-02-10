<template>
  <div class="gameInfo">

    <div class="villain">
      <div class="villainName">
        {{ villain.name }}
      </div>
      {{ moves }}
      <transition-group
        class="villainHand"
        name="fade" 
        mode="out-in">
          <game-card
            id="villainCard"
            v-for="(card, ix) in villain.hand"
            :key="ix"
            :card="villainCard">
          </game-card>
      </transition-group>
    </div>

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
  padding: .3rem;
  flex: 1 1 auto;
  border-radius: .5rem;
  background: $action;

  overflow: hidden;
  display: flex;
  justify-content: space-between;
}

.trumpAndDeck {
  flex: 0 0 auto;
}

#deck {
  height: 4rem;
  width: 3rem;
  margin: 0;
}
#trumpCard {
  margin-top: .2rem;
  margin-right: -1rem;
  height: 3rem;
  width: 4rem;
}
#deck {
  margin-left: -1rem;
  color: rgb(219, 197, 0);
}
.villain {
  flex: 0 0 5rem;
  max-width: 5rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;  
}
.villainName {
  font-weight: bold;
  white-space: nowrap;
}
.villainHand {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding-left: .3rem; 
}
#villainCard {
  height: 2rem;
  width: 1.4rem;
  margin: 0 -.3rem;
  color: rgb(219, 197, 0);
  overflow: hidden;
  
}
</style>