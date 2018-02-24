<template>
  <div class="turakasGame">

    <transition name="fade" mode="out-in">
      <component
        :is="gameView"
        :hero="hero"
        :game="game">
      </component>
    </transition>
  </div>
</template>

<script>
import GameWaiting from './TurakasGameWaiting'
import GamePlaying from './TurakasGamePlaying'
import GameFinished from './TurakasGameFinished'

export default {
  name: 'TurakasGame',
  props: {
    hero: Object,
    game: Object
  },
  components: {
    GameWaiting, GamePlaying, GameFinished
  },
  methods: {
    $_leaveGame() {
      console.log('Leaving game')
      console.log(this.hero)
      this.$socket.emit('leaveGame', this.hero.id)
    }
  },
  computed: {
    gameView() {

      return 'game' + this.game.status
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakasGame {

  flex: 1 0 auto;
  display: flex;
  flex-flow: column nowrap;
}
</style>