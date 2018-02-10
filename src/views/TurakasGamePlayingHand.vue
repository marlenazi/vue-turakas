<template>
  <div class="gameHand">
    
    <transition-group class="cards" name="fade" mode="out-in">
      <game-card
        tabindex="1"
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
  flex: 0 0 auto;
  border-radius: .5rem;
  border: .2rem solid $accent;
  background: $action;


}
.cards {

  padding: .5rem;
  flex: 1 1 auto;
  display: block;
  text-align: center;
  white-space: nowrap;
  overflow-x: auto;
}
</style>