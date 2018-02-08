<template>
  <div class="lobby height-1">
    <nav class="height-1">
      <header class="lobbyHeader">
        <h1>Lobby</h1> 
        <p>Available games</p>
      </header>
      <button class="newGameBtn"
        @click="newGame">
        New Game
      </button>
    </nav>
    <div class="games height-1">
      <button
      class="game"
      v-if="games.length > 0"
      v-for="game in games"
      :key="game.id"
      @click="joinGame(game.id)">
        Players: {{ game.players.length }}/{{ game.size }}
        <div class="players"
          v-for="player in game.players"
          :key="player.id">
            {{ player.name }}
        </div>
        <span class="join">Play</span>
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Games',
  props: ['hero', 'games'],
  components: {

  },
  data() {
    return {
      
    }
  },
  methods: {
    joinGame(id) {
      this.$socket.emit('joinGame', id, this.hero.id)
    },
    newGame() {
      this.$socket.emit('newGame', this.hero.id)
    },
  },
  computed: {

  },
  created() {

  },
  sockets: {
    
  }
}
</script>

<style scoped>

.lobby {
  background: whitesmoke;
  flex: 1 1 auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  margin: .5rem;
  /* padding: 1rem; */
}
nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 0 0 auto;

}
.games {
  /* border: 1px solid black; */
  flex: 1 1 auto;
  padding: .5rem;
  display: flex;
  flex-flow: row wrap;
  overflow: auto;
}
.game {
  flex: 1 0 auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
  background: rgb(252, 0, 0);
  height: 8rem;
  width: 8rem;
  margin: .5rem;
  padding: 1rem;

  transition: all .05s ease-in-out;
}
.game:active {
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 
              0 3px 6px rgba(0,0,0,0.23);
}
.players {
  text-align: left;
}
.join {
  color: white;
  font-size: 1.2rem;
}
.newGameBtn {
  border-radius: 50%;
  margin: 1rem;
  height: 6rem;
  width: 6rem;
  font-size: 1.4rem;
  background: red;
  color: white;
}
</style>
