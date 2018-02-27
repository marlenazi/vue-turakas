<template>
<div class="gameControls">

<transition name="fade" mode="out-in">
  <button
    v-if="$_moves === 'hero' && addingRound"
    @click="$_finishAdding">
    <span>That's all</span> 
  </button>
  <button
    v-else-if="$_moves === 'hero' && $_heroIx() === defending && board"
    @click="$_pickUp">
    <span>Pick Up</span> 
  </button>
  <button
    v-else-if="$_moves === 'hero' && $_heroIx() === attacking && board"
    @click="$_muck">
    <span>End Round</span> 
  </button>
  <button
    v-else-if="pagunidPossible && $_moves ==='hero'"
    @click="$_doPagunid">
    <span>Rank 'em!</span> 
  </button>
  <button
    disabled
    v-else>
  </button>
</transition>

</div>
</template>

<script>

export default {
  name: 'GameControlButton',
  props: {
    heroId: String,
    active: Number,
    players: Array,
    board: Number,
    attacking: Number,
    defending: Number,
    pagunidPossible: Boolean,
    addingRound: Boolean,
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
    $_finishAdding() {
      console.log('Finished adding')
      this.$socket.emit('finishAdding', this.heroId)
    },
    $_muck() {
      console.log('Mucking')
      this.$socket.emit('muck', this.heroId)
    },
    $_doPagunid() {
      this.$socket.emit('move', this.heroId, 'pagunid')
    },
    $_heroIx() {
      return this.players.findIndex(player => player.id === this.heroId)
    },
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
  position: absolute;
  bottom: .5em;
  left: calc(50% - 2.1em);
  z-index: 10;
  text-align: center;
  height: 4.2em;
  width: 4.2em;
}

button {
  height: 4.2em;
  width: 4.2em;
  color: $action;
  font-size: 16px;
  border-radius: 50%;
}

</style>
