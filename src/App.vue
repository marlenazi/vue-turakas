<template>
<div>
  <button @click="changeView">Change View</button>
  <transition name="fade" mode="out-in">
    <component 
      :is="view"
      :hero="hero"
      :game="game">
    </component>
  </transition>
</div>
</template>

<script>
import Welcome from './views/Welcome'
import Lobby from './views/Lobby'
import Game from './views/Game'

export default {
  name: 'Turakas',
  components: {
    Welcome, Lobby, Game
  },
  data () {
    return {
      view: 'Welcome',
      hero: {},
      game: {},
    }
  },
  methods: {
    changeView() {
      console.log(this.view)
      this.view = this.view === 'Welcome' ? 'Lobby' : 'Welcome'
    }
  },
  computed: {

  },
  sockets: {
    loggedIn(user) {
      this.hero = user
      this.view = 'Lobby'
    },
    joinedGame() {
      this.view = 'Game'
    },
    leftGame() {
      this.view = 'Lobby'
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
