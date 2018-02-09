<template>
  <div class="turakas">

    <turakas-navbar
      :hero="hero">
    </turakas-navbar>
  
    <component 
      :is="activeView"
      :heroId="hero.id">
    </component>
 
    
  </div>
</template>

<script>
import TurakasNavbar from './TurakasNavbar'
import TurakasLobby from './TurakasLobby'
import TurakasGame from './TurakasGame'

export default {
  name: 'Turakas',
  props: ['hero'],
  components: {
    TurakasNavbar, TurakasLobby
  },
  data() {
    return {
      activeView: 'TurakasLobby',
      game: [],
    }
  },
  methods: {

  },
  computed: {

  },
  // created() {
  //   // console.log(this.games)
  //   this.$socket.emit('getAvailableGames', this.hero.id)
  // },
  sockets: {
    gameClosed(closedGame) {
      console.log('Game closed')
      console.log(closedGame)
      this.games.splice(this.games.findIndex(game => 
                                             game.id === closedGame.id), 1)
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
