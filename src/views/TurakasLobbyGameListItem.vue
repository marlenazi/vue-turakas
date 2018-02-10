<template>
  <button 
    class="game"
    @click="$_joinGame(game.id)"
  >
    <span>Play</span>
    <div class="registeredPlayers">
      <div 
        class="players"
        v-for="(player, ix) in game.players"
        :key="player.id"
      >
        P{{ ix += 1 }}: {{ player.name }} 
      </div>
    </div>
  </button>
</template>

<script>

export default {
  name: 'GameList',
  props: {
    game: Object,
    heroId: String
  },
  data() {
    return {
      title: 'Games'
    }
  },
  methods: {
    $_joinGame(id) {
      this.$socket.emit('joinGame', id, this.heroId)
    },
  },
}

</script>

<style lang="scss" scoped>
@import './../style/variables';
.game {
  flex: 1 0 15rem;
  margin: 1rem;

  height: 8rem;
  max-width: 18rem;

  display: flex;
  justify-content: space-around;
}
span {
  font-size: 2rem;
  color: $action;
}
.registeredPlayers {
  font-size: 1.2rem;
  text-align: left;
}

</style>