<template>
  <div
    class="turakasGameCard height-1"
    :class="cardSuit[suit]"
    :style="$_style"
    @mouseenter="scale = 1.1"
    @mouseleave="scale = 1.0 "
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
        <!-- {{ validMove }} -->
      </div>

    <div
      v-if="styleProps !== undefined"
      class="shadow"
      :class="{glow: validMove}">
    </div>
  </div>
</template>

<script>

export default {
  name: 'TurakasGameCard',
  props: {
    type: String,
    rank: String,
    suit: String,
    bigRank: String,
    styleProps: Object,
    validMove: Boolean,
  },
  data() {
    return {

      scale: 1,
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
    $_style() {
      if (!this.styleProps) return {}
      
      const st = this.styleProps
      return {
        position: 'absolute',
        bottom: st.x + 'em',
        right: st.y + 'em',
        transform: `rotate(${st.angle}deg) scale(${this.scale})`,
      }
    }
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
  // fix blurriness on scale
  backface-visibility: hidden;

  z-index: 5;
}
.turakasGameCard:hover {
  z-index: 6;
}

.shadow {
  position: absolute;
  top: 0;
  left: 0;
  // border: 1px solid blue;
  border-radius: .2rem;
  height: 100%;
  width: 100%;
  z-index: 19;
}
.shadow.glow {
  box-shadow: 0px 0px 15px 5px rgb(89, 255, 47),
              0px 0px 5px 3px rgb(89, 255, 47);
  animation: glow .8s alternate-reverse infinite;
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


@keyframes glow {
  from {
    opacity: .5;
  }
  to {
    opacity: 1;
  }
}
</style>