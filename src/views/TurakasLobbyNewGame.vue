<template>
  <button 
    class="newGameButton" 
    tabindex="1"
    @click="newGame"
  >
    {{ title }}
  </button>
</template>

<script>

export default {
  name: 'NewGame',
  props: {
    heroId: String
  },
  data() {
    return {
      title: 'New Game'
    }
  },
  methods: {
    newGame() {
      console.log('Starting a new game')
      this.$socket.emit('newGame', this.heroId)
    },
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.newGameButton {
  flex: 0 0 auto;
  margin: .5rem;
  border-radius: 50%;
  height: 5rem;
  width: 5rem;
  font-size: 1.2rem;
  color: $action;
}
</style>
