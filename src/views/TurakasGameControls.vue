<template>
<div class="gameControls">

  <div class="moves">
    {{ $_moves }}
  </div>
<transition name="fade" mode="out-in">
  <button
    v-if="$_moves === 'you' && $_heroIx() === defending && board"
    @click="$_pickUp">
    Pick Up
  </button>
  <button
    v-else-if="$_moves === 'you' && $_heroIx() === attacking && board"
    @click="$_muck">
    Finished
  </button>
  <button
    disabled
    v-else>
  </button>
</transition>
  <div class="spacer" ></div>
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
      console.log('======= Moves this =======')
      return this.active === this.$_heroIx() ? 'you' : 'other'
    },
  }
}
</script>

<style lang="scss" scoped>
@import './../style/variables';

.gameControls {
  margin-top: -3rem;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}

button {
  height: 3rem;
  width: 4.5rem;
  color: $action;
  font-size: 1rem;
  border-radius: .5rem;
  
}
.moves, .spacer {
  // border: 1px solid white;
  width: 3.5rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
