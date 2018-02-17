<template>
  <div class="turakasGamePlaying">

    <game-info
      :heroIx="heroIx"
      :heroId="hero.id"
      :deck="game.deck"
      :players="game.players"
      :trump="game.trump"
      :active="game.active"
      :time="time">
    </game-info>

    <game-board
      :board="game.board">
    </game-board>

    <game-controls
      class="controlButton"
      :active="game.active"
      :board="game.board.length"
      :attacking="game.attacking"
      :defending="game.defending"
      :players="game.players"
      :heroId="hero.id">
    </game-controls>

    <game-hand
      :active="game.active === heroIx"
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
      heroIx: this.game.players.find(pl => pl.id === this.hero.id).ix,
      time: {
        limit: 30,
        passed: 30,
      }
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
    time(timeUpdate) {
      console.log('time passed: ' + timeUpdate.passed + 
                       ' limit: ' + timeUpdate.limit   )

      this.time.passed = timeUpdate.passed
      this.time.limit = timeUpdate.limit
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
  position: relative;
  flex: 1 0 auto;
  background: $bg;
  border-radius: .5rem;

  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;

}



</style>