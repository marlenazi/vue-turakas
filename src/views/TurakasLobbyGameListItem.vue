<template>
  <button class="game">
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
    game: Object
  },
  data() {
    return {
      title: 'Games'
    }
  },
  methods: {
    
  }
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