<template>
  <div class="gameBoard">

    <transition-group name="fade" mode="out-in" class="boardCards" tag="div">
      <game-card
        id="boardCard"
        v-for="card in board"
        :type="'card'"
        :key="card.rank + card.suit"
        :rank="card.rank"
        :suit="card.suit"
        :bigRank="card.rank">
      </game-card>
      <game-card
        id="addedCard"
        class="addedCard"
        v-for="card in added"
        :key="card.rank + card.suit"
        :type="'addedCard'"
        :rank="card.rank"
        :suit="card.suit"
        :bigRank="card.rank">
      </game-card>

    </transition-group>
    <!-- <div class="slots">
      <div
        class="cardSlot"
        
        v-for="card in $_addedSlots"
        :key="card"
        :type="'slot'"
        :rank="'blank'"
        :suit="'blank'"
        :bigRank="'blank'"
      >
      </div>
    </div> -->

  <!-- {{ $_addedSlots }}
  {{ board.length }}
  {{ added.length }} -->
  </div>
</template>

<script>
import GameCard from './TurakasGameCard'
import CardSlot from './CardSlot'

export default {
  name: 'GameBoard',
  props: {
    board: Array,
    added: Array,
    addingRound: Boolean,
  },
  components: {
    GameCard, CardSlot
  },
  data() {
    return {
    }
  },
  // computed: {
  //   $_addedSlots() {
  //     const onBoard = 
  //       this.board.length % 2 === 0 
  //         ? this.board.length 
  //         : this.board.length + 1
  //     const onAdded = this.added.length 


  //     return 6 //- (onBoard) / 2 - onAdded || 6
  //   }
  // }
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
  padding: 0em 0em;

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
  margin-top: .6em;
  font-size: 16px;
}
#boardCard, #addedCard {
  z-index: 1;
}

#boardCard:nth-child(odd) {
  margin-left: .5em;
}
#boardCard:nth-child(even) {
  position: relative;
  top: .5rem;
  margin-left: -2.5em;
}
#boardCard:first-child {
  margin-left: 0em;
}

#boardCard:nth-child(odd):last-of-type {
  // border: 2px solid lightgreen;
  margin-left: 0.75em;
  margin-right: .75em;
}

.addedCard {
  // border: 2px solid orangered;
  position: relative;
  // top: -.8rem;
  margin: .6em 0.75em 0em .75em;
  // margin-left: -2.8em;
  font-size: 16px;
}
// .slots {
//   position: absolute;

// }
// .cardSlot {
//   // border: 2px solid orangered;
//   position: relative;
//   top: 0rem;
//   margin: .6em 0.75em 0em .75em;
//   font-size: 16px;
//   background: none;
// }
// .cardSlot {
//   // position: absolute;
//   // border: 2px solid black;
//   opacity: .5;
//   display: inline-block;
//   height: 6em;
//   width: 4em;
//   border-radius: .2em;
//   color: $action;
//   opacity: .5;
//   box-shadow: 0 0 .5rem .1rem rgba(100, 100, 100, .5);
  
//   user-select: none;
//   cursor: pointer;
//   transition: all .1s ease-in-out;

//   z-index: 5;
// }

// .addedCard:first-of-type {
//   margin-left: .75em;
//   // border: 2px solid coral;
// }
// .cardSlot:nth-of-type(2) {
//   margin-left: .75em;
//   // border: 2px solid yellow;
// }
// .visible {
//   opacity: 1;
// }
</style>