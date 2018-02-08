<template>
<div id="app" class="turakas">
  <!-- <button @click="changeView">Change View</button>
  <button >Timer</button> -->
  <transition name="fade" mode="out-in">
    <component class="mainView"
      :is="view"
      :hero="hero"
      :game="game">
    </component>
  </transition>
</div>
</template>

<script>
import Welcome from './views/Welcome'
import Main from './views/Main'
import Game from './views/Game'

export default {
  name: 'Turakas',
  components: {
    Welcome, Main, Game
  },
  data () {
    return {
      view: 'Welcome',
      hero: {},
      game: {},
    }
  },
  methods: {

  },
  computed: {

  },
  sockets: {
    loggedIn(user) {
      this.hero = user
      this.view = 'Main'
    },
    joinedGame(state) {
      this.view = 'Game'
      this.game = state
    },
    leftGame() {
      this.view = 'Main'
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

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body {
  height: 100%;
  width: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.turakas *  :focus {
  outline: none;
}
.turakas {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mainView {
  width: 100%;
  height: 100%;
  /* max-width: 50rem; */
  /* padding: .2rem; */
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
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
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 
              0 15px 12px rgba(0,0,0,0.22);

  transition: all .1s ease-in-out;
}
button:focus, button:hover {
  cursor: pointer;
  text-decoration: underline; 
}
button:active {

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

</style>
