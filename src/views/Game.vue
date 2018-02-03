<template>
  <div class="game">
    <h1>{{msg}}</h1>
      {{ hero.name }} <br>
      Players registered: {{ game.players }} <br>
      {{game.gameState}}

      <button @click="closeGame"> X </button>
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
    closeGame() {
      console.log('Closing game')
      this.$socket.emit('leaveGame', this.game.id, this.hero.id)
    }
  }
}
</script>

<style scoped>
.game {
  background: greenyellow;
  height: 25rem;
  width: 16rem;
}
h1 {
  margin: 0;
}
</style>
