<template>
  <div class="gameHand">
    
    <transition-group class="cards" name="fade" mode="out-in" >
      <game-card
        id="handCard"
        tabindex="1"
        v-for="card in hand"
        :key="card.rank + card.suit"
        :card="card"
        @click.native="move(card)"
        >
      </game-card>
    </transition-group>
  </div>
</template>

<script>
import GameCard from './TurakasGameCard'
export default {
  name: 'GameHand',
  props: {
    hand: Array
  },
  components: {
    GameCard
  },
  methods: {
    $_hasScrollBar() {
      console.log('==============================')
      console.log(this)
      console.log(this.$el.offsetWidth)
      console.log(this.$el.scrollWidth)
      console.log(this.$el.clientWidth)
      console.log(this.hand.length * 48)
      console.log('==============================')
    },
    move(card) {
      console.log(card)
      // we used to emit game id aswell,
      // but it should work well enough even without
      this.$socket.emit('move', card)
      this.$_hasScrollBar()
    },
  },
  computed: {
    
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameHand {
  flex: 0 0 auto;
}
.cards {
  padding: .5rem;
  flex: 1 1 auto;
  display: block;
  text-align: center;
  white-space: nowrap;
  overflow-x: auto;
  z-index: 10;
}
#handCard:first-child {
  margin-left: .2rem;
}
#handCard {
  margin-left: -.3rem;
}

</style>