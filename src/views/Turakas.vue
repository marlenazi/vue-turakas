<template>
  <div class="turakas">

    <turakas-navbar
      :hero="hero">
    </turakas-navbar>
  
  <transition name="fade" mode="out-in">
    <component 
      :is="activeView"
      :heroId="hero.id"
      :hero="hero"
      :game="game">
    </component>
  </transition>
    
  </div>
</template>

<script>
import TurakasNavbar from './TurakasNavbar'
import TurakasLobby from './TurakasLobby'
import TurakasGame from './TurakasGame'

export default {
  name: 'Turakas',
  props: {
    hero: Object
  },
  components: {
    TurakasNavbar, TurakasLobby, TurakasGame
  },
  data() {
    return {
      activeView: 'TurakasLobby',
      game: {},
    }
  },
  methods: {

  },
  computed: {

  },
  sockets: {
    joinedGame(state) {
      console.log('Joined game')
      console.log(state)
      this.activeView = 'TurakasGame'
      this.game = state
    },
    leftGame() {
      this.activeView = 'TurakasLobby'
      this.game = {}
    },
    updateGame(state) {
      console.log('Updating game')
      this.game = state
    },
    gameOver(state) {
      this.game = state
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakas {
  display: flex;
  flex-flow: column nowrap;
}
</style>
