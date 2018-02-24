<template>
  <div class="games">

    <game-list-item
      v-for="game in games"
      :key="game.id"
      :game="game"
      :hero="hero"
      :class="{active: game.status === 'Playing' && game.id === hero.game}">
    </game-list-item>

  </div>
</template>

<script>
import GameListItem from "./TurakasLobbyGameListItem";

export default {
  name: "GameList",
  props: {
    hero: Object,
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
      console.log('Requesting games for gameList')
      this.$socket.emit('getGameList', this.hero.id)
    }
  },
  created() {
    this.$_getAvailableGames()
  }
};
</script>

<style lang="scss" scoped>
@import "./../style/variables";
.games {
  flex: 1 0 auto;
  margin-top: 0.5rem;
  // border: 0.2rem solid $accent;

  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-content: flex-start;
}


.active {
  box-shadow: 0px 0px 6px 1px $shadow;
  animation-name: your-move;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes your-move {
  from {
    box-shadow: 0px 0px 8px 3px $accent;
  }
  to {
    box-shadow: 0px 0px 10px 3px $action;
  }
}

</style>
