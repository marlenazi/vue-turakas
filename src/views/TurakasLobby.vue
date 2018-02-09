<template>
  <div class="lobby">

    <div class="titleAndNewGame">
      <div class="lobbyTitle">
        {{ title }}
      </div>
      <new-game 
        class="newGameButton"
        :heroId="heroId"/>
    </div>

    <game-list
      :heroId="heroId">
    </game-list>

  </div>
</template>

<script>
import NewGame from './TurakasLobbyNewGame'
import GameList from './TurakasLobbyGameList'

export default {
  name: 'TurakasLobby',
  props: {
    heroId: String
  },
  components: {
    NewGame, GameList,
  },
  data() {
    return {
      title: 'Games',
    }
  },
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.lobby {
  flex: 1 0 auto;
  margin: .5rem;
  padding: .5rem;
  border: .2rem solid $accent;
  border-radius: .5rem;
  display: flex;
  flex-flow: column nowrap;
}
.titleAndNewGame {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}
.lobbyTitle {
  font-size: 2.2rem;
  margin-left: 1rem;
}
</style>
