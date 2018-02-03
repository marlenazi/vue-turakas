<template>
  <div class="game">
      {{ hero.name }}
      {{ game }}
      <button @click="endGame">End Game</button>
  </div>
</template>

<script>
export default {
  name: 'Game',
  props: ['hero', 'game'],
  data () {
    return {
      msg: 'Game'
    }
  },
  methods: {
    endGame() {
      
      // this.$socket.emit('endgame', this.game.id)
    }
  }
}
</script>

<style>
.game {
  background: greenyellow;
  height: 25rem;
  width: 16rem;
}
</style>
