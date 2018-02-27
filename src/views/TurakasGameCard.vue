<template>
  <div
    class="turakasGameCard height-1"
    :class="cardSuit[suit]"
  >
      <div class="smallRankSuit">
        {{ cardRank[rank] }}
        <span
          class="smallSuit"
          v-html="symbol[suit]"
        >
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

  padding: .3em;
  height: 6em;
  width: 4em;
  border-radius: .2em;
  color: $action;
  text-align: center;
  font-size: 16px;
  
  user-select: none;
  cursor: pointer;
  transition: all .2s ease-in-out;
  transform-origin: 50% bottom;

  z-index: 5;
}

.smallRankSuit {
  position: absolute;
  text-align: center;
}
.smallSuit {
  display: block;
}
.bigRank {
  margin: .75em auto;
  font-size: 2.2em;
  // align letters closer to each other, mainly for the 10 to fit
  letter-spacing: -.15em;
  text-indent: -.15em;
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
</style>