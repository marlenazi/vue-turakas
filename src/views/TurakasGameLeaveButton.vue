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
  flex: 0 0 auto;
  border-radius: 50%;
  margin: .8rem;
  height: 3rem; 
  width: 3rem;
  font-size: 2.4rem;
  color: $action;
}
</style>