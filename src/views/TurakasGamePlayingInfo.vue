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
        :rank="$_trumpRank"
        :suit="trump.suit"
        :bigRank="'blank'">
      </game-card>

      <div id="deck">
        {{ deck }}
      </div>
    </div>

    <game-timer
     :time="time" 
    />


  </div>
</template>

<script>
import GameCard from './TurakasGameCard'
import LeaveButton from './TurakasGameLeaveButton'
import GameTimer from './TurakasGameTimer'

export default {
  name: 'GameInfo',
  props: {
    heroIx: Number,
    heroId: String,
    deck: Number,
    players: Array,
    trump: Object,
    active: Number,
    time: Object,
  },
  components: {
    LeaveButton, GameCard, GameTimer
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
    $_trumpRank() {
      return this.deck ? this.trump.rank : 'blank'
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
  border-bottom: .1em solid $accent;
  position: relative;
  // padding: .3em;
  padding-bottom: .5em;
  flex: 0 1 auto;
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
  margin-right: -2.6em;
  height: 3rem;
  width: 4rem;
}

#deck {
  
}
.villain {
  // border: 1px solid blue;
  // position: relative;
  // top: 1rem;
  margin-left: auto;
  flex: 0 0 5rem;
  width: 7.5rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  text-align: center;
}
.villainName {
  margin: .4rem;
  font-weight: bold;
  font-size: 1.2em;
  white-space: nowrap;
  color: $accent;
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
  box-shadow: 0px 0px 6px 1px $shadow;
  animation-name: your-move;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes your-move {
  from {
    box-shadow: 0px 0px 5px 1px $action;
  }
  to {
    box-shadow: 0px 0px 3px 1px $accent;
  }
}


</style>