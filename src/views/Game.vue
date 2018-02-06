<template>
  <div class="game">
    <nav>
      <h1>{{msg}}: {{ game.id }}</h1>
      
      Players: {{ game.players.length }}/{{ game.size }}
      <button class="leaveGameBtn" @click="leaveGame"> X </button>
      
    </nav>
      Hero: {{ hero.name }}<br>
    <hr>
      <ul>
        <li v-for="player in game.players" :key="player.id">
          P{{ player.ix + 1 }}: {{ player.name }} Cards: {{ player.hand }}
        </li>
      </ul>
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
        <div class="card" 
          v-for="card in game.board" 
          :key="card.rank + card.suit">
          {{ card.rank }}{{ card.suit }}
        </div>
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
nav {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
h1 {
  margin: 0;
  display: inline-block;
}
.leaveGameBtn {
  padding: .5rem;
}
.info {
  display: flex;
  justify-content: flex-end;
}
.status {
  margin-right: 3rem;
}
.card {
  height: 5rem;
  width: 4rem;
  background: peru;
}
.trump {
  background: palegreen;
}
.board {
  height: 12rem;
  display: flex;
  padding: .5rem;
  justify-content: space-around;
  background: peachpuff;
}
</style>
