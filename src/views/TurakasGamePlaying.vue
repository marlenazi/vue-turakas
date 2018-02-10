<template>
  <div class="turakasGamePlaying">

    <leave-button :heroId="hero.id"></leave-button>

    <game-info
      :deck="game.deck"
      :players="game.players"
      :trump="game.trump"
      :active="game.active">
    </game-info>

    <game-board
      :board="game.board">
    </game-board>

    <game-hand
      :hand="hand">
    </game-hand>
    
    Status: {{ game.status }} <br>
    {{ game }}
  </div>
</template>

<script>

import LeaveButton from './TurakasGameLeaveButton'
import GameInfo from './TurakasGamePlayingInfo'
import GameBoard from './TurakasGamePlayingBoard'
import GameHand from './TurakasGamePlayingHand'

export default {
  name: 'TurakasGamePlaying',
  props: {
    hero: Object,
    game: Object
  },
  components: {
    LeaveButton, GameInfo, GameBoard, GameHand
  },
  data() {
    return {
      hand: [],
    }
  },
  methods: {

  },
  mounted() {
    if (this.game.status === 'Playing') {
      this.$socket.emit('getHand', this.hero.id)
    }
  },
  sockets: {
    hand(hand) {
      this.hand = hand
    },
    updateGame(game) {
      if (game.status === 'Playing' || game.status === 'Finished') {
        console.log('asking for a hand')
        this.$socket.emit('getHand', this.hero.id)
      }
    },
    time(timePassed) {
      this.time = timePassed
    },
    gameOver(state) {
      console.log('Winner: ' + state.winner.name)
      console.log('Turakas: ' + state.turakas.name)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakasGamePlaying {
  flex: 1 0 auto;
  background: $btn;
  border-radius: .5rem;
}
</style>