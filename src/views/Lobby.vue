<template>
  <div class="lobby">
      {{ hero.name }} : {{ hero.id }}<br>
      {{ games }}
    <br>
    <button class="newGameBtn"
      @click="newGame">
      New Game
    </button>
      <div>Resume: </div>
    <ul v-if="games.length > 0"
      v-for="game in games"
      :key="game.id">
      <li>{{ game.id }} {{game.players}} <button @click="joinGame(game.id)">Join</button> </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'Lobby',
  props: ['hero', 'game'],
  components: {

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
    joinGame(id) {
      this.$socket.emit('joinGame', id, this.hero.id)
    }
  },
  computed: {

  },
  created() {
    console.log(this.games)
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

<style>
.lobby {
  background: greenyellow;
  height: 25rem;
  width: 16rem;
  overflow: auto;
}
</style>
