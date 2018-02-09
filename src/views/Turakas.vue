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
      games: [],
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
    availableGames(games) {
      console.log('Got available games')
      console.log(games)
      this.games = games
    },
    gameCreated(game) {
      console.log('New game')
      console.log(game)
      this.games.push(game)
    },
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
