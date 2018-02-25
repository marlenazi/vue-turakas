<template>
  <div class="game">
    <nav>      
      <span v-if="game.status === 'Waiting'">Players: {{ game.players.length }}/{{ game.size }}</span>
      <button class="leaveGameBtn" @click="leaveGame"> X </button>
      
    </nav>
      {{ hero.name }} 
      <span v-if="time < 10"> Time: {{ time }}</span>
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
          Attacking Card: 
          <span v-if="game.attackerCard">
            {{ game.attackerCard.rank }}{{ game.attackerCard.suit }}
          </span> 
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
          :key="card.rank + card.suit"
          @click="pickUp">
          {{ card.rank }}{{ card.suit }}
        </div>
      </div>
        <button class="pickUpBtn" @click="pickUp"> Pick up </button>
        <button class="muckBtn" @click="muck"> Muck </button>
      <div class="hand">
        <div class="card" 
          v-for="card in hand" 
          :key="card.rank + card.suit"
          @click="move(card)">
          {{ card.rank }}{{ card.suit }}
        </div>
      </div>
      <!-- {{game}} -->
  </div>
</template>

<script>
export default {
  name: 'Game',
  props: ['hero', 'game'],
  data () {
    return {
      msg: 'Game',
      hand: [],
      time: 30
    }
  },
  methods: {
    leaveGame() {
      console.log('Leaving game')
      this.$socket.emit('leaveGame', this.hero.id)
    },
    move(card) {
      console.log(card)
      this.$socket.emit('move', this.game.id, card)
    },
    pickUp() {
      this.$socket.emit('pickUp', this.hero.id)
    },
    muck() {
      this.$socket.emit('muck', this.hero.id)
    }
  },
  computed: {
    
  },
  mounted() {
    if (this.game.status === 'Playing') {
      this.$socket.emit('getHand', this.hero.id)
    }
  },
  sockets: {
    hand(hand) {
      this.hand = hand
    },
    updateGame(game) {
      if (game.status === 'Playing') {
        console.log('asking for a hand')
        this.$socket.emit('getHand', this.hero.id)
      }
    },
    time(timePassed) {
      this.time = timePassed
    },
    gameOver(state) {
      console.log('Winner: ' + state.winner.name)
      console.log('Turakas: ' + state.turakas.name)
    }
  }
}
</script>

<style scoped>
.game {
  background: greenyellow;
  height: 30rem;
  width: 20rem;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
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
  border: 1px solid silver;
  border-radius: 5px;
  height: 4rem;
  width: 3rem;
  background: peru;

  flex: 0 0 auto;
}
.trump {
  background: palegreen;
}
.board {
  height: 12rem;
  display: flex;
  flex-flow: row wrap;
  padding: .5rem;
  justify-content: space-around;
  background: peachpuff;
}
.hand {
  width: 95%;
  height: 6rem;
  padding: .2rem;
  align-self: center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow-x: auto;
}
.hand .card {
  margin: 1px;
  display: inline-block;
}
</style>
