<template>
  <div
    class="gameBoard">
    
  </div>
</template>

<script>

export default {
  name: 'GameBoard',
  props: {
    board: Array
  },
  components: {

  },
  data() {
    return {
      
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameBoard {
  flex: 1 0 auto;
  border-radius: .5rem;
  background: $action;
}
</style>