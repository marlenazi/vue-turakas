<template>
<div id="app" class="turakas">
  <transition name="fade" mode="out-in">
    <component class="mainView"
      :is="mainView"
      :hero="hero"
      :game="game"
      :games="games"
    >
    </component>
  </transition>
</div>
</template>

<script>
import Welcome from './views/Welcome'
import Turakas from './views/Turakas'

export default {
  name: 'App',
  components: {
    Welcome, Turakas
  },
  data () {
    return {
      mainView: 'Welcome',
      hero: {},
      game: {},
      games: [],
    }
  },
  methods: {

  },
  computed: {

  },
  sockets: {
    loggedIn(user) {
      console.log(`Logged in ${user.name}`)
      // console.log(user)

      this.hero = user
      this.mainView = 'Turakas'
    },
    availableGamesSent(newGames) {
      console.log('Received an array of games')
      // console.log(newGames)
      this.games = newGames
    },
    gameCreated(newGame) {
      console.log('New game created')
      // console.log(newGame)

      this.games.push(newGame)
    },
    gameClosed(closedGameId) {
      console.log('Game closed')
      console.log(closedGameId)

      this.games.splice(this.games.findIndex(game => 
                                             game.id === closedGameId), 1)
    },
    joinedGame(state) {
      console.log('Joined game')
      // console.log(state)
      this.activeView = 'TurakasGame'
      this.game = state
    },
    leftGame() {
      this.game = {}
    },
    updateGame(state) {
      console.log('Updating game')
      this.game = state
    },
    gameOver(state) {
      this.game = state
    }
  }
}
</script>


<style lang="scss">

@import './style/variables';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body {
  height: 100%;
  width: 100%;
  background: $bg;
  display: flex;
  justify-content: center;
  align-items: center;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  max-height: 640px;
  max-width: 360px;
  border: 1px solid $accent;
}
#app *:focus {
  outline: none;
}

.mainView {
  // border: 1px solid blue;
  height: 100%;
  width: 100%;

}


ul {
  list-style-type: none;
  padding: 0;
}

.height-1 {
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 
              0 3px 6px rgba(0,0,0,0.23);
}
.height-2 {
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 
              0 10px 10px rgba(0,0,0,0.22);
}

.height-3 {
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 
              0 15px 12px rgba(0,0,0,0.22);
}

button {
  border: none;
  background: $btn;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 
              0 15px 12px rgba(0,0,0,0.22);

  transition: all .1s ease-in-out;
}
button:focus, button:hover {
  cursor: pointer;
  background: $focus;
}

button:active {
  // height-1
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 
              0 3px 6px rgba(0,0,0,0.23);
}
button:disabled {
  opacity: .2;
  // height-1
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 
              0 3px 6px rgba(0,0,0,0.23);
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

@media screen and (min-width: 640px){
  
}


</style>


