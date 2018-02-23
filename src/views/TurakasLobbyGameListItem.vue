<template>
  <button 
    class="game"
    :disabled="game.status !== 'waiting'"
    @click="$_joinGame(game.id)"
  >
    <span>Play</span>
    {{ game.status }}
    <div class="registeredPlayers">
      Players:
      <div 
        class="players"
        v-for="player in game.players"
        :key="player.id"
      >
        -- {{ player.name }} 
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
      console.log('Joining game: ' + id)
      this.$socket.emit('joinGame', this.heroId, id)
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
  align-items: center;
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