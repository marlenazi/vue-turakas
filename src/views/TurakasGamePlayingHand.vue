<template>
  <div class="gameHand">

    <transition-group class="cards" name="fade" mode="out-in" >
      <game-card
        id="handCard"
        tabindex="1"
        v-for="card in hand"
        v-bind:class="{ active: active }"
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
    hand: Array,
    active: Boolean,
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

#handCard:hover {
  transform: scale(1.2);
  box-shadow: 0px 0px 5px 5px $shadow,
        inset 0px 0px 3px 1px $shadow;
}
.active {
  box-shadow: 0px 0px 3px 3px $shadow;
}
@media screen and (max-width: 340px){
  #handCard {
    margin-left: -.3rem;
  }
  #handCard:first-child {
    margin-left: .2rem;
  }
}


</style>