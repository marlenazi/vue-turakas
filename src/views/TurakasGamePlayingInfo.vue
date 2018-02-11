<template>
  <div class="gameInfo">

    <leave-button :heroId="heroId"></leave-button>

    <div class="villain">
      <div class="villainName">
        {{ villain.name }}
      </div>
      <transition-group
        class="villainHand"
        name="fade" 
        mode="out-in">
          <game-card
            id="villainCard"
            v-bind:class="{ active: active !== heroIx }"
            v-for="(card, ix) in villainHandLength"
            :key="ix"
            :rank="'blank'"
            :suit="'blank'"
            :bigRank="'blank'">
          </game-card>
      </transition-group>
    </div>

    <div class="trumpAndDeck">
      <game-card
        id="trumpCard"
        :rank="trump.rank"
        :suit="trump.suit"
        :bigRank="'blank'">
      </game-card>

      <div id="deck">
        {{ deck }}
      </div>
    </div>


  </div>
</template>

<script>
import GameCard from './TurakasGameCard'
import LeaveButton from './TurakasGameLeaveButton'
export default {
  name: 'GameInfo',
  props: {
    heroIx: Number,
    heroId: String,
    deck: Number,
    players: Array,
    trump: Object,
    active: Number
  },
  components: {
    LeaveButton, GameCard
  },
  data() {
    return {

      trumpCard: {rank: this.trump.rank, suit: this.trump.suit},
      deckCard: {rank: this.deck, suit: 'b'},
    }
  },
  methods: {

  },
  computed: {
    $_deck() {
      return this.deck
    },
    villain() {
      return this.players.find(player => player.id !== this.heroId)
    },
    villainCard() {
      return {rank: this.villain.hand, suit: 'b'}
    },
    villainHandLength() {
      return this.villain.hand > 12 ? 12 : this.villain.hand
    }
  },
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameInfo {
  // border: 1px solid blue;
  padding: .3rem;
  flex: 0 1 auto;
  border-radius: .5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trumpAndDeck {
  flex: 0 0 auto;
  margin-left: auto;
  display: flex;
}

#deck {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: .3rem;
  height: 4rem;
  width: 3rem;
  background: $cardBack;
  font-size: 1.5rem;
}
#trumpCard {
  margin-top: .3rem;
  margin-right: -1.8rem;
  height: 3rem;
  width: 4rem;
}

#deck {
  
}
.villain {
  // border: 1px solid blue;
  position: relative;
  top: 1.8rem;
  margin-left: auto;
  flex: 0 0 5rem;
  width: 7.5rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  text-align: center;
}
.villainName {
  margin: .1rem;
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
  overflow: hidden;
  
}
.active {
  box-shadow: 0px 0px 8px 1px $shadow;
}
</style>