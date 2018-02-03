<template>
  <div class="lobby">
      {{ hero.name }}
      <button @click="newGame">New Game</button>
  </div>
</template>

<script>
export default {
  name: 'Lobby',
  props: ['hero'],
  data () {
    return {
      msg: 'Lobby'
    }
  },
  methods: {
    newGame() {
      this.$socket.emit('newGame', this.hero.id)
    }
  }
}
</script>

<style>
.lobby {
  background: greenyellow;
  height: 25rem;
  width: 16rem;
}
</style>
