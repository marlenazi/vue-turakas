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
      let middle = cards / 2 + .25
      let pos = middle - cardIx
      // let angle = 170 / cards
      let              [scale, margin, step, angle] =
          cards < 6  ? [  .6,   0.00,   5,     0  ] :
          cards < 8  ? [  .8,   2.80,   2,    10  ] : 
          cards < 10 ? [  .7,   1.90,   5,    18  ] : 
          cards < 12 ? [  .8,   1.95,   5,    15  ] : 
                       [  .5,   2.00,   5,     6  ]

      return {
        card: {
          position: 'relative',
          // bottom: `-${ Math.abs(pos) / step }em`,
          transform: `scale(${scale}) rotate(${ pos * - angle }deg)`,
          margin: `0 -${margin}em 0 0`
        },
        hand: {
          paddingLeft: `${ this.$_handPadding }em`,
        }
      }
    },
  },
  computed: {
    $_handPadding() {
      let cards = this.hand.length
      return cards < 8 ? 0 : 5.5
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameHand {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  border: 1px solid blue;
  // position: relative;
  // margin-bottom: 3em;
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