<template>
  <div class="lobby">
      {{ hero.name }}
      {{ game }}
    <br>
      <GameButton 
        :hero="hero"
        :game="game"/>
  </div>
</template>

<script>
import GameButton from './GameButton'

export default {
  name: 'Lobby',
  props: ['hero', 'game'],
  components: {
    GameButton
  },
  data () {
    return {
      msg: 'Lobby'
    }
  },
  methods: {
    
  }
}
</script>

<style>
.lobby {
  background: greenyellow;
  height: 25rem;
  width: 16rem;
}
</style>
