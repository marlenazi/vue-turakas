<template>
  <div class="lobby">

    <hero
      :hero="hero">
    </hero>

    <button class="newGameBtn"
        @click="newGame">
        New Game
    </button>

    <games
      :hero="hero"
      :games="games">
    </games>
    
  </div>
</template>

<script>
import hero from './lobby/Hero'
import games from './lobby/Games'

export default {
  name: 'Lobby',
  props: ['hero', 'game'],
  components: {
    hero, games
  },
  data() {
    return {
      games: [],
    }
  },
  methods: {
    newGame() {
      this.$socket.emit('newGame', this.hero.id)
    },
  },
  computed: {

  },
  created() {
    // console.log(this.games)
    this.$socket.emit('getAvailableGames', this.hero.id)
  },
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

<style scoped>
.lobby {
  display: flex;
  flex-flow: column nowrap;
  background: rgb(255, 140, 100);
  background: white;
}

.newGameBtn {
  border-radius: 50%;
  position: absolute;
  top: 1.2rem;
  right: 1rem;
  margin: 1rem;
  height: 6rem;
  width: 6rem;
  font-size: 1.4rem;
  background: red;
  color: white;
}

@media screen and (orientation: landscape) {

}
</style>
