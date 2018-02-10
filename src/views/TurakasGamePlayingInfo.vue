<template>
  <div
    class="gameInfo">
    
  </div>
</template>

<script>

export default {
  name: 'GameInfo',
  props: {
    deck: Number,
    players: Array,
    trump: Object,
    active: Number
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

.gameInfo {
  flex: 1 0 auto;
  border-radius: .5rem;
  background: $action;
}
</style>