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

      <game-card
        id="cardSlot"
        v-show="addingRound"
        v-for="card in $_addedSlots"
        :key="card"
        :type="'slot'"
        :rank="'blank'"
        :suit="'blank'"
        :bigRank="'blank'"
      >
      </game-card>
  <!-- {{ $_addedSlots }}
  {{ board.length }}
  {{ added.length }} -->
  </div>
</template>

<script>
import GameCard from './TurakasGameCard'

export default {
  name: 'GameBoard',
  props: {
    board: Array,
    added: Array,
    addingRound: Boolean,
  },
  components: {
    GameCard,
  },
  data() {
    return {
    }
  },
  computed: {
    $_addedSlots() {
      const onBoard = 
      this.board.length % 2 === 0 
        ? this.board.length 
        : this.board.length + 1
      const onAdded = this.added.length 
      // console.log(this.board.length)
      // console.log(this.added.length)

      return 6 - (onBoard) / 2 - onAdded || 6
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameBoard {
  position: relative;
  flex: 1 0 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  // align-items: flex-start;
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
.boardCards {
  // width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
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

#addedCard {
  // border: 2px solid orangered;
  position: relative;
  // top: -.8rem;
  margin: 1em .5em .5em .5em;
  // margin-left: -2.8em;
  font-size: 15px;
}

#cardSlot {
  border: 2px solid orangered;
  position: relative;
  top: 0rem;
  margin: 1em 0.1em 0em 1.1em;
  font-size: 15px;
  background: none;
}

// #cardSlot:first-child {
//   // margin-left: 2.1rem;
// }

</style>