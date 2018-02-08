<template>
  <div class="games height-1">
    <ul 
    
    v-if="games.length > 0"
    v-for="game in games"
    :key="game.id">

      <li 
      class="game height-2"
      @click="joinGame(game.id)">
        Players: {{ game.players.length }}/{{ game.size }}
        <div class="players"
        v-for="player in game.players"
        :key="player.id">
          {{ player.name }}
        </div>
        <span class="join">Play</span>
      </li>

    </ul>
  </div>
</template>

<script>

export default {
  name: 'Games',
  props: ['hero', 'games'],
  components: {

  },
  data() {
    return {
      
    }
  },
  methods: {
    joinGame(id) {
      this.$socket.emit('joinGame', id, this.hero.id)
    },   
  },
  computed: {

  },
  created() {

  },
  sockets: {
    
  }
}
</script>

<style scoped>
.games {
  background: orangered;
  flex: 1 1 auto;
  display: flex;
  margin: .5rem;
  padding: .5rem;
}

.game {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
  background: red;
  height: 8rem;
  width: 8rem;
  margin: .5rem;
  padding: 1rem;
}
.players {
  text-align: left;
}
.join {
  color: white;
  font-size: 1.2rem;
}

</style>
