<template>
  <div
    class="turakasGameFinished">

    <leave-button :heroId="hero.id"></leave-button>
  
    <b>Game Status:</b> {{ game.status }}

    <div class="message">
      {{ msg }}  
    </div>

    Viiner: {{ game.winner }}<br>
    Luuser: {{ game.loser }}
  </div>
</template>

<script>
import LeaveButton from './TurakasGameLeaveButton'
export default {
  name: 'TurakasGameFinished',
  props: {
    hero: Object,
    game: Object
  },
  components: {
    LeaveButton
  },
  data() {
    return {
      msg: "Looks like this is over"
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakasGameFinished {
  flex: 1 0 auto;
  border-radius: .5rem;
}

.message {
  padding: 2rem;
}
</style>