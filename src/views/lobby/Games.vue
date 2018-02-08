<template>

  <div class="games height-1">
    <header class="gamesHeader">
      <h2>Choose a game</h2>
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

<style lang="scss" scoped>

@import './../../style/variables';

.games {
  padding: 1rem;
  flex: 1 0 auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  overflow: auto;
  align-items: flex-start;
  align-content: flex-start;
}
.gamesHeader {
  color: $action;
  text-align: left;
  flex: 1 0 100%;
}
.gamesHeader h2 {
  margin: 1rem;
}

.game {
  flex: 1 0 8rem;
  max-width: 16rem;
  height: 6rem;
  margin: 1rem;
}


@media screen and (orientation: landscape) {

}
</style>
