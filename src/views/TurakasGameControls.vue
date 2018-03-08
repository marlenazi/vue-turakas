<template>
<div class="gameControls">

<transition name="fade" mode="out-in">

  <button
    v-if="$_moves === 'hero' && addingRound"
    @click="$_finishAdding">
    <span>DONE</span>
  </button>

  <button
    v-else-if="$_moves === 'hero' && $_heroIx() === defending && board"
    @click="$_pickUp">
    <span>PICK<br>UP</span> 
  </button>

  <button
    v-else-if="$_moves === 'hero' && $_heroIx() === attacking && board"
    @click="$_muck">
    <span>DONE</span> 
  </button>

  <button
    v-else-if="pagunidPossible && $_moves ==='hero'"
    @click="$_doPagunid">
    <span>RANK 'EM!</span> 
  </button>

  <button
    disabled
    class="your-turn"
    v-else-if="$_moves === 'hero'">
    <span>YOUR TURN</span> 
  </button>

  <button
    disabled
    class="other-turn"
    v-else>
    <span>WAIT</span> 
  </button>

</transition>

</div>
</template>

<script>

export default {
  name: 'GameControlButton',
  props: {
    hero: Object,
    gameId: String,
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

      this.$socket.emit('pickUp', this.hero.id)
      this.$socket.emit("sendChat", {
        sender: this.hero.name,
        senderId: this.hero.id,
        gameId: this.gameId,
        body: 'I pick up. Got more?'
      });
    },
    $_finishAdding() {
      console.log('Finished adding')
      this.$socket.emit('finishAdding', this.hero.id)
    },
    $_muck() {
      console.log('Mucking')
      this.$socket.emit('muck', this.hero.id)
      this.$socket.emit("sendChat", {
        sender: this.hero.name,
        senderId: this.hero.id,
        gameId: this.gameId,
        body: "Your turn"
      });
    },
    $_doPagunid() {
      this.$socket.emit('move', this.hero.id, 'pagunid')
    },
    $_heroIx() {
      return this.players.findIndex(player => player.id === this.hero.id)
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
  text-align: center;
}
button span {
  font-size: 15px;
  font-weight: bold;
  // font-variant: ;
}
.your-turn {
  background: green;
  opacity: .8;
}
.other-turn {
  background: red;
  opacity: .8;
}
</style>
