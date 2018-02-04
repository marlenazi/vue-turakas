<template>
  <div class="game">
    <button @click="leaveGame"> X </button>
    <h1>{{msg}} : </h1>
      {{game.id}} <br>
      {{ hero.name }} <br>
      Players registered: {{ game.users }} <br>
      {{game.state}}

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
    leaveGame() {
      console.log('Leaving game')
      console.log(this.game)
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
