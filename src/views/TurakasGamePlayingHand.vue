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
        v-on:mouseenter="$_style(card, 1.2).card"
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
    $_style(card, scale = 1) {
      let cards = this.hand.length
      let cardIx = this.hand.findIndex(el => el === card)
      let middle = cards / 2 - .5
      let pos = middle - cardIx
      let ang = 185 / cards
      
      let rad = ang * pos * Math.PI / 180
      let x = (2.5 * Math.cos(rad))
      let y = (2.5 * Math.sin(rad))
      // console.log(x, y, rad)
      // console.log('scale: ' + scale)
      return {
        card: {
          position: 'relative',
          bottom: x + 'em',
          right: y + 'em',
          transform: `rotate(${ pos * -ang }deg) scale(${scale})`,
          margin: `0 -4em 0 0`
        },
        hand: {
          paddingRight: `4em`
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
  // border: 1px solid $accent;

  position: relative;
  height: 12em;
  padding: 3.5em 0;
  overflow: hidden;
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
}


#playingCard {


}
#playingCard:hover {
  z-index: 1;
  // box-shadow: 0px 0px 10px 4px $action;
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
    box-shadow: 0px 0px 10px 2px $shadow;
  }
}


.border {
  border: 2px solid orangered;
}


</style>