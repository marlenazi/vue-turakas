<template>
  <div
    class="gameInfo">
    Deck: {{ deck }}<br>
    Trump: {{ trump.rank }}{{ trump.suit }}<br>
    {{ moves }}
  </div>
</template>

<script>

export default {
  name: 'GameInfo',
  props: {
    heroId: String,
    deck: Number,
    players: Array,
    trump: Object,
    active: Number
  },
  components: {

  },
  data() {
    return {
      
    }
  },
  computed: {
    moves() {
      return this.active === this.players.find(player => 
        player.id === this.heroId).ix ? 'You' : 'Not You'


    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameInfo {
  flex: 1 0 auto;
  border-radius: .5rem;
  background: $action;
}
</style>