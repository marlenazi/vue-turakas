<template>
  <div class="gameHand"
    :style="$_style().hand">

      <game-card
        id="playingCard"
        tabindex="1"
        v-for="card in player.hand"
        :class="[{ active: active }, {validMove: $_filterValid(card) && active}]"
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
    player: Object,
    game: Object,
    active: Boolean,
  },
  components: {
    GameCard
  },
  methods: {
    $_move(card) {
      console.log(card)
      console.log(this.player.id)
      this.$socket.emit('move', this.player.id, card)
    },
    $_filterValid(card) {

      const { attackerCard, board, trump } = this.game

      function isValid(card) {

        if (attackerCard) {

          if (
            card.value > attackerCard.value &&
            (card.suit === attackerCard.suit || card.suit === trump.suit)
          ) {
            return true;
          } else return false;
          // if there is no attacker, card (new attacker) can go on the board
        } else if (board.length && board.length < 12) {
          if (board.some(el => el.rank === card.rank)) {
            return true;
          } else return false;
        } else if (board.length < 12) return true;
        else return false;
      }

      return isValid(card);
    },
    $_style(card, scale = 1) {
      console.log(this.player)
      console.log(this.player.hand.length)
      let cards = this.player.hand.length
      let cardIx = this.player.hand.findIndex(el => el === card)
      let middle = cards / 2 - .5
      let pos = middle - cardIx
      let ang = 185 / cards
      
      let rad = ang * pos * Math.PI / 180
      let x = (2.8 * Math.cos(rad))
      let y = (2.6 * Math.sin(rad))
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
  z-index: 7;
  // box-shadow: 0px 0px 10px 4px $action;
}

.active {
  box-shadow: 0px 0px 8px 3px $shadow;
        // inset 0px 0px 1px 1px $shadow;

}
.validMove {
  z-index: 6;
  animation-name: your-move;
  animation-duration: .6s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}


.border {
  border: 2px solid orangered;
}


</style>