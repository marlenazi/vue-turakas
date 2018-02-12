<template>
  <div class="gameBoard">
    
    <transition-group name="fade" mode="out-in">
      <game-card
        id="boardCard"
        v-for="card in board"
        :key="card.rank + card.suit"
        :rank="card.rank"
        :suit="card.suit"
        :bigRank="card.rank">
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
  // border: 1px solid $accent;
  padding: 1rem;
  // background: $action;
  display: flex;
  justify-content: center;
  min-width: 280px;
}

#boardCard {
  margin-top: 2rem;
  height: 4.2em;
  width: 3em;
}
#boardCard:nth-child(even) {
  position: relative;
  top: .5rem;
  margin-left: -.8rem;
}

// @media screen and (max-width: 340px){
//   #boardCard {
//     margin-top: 2rem;
//     height: 4.2rem;
//     width: 3rem;
//   }
//   #boardCard:nth-child(even) {
//     position: relative;
//     top: .5rem;
//     margin-left: -1rem;
//   }
// }
</style>