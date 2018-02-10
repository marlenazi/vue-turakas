<template>
  <div class="gameHand">
    
    <transition-group name="fade" mode="out-in">
      <game-card
        v-for="card in hand"
        :key="card.rank + card.suit"
        :card="card">
      </game-card>
    </transition-group>

  </div>
</template>

<script>
import GameCard from './TurakasGameCard'
export default {
  name: 'GameHand',
  props: {
    hand: Array
  },
  components: {
    GameCard
  },
  data() {
    return {
      
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameHand {
  flex: 1 0 auto;
  border-radius: .5rem;
  border: .2rem solid $accent;
  background: $action;
}
</style>