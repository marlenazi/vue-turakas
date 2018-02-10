<template>
  <div
    class="turakasGameCard">
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
      msg: "Looks like this is over"
    }
  },

}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakasGameCard {
  border: 1px solid seagreen;
  height: 3rem;
  width: 2.5rem;
  border-radius: .2rem;
}

</style>