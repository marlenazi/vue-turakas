<template>

  <button 
    class="leaveGameButton"
    v-html="title"
    @click="$_leaveGame">
  </button>

</template>

<script>
export default {
  name: 'TurakasGameLeaveButton',
  props: {
    heroId: String
  },
  data() {
    return {
      title: '&times;'
    }
  },
  methods: {
    $_leaveGame() {
      console.log('Leaving game')
      this.$socket.emit('leaveGame', this.heroId)
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.leaveGameButton {
  border-radius: 50%;
  margin: 1rem;
  height: 3.5rem; 
  width: 3.5rem;
  font-size: 2.75rem;
  color: $action;
}
</style>