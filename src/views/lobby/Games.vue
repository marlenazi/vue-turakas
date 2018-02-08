<template>

  <div class="games height-1">
    <header class="gamesHeader">
      <h2>Choose game</h2>

    </header>
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

.games {
  /* border: 1px solid black; */
  flex: 1 1 auto;
  padding: .5rem;
  display: flex;
  flex-flow: row wrap;
  /* justify-content: center; */
  align-content: flex-start;
  overflow: auto;
}
.gamesHeader {
  /* border: 1px solid black; */
  flex: 1 1 100%;
  margin: 1.5rem 1rem;
  text-align: left;
}
.gamesHeader h2 {
  font-size: 1.2rem;

}
.game {
  /* border: 1px solid black; */
  flex: 1 0 8rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
  background: rgb(252, 0, 0);
  height: 6rem;
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

@media screen and (orientation: landscape) {
  .gamesHeader {
    margin: 1rem;
  }
}
</style>
