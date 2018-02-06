<template>
  <div class="game">
    <button @click="leaveGame"> X </button>
    <h1>{{msg}}: </h1>
      {{ game.id }} <br>
      Players: {{ game.players.length }}/{{ game.size }} <br>
      Hero: {{ hero.name }} Villain: {{ villain }} <br>
      <div class="info">
        <div class="status">
          Moves: {{ game.active + 1 }}<br>
          Defender: {{ game.defending + 1 }}<br>
          Attacker: {{ game.attacking + 1}}<br>
          Attacking Card: {{ game.attackerCard }}
        </div>
        <div class="card">
          {{ game.deck }}
        </div>
        <div class="card trump">
          {{ game.trump.rank }}{{ game.trump.suit }}
        </div>
      </div>
      <div class="board">

      </div>
      {{ game }}

  </div>
</template>

<script>
export default {
  name: 'Game',
  props: ['hero', 'game'],
  data () {
    return {
      msg: 'Game',
    }
  },
  methods: {
    leaveGame() {
      console.log('Leaving game')
      this.$socket.emit('leaveGame', this.hero.id)
    }
  },
  computed: {
    villain() {
      if (this.game.players.length > 1) {
        return this.game.players.filter(p => p.id !== this.hero.id)[0].name
      } else return '--'
    }
  },
  sockets: {
  }
}
</script>

<style scoped>
.game {
  background: greenyellow;
  height: 30rem;
  width: 20rem;
}
h1 {
  margin: 0;
  display: inline-block;
}
.info {
  display: flex;
  justify-content: flex-end;
}
.status {
  margin-right: 3rem;
}
.card {
  height: 4rem;
  width: 3rem;
  background: peru;
}
.trump {
  background: palegreen;
}
.board {
  widows: 80%;
  height: 10rem;
  background: peachpuff;
}
</style>
