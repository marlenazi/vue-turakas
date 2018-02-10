<template>
  <div class="gameBoard">
    
    <transition-group name="fade" mode="out-in">
      <game-card
        id="boardCard"
        v-for="card in board"
        :key="card.rank + card.suit"
        :card="card">
      </game-card>
    </transition-group>

  </div>
</template>

<script>
import GameCard from './TurakasGameCard'
export default {
  name: 'GameBoard',
  props: {
    board: Array
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

.gameBoard {
  flex: 1 0 auto;
  border-radius: .5rem;
  border: .2rem solid $accent;
  background: $action;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  min-width: 280px;
}

#boardCard {
  height: 4rem;
  width: 3rem;
}
#boardCard:nth-child(even) {
  position: relative;
  top: .4rem;
  margin-left: -1rem;
}
</style>