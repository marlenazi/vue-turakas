<template>
  <div class="games">
    <header class="gamesHeader">
      <h2>Choose a game</h2>
    </header>

  <transition-group name="fade" mode="out-in">
    <button
      tabindex="2"
      class="game"
      v-if="games.length > 0"
      v-for="game in games"
      :key="game.id"
      @click="joinGame(game.id)"
    >

      Players: {{ game.players.length }}/{{ game.size }}
    
      <div class="players"
        v-for="player in game.players"
        :key="player.id">
          {{ player.name }}
      </div>
    
      <span class="join">Play</span>
    </button>
  </transition-group>

  </div>
</template>

<script>

export default {
  name: 'MainLobby',
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
.games * {
  border: 1px solid black;
}
.games {
  padding: 1rem;
  flex: 1 1 auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  overflow: auto;
  align-items: flex-start;
  align-content: flex-start;
  max-width: 50rem;
}
// transition group creates a span and we want it to be flex
.games span {
  display: flex;
  padding: 1rem;
  flex-flow: row wrap;
  justify-content: center;
  flex: 1 1 auto;
}
.gamesHeader {
  color: $action;
  text-align: left;
  flex: 1 0 100%;
}
.gamesHeader h2 {
  margin: .5rem 1rem;
  color: $title;
}

.game {
  flex: 1 0 20rem;
  max-width: 20rem;
  height: 10rem;
  margin: 1rem;
}


@media screen and (orientation: landscape) {

}
</style>
