<template>
  <div
    class="turakasGameWaiting">

    <leave-button :heroId="hero.id"></leave-button>
  
    <b>Game Status:</b> {{ game.status }}

    <div class="message">
      {{ msg }}  
    </div>

    {{ game }}
  </div>
</template>

<script>
import LeaveButton from './TurakasGameLeaveButton'
export default {
  name: 'TurakasGameWaiting',
  props: {
    hero: Object,
    game: Object
  },
  components: {
    LeaveButton
  },
  data() {
    return {
      msg: "Wouldn't it be nice if one could play tic-tac-toe whilst waiting?"
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakasGameWaiting {
  flex: 1 0 auto;
  border-radius: .5rem;
}

.message {
  padding: 2rem;
}
</style>