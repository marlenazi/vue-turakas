<template>
  <div class="turakas">
  
  <transition name="fade" mode="out-in">
    <component 
      :is="turakasView"

      :hero="hero"
      :game="game"
      :games="games">
    </component>
  </transition>
    
  </div>
</template>

<script>

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
    TurakasLobby, TurakasGame
  },
  data() {
    return {
      turakasView: 'TurakasLobby',
    }
  },
  created() {
    if (this.game.status === 'playing') {
      console.log('Found ongoing game: ' + this.game.id)
      this.turakasView = 'TurakasGame'
    }
  },
  sockets: {
    joinedGame() {
      console.log('Joined a game. Switching turakasView to Game')
      this.turakasView = 'TurakasGame'
    },
    leftGame() {
      console.log('Left the game. Switching turakasView to Lobby')
      this.turakasView = 'TurakasLobby'
    },
    loggedIn() {
      this.turakasView = 'TurakasLobby'
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakas {
  display: flex;
  flex-flow: column nowrap;
  padding: .5em;
}

</style>
