<template>
<div id="app" class="turakas">
  <transition name="fade" mode="out-in">
    <component class="appView"
      :is="appView"
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
      appView: 'Welcome',
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
    loggedIn(client) {
      console.log(`Logged in ${client.name}`)
      console.log(client)

      this.appView = 'Turakas'
    },
    updateHero(client) {
      console.log('Got fresh hero state')
      console.log(client)
      this.hero = client
    },
    updateGame(state) {
      console.log('Updating game')
      console.log(state)
      this.game = state
    },
    gameList(newGames) {
      console.log('Received an array of games')
      console.log(newGames)
      // reverse it so newer are first
      this.games = newGames.reverse()
    },
    updateGameList(state) {
      console.log('Update game list')

      let game = this.games.find(game => game.id === state.id)

      if (game) {
        console.log('updating game: ' + game.id)
        console.log(state)
        Object.keys(state).map(key => {
          
          game[key] = state[key]
        })
        if (game.status === 'Closed') {
          console.log('splicing');
          
          this.games.splice(this.games.findIndex(game => 
            game.id === state.id), 1)
        }
      } else {
        console.log('add new game to list')
        this.games.unshift(state)
      }
    },
    serverMessage(msg) {
      console.log(msg)
      alert(msg)
    },
    serverError(err = 'something happened') {
      console.log('==== SERVER ERROR ====')
      console.log(err)
      if (confirm(err + ' -- Back to Welcome screen?')) {
        this.game = {}
        this.appView = 'Welcome'
      }
    },
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
  max-height: 500px;
  max-width: 320px;
  // border: 1px solid $accent;
}
#app *:focus {
  outline: none;
}

.appView {
  // border: 1px solid blue;
  height: 100%;
  width: 100%;

}


ul {
  list-style-type: none;
  padding: 0;
}
.height-0 {
  box-shadow: 0 2px 1px rgb(218, 218, 218), 
              0 0px 1px rgba(255, 255, 255, 0.22);
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


@keyframes your-move {
  from {
    box-shadow: 0px 0px 8px 3px $action;
  }
  to {
    box-shadow: 0px 0px 6px 1px orangered;
  }
}



@media screen and (min-width: 640px){
  
}


</style>


