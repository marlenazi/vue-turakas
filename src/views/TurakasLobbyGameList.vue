<template>
  <div class="games">
    <game-list-item
      v-for="game in games"
      :key="game.id"
      :game="game"
      :heroId="heroId">
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
    availableGamesSent(newGames) {
      console.log('Received an array of games')
      console.log(newGames)
      console.log(this.$parent.game.status)
      this.games = newGames
    },
    gameCreated(newGame) {
      console.log('New game created')
      console.log(newGame)

      this.games.push(newGame)
    },
    gameClosed(closedGameId) {
      console.log('Game closed')
      console.log(closedGameId)

      this.games.splice(this.games.findIndex(game => 
                                             game.id === closedGameId), 1)
    }
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
