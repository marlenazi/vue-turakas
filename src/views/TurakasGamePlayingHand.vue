<template>
  <div class="gameHand"
    :style="$_style().hand">

      <game-card
        id="playingCard"
        tabindex="1"
        v-for="card in hand"
        :class="{ active: active }"
        :style="$_style(card).card"
        :key="card.rank + card.suit"
        :rank="card.rank"
        :suit="card.suit"
        :bigRank="card.rank"
        @click.native="$_move(card)"
        >
      </game-card>

  </div>
</template>

<script>
import GameCard from './TurakasGameCard'
export default {
  name: 'GameHand',
  props: {
    hand: Array,
    active: Boolean,
  },
  data() {
    return {

    }
  },
  components: {
    GameCard
  },
  methods: {
    $_move(card) {
      // console.log(card)
      this.$socket.emit('move', card)
    },
    $_style(card) {
      let cards = this.hand.length
      let cardIx = this.hand.findIndex(el => el === card)
      let middle = cards / 2 - .5
      let pos = middle - cardIx
      let ang = 190 / cards

      let              [ scale , margin , step , angle , origin, rightPad, ] =
          cards < 4  ? [   1   ,  0.20  ,   6  ,    5  ,   30  ,    0.8  , ] :
          cards < 5  ? [   1   ,  0.40  ,   4  ,    5  ,   30  ,    0.8  , ] :
          cards < 6  ? [   1   ,  0.80  ,   4  ,    5  ,   30  ,    0.8  , ] :
          cards < 7  ? [   1   ,  1.50  ,   2  ,    6  ,   30  ,    1.2  , ] :
          cards < 8  ? [   1   ,  1.95  ,   5  ,    5  ,   30  ,    1.9  , ] :
          cards < 9  ? [   1   ,  2.50  ,   5  ,    8  ,   50  ,    2.5  , ] :  
          cards < 10 ? [   1   ,  3.10  ,  18  ,   21  ,   50  ,    3.0  , ] :
          cards < 11 ? [   1   ,  3.20  ,  18  ,   20  ,   50  ,    3.0  , ] :
          cards < 12 ? [   1   ,  3.25  ,  18  ,   18  ,   50  ,    3.2  , ] : 
          cards < 13 ? [   1   ,  3.32  ,  18  ,   16  ,   50  ,    3.2  , ] :
          cards < 14 ? [   1   ,  3.40  ,  28  ,  ang  ,   50  ,    3.2  , ] :
          cards < 15 ? [   1   ,  3.40  ,  28  ,  ang  ,   50  ,    3.2  , ] :
          cards < 16 ? [   1   ,  3.50  ,  28  ,  ang  ,   50  ,    3.2  , ] :
          cards < 17 ? [   1   ,  3.53  ,  28  ,  ang  ,   50  ,    3.2  , ] :
          cards < 18 ? [   1   ,  3.57  ,  28  ,  ang  ,   50  ,    3.4  , ] : 
          cards < 26 ? [   1   ,  3.65  ,  28  ,  ang  ,   50  ,    3.4  , ] :
          cards < 30 ? [   1   ,  3.70  ,  48  , ang-.3,   50  ,    3.4  , ] : 
                       [   1   ,  3.80  ,  68  , ang-.3,   50  ,    3.4  , ]
      


      return {
        card: {
          position: 'relative',
          top: `${ Math.abs(pos) / step }em`,
          transform: `scale(${scale}) rotate(${ pos * - angle }deg)`,
          transformOrigin: `${ origin }% bottom`,
          margin: `0 -${margin}em 0 0`
        },
        hand: {
          paddingRight: `${rightPad}em`
        }
      }
    },
  },
  computed: {

  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameHand {

  height: 9em;
  // border: 1px solid blue;
  // position: relative;
  padding: .6em 0;
  overflow: hidden;

  text-align: center;
  white-space: nowrap;
}


#playingCard {


}
#playingCard:hover {

}

.active {
  box-shadow: 0px 0px 8px 3px $shadow;
        // inset 0px 0px 1px 1px $shadow;
  animation-name: your-move;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes your-move {
  from {
    box-shadow: 0px 0px 8px 3px $action;
  }
  to {
    box-shadow: 0px 0px 6px 1px orangered;
  }
}


.border {
  border: 2px solid orangered;
}


</style>