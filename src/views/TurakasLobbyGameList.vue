<template>
  <div class="games">
    <game-list-item
      v-for="game in games"
      :key="game.id"
      :game="game">
    </game-list-item>
  </div>
</template>

<script>
import GameListItem from "./TurakasLobbyGameListItem";

export default {
  name: "GameList",
  props: {
    heroId: String
  },
  components: {
    GameListItem
  },
  data() {
    return {
      title: "Games",
      games: [
        {
          id: "127724",
          players: [
            {
              id: "xyz",
              name: "nipitiri"
            },
            {
              id: "zyx",
              name: "tiri"
            }
          ]
        },{
          id: "123324",
          players: [
            {
              id: "xyz",
              name: "asdnipi"
            },
            {
              id: "zyx",
              name: "tiri"
            }
          ]
        },{
          id: "027724",
          players: [
            {
              id: "xyz",
              name: "hipipiasdf"
            },
            {
              id: "zyx",
              name: "tiri"
            }
          ]
        },{
          id: "121324",
          players: [
            {
              id: "xyz",
              name: "nipi"
            },
            {
              id: "zyx",
              name: "tiri"
            }
          ]
        }
      ]
    };
  },
  methods: {
    $_getAvailableGames() {
      this.$socket.emit('getAvailableGames', this.heroId)
    }
  },
  created() {
    this.$_getAvailableGames()
  },
  sockets: {
    availableGames(newGames) {
      console.log('Received games to lobby')
      console.log(newGames)

      this.games = newGames
    },
    gameCreated(newGame) {
      console.log('New game created')
      console.log(newGame)

      console.log(this.games.some(game => game.id === newGame.id))
      if (this.games.some(game => game.id === newGame.id)) return

      this.games.push(newGame)
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./../style/variables";
.games {
  flex: 1 0 auto;
  margin-top: 0.5rem;
  border: 0.2rem solid $accent;

  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-content: flex-start;
}
</style>
