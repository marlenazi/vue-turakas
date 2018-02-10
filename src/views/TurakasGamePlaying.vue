<template>
  <div class="turakasGamePlaying">
    <div class="leaveAndInfo">
      <leave-button :heroId="hero.id"></leave-button>

      <game-info
        :heroId="hero.id"
        :deck="game.deck"
        :players="game.players"
        :trump="game.trump"
        :active="game.active">
      </game-info>
    </div>
    <game-board
      :board="game.board">
    </game-board>

    <game-controls
      :active="game.active"
      :board="game.board.length"
      :attacking="game.attacking"
      :defending="game.defending"
      :players="game.players"
      :heroId="hero.id">
    </game-controls>
    
    <game-hand
      :hand="hand">
    </game-hand>

    <!-- {{ hand }} -->
  </div>
</template>

<script>

import LeaveButton from './TurakasGameLeaveButton'
import GameInfo from './TurakasGamePlayingInfo'
import GameBoard from './TurakasGamePlayingBoard'
import GameControls from './TurakasGameControls'
import GameHand from './TurakasGamePlayingHand'

export default {
  name: 'TurakasGamePlaying',
  props: {
    hero: Object,
    game: Object
  },
  components: {
    LeaveButton, GameInfo, GameBoard, GameControls, GameHand
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
      console.log('Got hand?')
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

  flex: 1 1 auto;
  background: $btn;
  border-radius: .5rem;

  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;

}
.leaveAndInfo {

  flex: 0 1 auto;
  display: flex;
  
}
</style>