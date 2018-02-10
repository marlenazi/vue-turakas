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
      :game="game"
      :games="games">
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
    hero: Object,
    game: Object,
    games: Array
  },
  components: {
    TurakasNavbar, TurakasLobby, TurakasGame
  },
  data() {
    return {
      activeView: 'TurakasLobby',
    }
  },
  methods: {

  },
  computed: {

  },
  created() {
    if (this.game.status) {
      this.activeView = 'TurakasGame'
    }
  },
  sockets: {
    joinedGame(state) {
      this.activeView = 'TurakasGame'
    },
    leftGame() {
      this.activeView = 'TurakasLobby'
    },
    gameClosed() {
      this.activeView = 'TurakasLobby'
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
