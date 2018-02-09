<template>
  <div class="lobby">

    <hero
      :hero="hero">
    </hero>

    <button class="newGameBtn"
    tabindex="1"
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
  name: 'Main',
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

<style lang="scss" scoped>

@import './../style/variables';

.lobby {
  display: flex;
  flex-flow: column nowrap;
  align-content: flex-start;
}

.newGameBtn {
  border-radius: 50%;
  position: absolute;
  top: .8rem;
  right: 0rem;
  margin: 2rem;
  height: 5rem;
  width: 5rem;
  font-size: 1.2rem;
  color: $action;
}

@media screen and (orientation: landscape) {

}
</style>
