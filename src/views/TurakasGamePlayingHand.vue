<template>
  <div class="gameHand">

    <transition-group class="cards" name="fade" mode="out-in" >
      <game-card
        id="handCard"
        tabindex="1"
        v-for="card in hand"
        v-bind:class="{ active: active }"
        :key="card.rank + card.suit"
        :rank="card.rank"
        :suit="card.suit"
        :bigRank="card.rank"
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
    move(card) {
      console.log(card)

      this.$socket.emit('move', card)
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
  padding: 1rem;
  flex: 1 1 auto;
  display: block;
  text-align: center;
  white-space: nowrap;
  overflow-x: auto;
  z-index: 10;
}

#handCard:hover {
  transform: scale(1.2);

}
.active {
  box-shadow: 0px 0px 8px 3px $shadow;
        // inset 0px 0px 1px 1px $shadow;
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