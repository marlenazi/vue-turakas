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
        s: 'spades'
      }
    }
  },

}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakasGameCard {
  display: inline-block;
  border: 1px solid seagreen;
  margin: .2rem;
  height: 6rem;
  width: 4.5rem;
  border-radius: .2rem;
  color: $action;
}
.spades {
  background: rgb(51, 51, 51);
}
.clubs {
  background: rgb(39, 165, 1);
}
.hearts {
  background: rgb(177, 0, 0);
}
.diamonds {
  background: rgb(53, 31, 255);
}

</style>