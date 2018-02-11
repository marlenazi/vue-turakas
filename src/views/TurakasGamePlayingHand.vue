<template>
  <div class="gameHand">
    <!-- <transition-group class="cards" name="fade" mode="out-in" > -->

      <game-card
        id="playingCard"
        tabindex="1"
        v-for="card in hand"
        :class="{ active: active }"
        :style="$_spread(card)"
        :key="card.rank + card.suit"
        :rank="card.rank"
        :suit="card.suit"
        :bigRank="card.rank"
        @click.native="$_move(card)"
        >
      </game-card>

    <!-- </transition-group> -->
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
    $_spread(card) {
      let cards = this.hand.length
      let cardIx = this.hand.findIndex(el => el === card)
      let middle = cards / 2 - .25
      let pos = middle - cardIx
      let       [scale, margin, step, angle] = 
          cards < 8  ? [ 1, 1.30, 5, 8] : 
          cards < 12 ? [.8, 1.45, 5, 7] : 
                       [.5, 1.65, 5, 6]

      return {
        position: 'relative',
        top: `${ Math.abs(pos) / step }em`,
        transform: `scale(${scale}) rotate(${ pos * - angle }deg)`,
        margin: `0 -${margin}em`
      }
    },
  },

  computed: {
    $_handSize() {
      let cards = this.hand.length
      return cards < 8 ? 'size-1' : 'size-2'
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameHand {
  // border:1px solid blue;
  margin-bottom: 3em;
  text-align: center;
  white-space: nowrap;
}
// padding is needed so that the scale on hover would be visible
.cards {
  display: block;
  // height: 12rem;
  // position: relative;
  text-align: center;
  
  // overflow-x: auto;
}
#playingCard {
  // position: absolute;
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