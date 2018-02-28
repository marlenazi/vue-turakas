<template>
  <div class="gameBoard">
    
    <transition-group name="fade" mode="out-in" class="boardCards" tag="div">
      <game-card
        id="boardCard"
        v-for="card in board"
        :key="card.rank + card.suit"
        :rank="card.rank"
        :suit="card.suit"
        :bigRank="card.rank">
      </game-card>
      <game-card
        id="addedCard"
        v-for="card in added"
        :key="card.rank + card.suit"
        :rank="card.rank"
        :suit="card.suit"
        :bigRank="card.rank">
      </game-card>
    </transition-group>
    <!-- <transition-group name="fade" mode="out-in" class="addedCards" tag="div">
      <game-card
        id="addedCard"
        v-for="card in added"
        :key="card.rank + card.suit"
        :rank="card.rank"
        :suit="card.suit"
        :bigRank="card.rank">
      </game-card>
    </transition-group> -->
  </div>
</template>

<script>
import GameCard from './TurakasGameCard'
export default {
  name: 'GameBoard',
  props: {
    board: Array,
    added: Array,
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
  flex: 1 0 100%;

  // border: 1px solid $accent;
  padding: 0em 1em;

  text-align: center;
  min-width: 280px;
  min-height: 13.5rem;
  max-height: 13.5rem;
  
  background: url(../assets/theFoolWatermark.svg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
#addedCard {
  // border: 2px solid orangered;
  position: relative;
  top: -.8rem;
  margin: 1em .5em .5em .5em;
  margin-left: -2.8em;
  font-size: 15px;
}

#boardCard {
  margin-top: 1em;
  font-size: 15px;
}
#boardCard, #addedCard {
  z-index: 1;
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