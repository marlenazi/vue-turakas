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
    heroId: String,
    games: Array
  },
  components: {
    GameListItem
  },
  data() {
    return {
      title: "Games",
    };
  },
  methods: {
    $_getAvailableGames() {
      this.$socket.emit('getAvailableGames', this.heroId)
    }
  },
  created() {
    console.log(this.heroId)
    this.$_getAvailableGames()
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
