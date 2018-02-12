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
      let middle = cards / 2 - .25
      let pos = middle - cardIx

      let              [ scale , margin , step , angle , origin, rightPad, ] =
          cards < 6  ? [  .8   ,  1.80  ,   8  ,    8  ,   50  ,    2.3  , ] :
          cards < 8  ? [  .8   ,  2.20  ,   8  ,   10  ,   30  ,    2.3  , ] : 
          cards < 10 ? [  .8   ,  2.70  ,  20  ,   18  ,   25  ,    2.0  , ] : 
          cards < 12 ? [  .8   ,  2.80  ,   6  ,   19  ,   10  ,    0.0  , ] : 
                       [  .6   ,  3.00  ,  25  ,   18  ,    0  ,    2.3  , ]
      


      return {
        card: {
          position: 'relative',
          top: `${ Math.abs(pos) / step }em`,
          transform: `scale(${scale}) rotate(${ pos * - angle }deg)`,
          transformOrigin: `${ origin }% bottom`,
          margin: `0 -${margin}em 0 0`
        },
        hand: {
          // paddingLeft: `${ leftPad }em`,
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
  width: 100%;
  // border: 1px solid blue;
  // position: relative;
  padding-bottom: 2em;
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

}
.border {
  border: 2px solid orangered;
}


</style>