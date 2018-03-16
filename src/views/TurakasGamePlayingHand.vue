<template>
  <div class="gameHand">

      <game-card
        id="playingCard"
        tabindex="1"

        v-for="card in $_hand"

        :key="card.rank + card.suit"
        :rank="card.rank"
        :suit="card.suit"
        :bigRank="card.rank"
        :styleProps="card.styleProps"
        :validMove="active && $_filterValid(card) ? true : false"

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
      // console.log(card)
      // console.log(this.player.id)
      this.$socket.emit('move', this.player.id, card)
    },
    $_filterValid(card) {

      const { attackerCard, board, added, trump } = this.game

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
      function isValidAdd(card) {
        // console.log('Valid add ----------------------');
        
        if ( board.some(boardCard => boardCard.rank === card.rank) 
        &&  (board.length - 1) / 2 + 1 + added.length < 6 ) {
          return true
        }
      }

      return this.game.addingRound ? isValidAdd(card) : isValid(card)
    },
    $_style(card, scale = 1) {

      const cards = this.player.hand.length
      const cardIx = this.player.hand.findIndex(el => el === card)
      const middle = cards / 2 - .5
      const pos = middle - cardIx
      const ang = 185 / cards
      
      const rad = ang * pos * Math.PI / 180
      const x = (2.5 * Math.cos(rad) + 2.7 )
      const y = (2.5 * Math.sin(rad) + 7.5 )

      return {
        x,
        y,
        scale: 1,
        angle: pos * -ang,
      }
    },
  },
  computed: {
    $_hand() {
      return this.player.hand.map(card => {

        card.styleProps = this.$_style(card)
        return card
      })
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameHand {
  // border: 1px solid $accent;

  position: relative;
  height: 12em;
  overflow: visible;
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
}


.validMove {
  animation-name: your-move;
  animation-duration: .6s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}


.border {
  border: 2px solid orangered;
}


</style>