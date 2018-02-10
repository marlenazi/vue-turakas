<template>
  <div
    class="turakasGameCard height-1"
    v-bind:class="cardSuit[card.suit]">
    {{ card.rank }}{{ card.suit }}
  </div>
</template>

<script>

export default {
  name: 'TurakasGameCard',
  props: {
    card: Object
  },
  data() {
    return {
      msg: "Looks like this is over",
      cardSuit: {
        h: 'hearts',
        d: 'diamonds',
        c: 'clubs',
        s: 'spades',
        b: 'back'
      }
    }
  },
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakasGameCard {
  flex: 0 0 auto;
  display: inline-block;
  margin: .2rem;
  padding: .3rem;
  height: 6rem;
  width: 4.5rem;
  border-radius: .3rem;
  color: $action;
  text-align: left;
  font-size: 1.5rem;
  user-select: none;
  cursor: pointer;
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
  background: rgb(219, 197, 0);
}

</style>