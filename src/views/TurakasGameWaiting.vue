<template>
  <div class="turakasGameWaiting">

    <leave-button :heroId="hero.id"></leave-button>
    
    <div class="status-message">
      <div class="status">
        <b>Status:</b> {{ game.status }}
      </div>

      <div class="message">
        {{ msg }}
      </div>
      <ul>
        <li v-for="rule in rules"> {{ rule }} </li>
      </ul>
    </div>

    <!-- {{ game }} -->
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
      msg: "You are waiting for your opponent.",
      rules: [
        'Aim of the game is to get rid of all your cards.',
        'When the game begins, each player gets dealt six cards and a trump suit is chosen.',
        'Players take the role of the attacker or the defender',
        'Attacker moves first with a card of their choosing.',
        'Defender must with a card of higher rank of the same suit, or a trump card.',
        'Attacker can then add more cards, as long as the rank matches any card that is already on the board.',
        'If countering is not possible, defender must pick up all the cards on the board.',
      ],
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakasGameWaiting {
  flex: 1 1 auto;
  border-radius: .5rem;
  display: flex;
  flex-flow: column nowrap;
}
.status-message {
  margin: 2em 0em 2em 1em;
  flex: 1 1 auto;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
.message {
  // width: 18rem;
  padding: 2em 1em;
  margin-right: auto;
}
</style>