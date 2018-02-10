<template>
  <div class="turakasGame">

    <transition name="fade" mode="out-in">
      <component
        :is="activeView"
        :hero="hero"
        :game="game">
      </component>
    </transition>
  </div>
</template>

<script>
import GameWaiting from './TurakasGameWaiting'
import GamePlaying from './TurakasGamePlaying'

export default {
  name: 'TurakasGame',
  props: {
    hero: Object,
    game: Object
  },
  components: {
    GameWaiting, GamePlaying
  },
  data() {
    return {
      
    }
  },
  methods: {
    $_leaveGame() {
      console.log('Leaving game')
      console.log(this.hero)
      this.$socket.emit('leaveGame', this.hero.id)
    }
  },
  computed: {
    activeView() {
      return 'Game' + this.game.status
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakasGame {
  flex: 1 0 auto;
  margin: .5rem;
  border: .2rem solid $accent;
  border-radius: .5rem;
}
</style>