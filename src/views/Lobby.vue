<template>
  <div class="lobby">
      {{ hero.name }} : {{ hero.id }}
    <br>
    <button class="newGameBtn"
      @click="newGame">
      New Game
    </button>
    <ul v-if="games.length > 0"
      v-for="game in games"
      :key="game.id">
      <li>{{ game.id }}  <button @click="joinGame(game.id)">Join</button> </li>
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
      games: []
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
    this.$socket.emit('getWaitingGames')
  },
  sockets: {
    waitingGames(games) {
      console.log('Got games')
      console.log(games)
      this.games = games
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
