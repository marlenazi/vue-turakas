<template>
<div class="gameControls">
<transition name="fade" mode="out-in">
  <div class="moves" v-if="$_moves === 'hero'">
    Your Move
  </div>
</transition>
<transition name="fade" mode="out-in">
  <button
    v-if="$_moves === 'hero' && $_heroIx() === defending && board"
    @click="$_pickUp">
    Pick Up
  </button>
  <button
    v-else-if="$_moves === 'hero' && $_heroIx() === attacking && board"
    @click="$_muck">
    Finished
  </button>
  <button
    disabled
    v-else>
  </button>
</transition>
  <!-- <div class="spacer" ></div> -->
</div>
</template>

<script>
export default {
  name: 'GameControls',
  props: {
    heroId: String,
    active: Number,
    players: Array,
    board: Number,
    attacking: Number,
    defending: Number,
  },
  data() {
    return {

    }
  },
  methods: {
    $_pickUp() {
      console.log('Picking up')
      this.$socket.emit('pickUp', this.heroId)
    },
    $_muck() {
      console.log('Mucking')
      this.$socket.emit('muck', this.heroId)
    },
    $_heroIx() {
      return this.players.find(player => player.id === this.heroId).ix
    }
  },
  computed: {
    $_moves() {
      return this.active === this.$_heroIx() ? 'hero' : 'villain'
    },
  }
}
</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameControls {
  position: relative;
  top: -1rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: center;
}

button {
  height: 3rem;
  width: 5rem;
  color: $action;
  font-size: 1rem;
  border-radius: .5rem;
  text-align: center;
  
}
.moves {
  margin: .1rem;
  color: $action;
  // border-bottom: 1px solid $accent;
}

</style>
