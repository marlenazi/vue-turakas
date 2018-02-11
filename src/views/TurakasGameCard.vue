<template>
  <div
    class="turakasGameCard height-1"
    :class="cardSuit[suit]">
      <div class="rank">
        {{ cardRank[rank] }}
        <span 
          class="smallSuit"
          v-html="symbol[suit]">
        </span> 
      </div>
      <div class="bigRank">
        {{ cardRank[bigRank]}}
      </div>
  </div>
</template>

<script>

export default {
  name: 'TurakasGameCard',
  props: {
    rank: String,
    suit: String,
    bigRank: String,
  },
  data() {
    return {
      msg: "Looks like this is over",
      cardSuit: {
        h: 'hearts',
        d: 'diamonds',
        c: 'clubs',
        s: 'spades',
    blank: 'back',
      },
      symbol: {
        's': '&spades;',
        'c': '&clubs;' ,
        'h': '&hearts;',
        'd': '&diams;' ,
    'blank': '',// turakas logo siia???
      },
      cardRank: {
        '1': '6',
        '2': '7',
        '3': '8',
        '4': '9',
        '5': '10',
        '6': 'J',
        '7': 'Q',
        '8': 'K',
        '9': 'A',
    'blank': '',
      }
    }
  },
  computed: {

  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakasGameCard {

  display: inline-block;

  padding: .4em;
  height: 6em;
  width: 4.2em;
  border-radius: .2em;
  color: $action;
  text-align: left;
  font-size: 1.5em;
  
  user-select: none;
  cursor: pointer;
  transition: all .2s ease-in-out;
}
.spades {
  background: rgb(51, 51, 51);
}
.clubs {
  background: rgb(39, 165, 1);
}
.hearts {
  background: rgb(197, 0, 0);
}
.diamonds {
  background: rgb(53, 31, 255);
}
.back {
  background: $cardBack;
}

.rank {

}
.smallSuit {

}
.bigRank {

  font-size: 3em;
  text-align: center;
}

</style>