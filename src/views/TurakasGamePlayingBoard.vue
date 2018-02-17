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

  // border: 1px solid $accent;
  padding: 0em 1em;

  text-align: center;
  min-width: 280px;
  background: url(../assets/theFoolWatermark.svg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

#boardCard {
  margin-top: 1.2em;
  font-size: 15px;
}
#boardCard:nth-child(odd) {
  margin-left: .35em;
}
#boardCard:nth-child(even) {
  position: relative;
  top: .5rem;
  margin-left: -2.5em;
}


</style>