<template>
  <nav>
    <img class="avatar" src="../assets/theFool.svg" alt="turakas logo">
    <div 
      class="name"
      v-bind:style="{fontSize: $_fontSize + 'rem'}">
      {{ hero.name }}
    </div>
  </nav>
</template>

<script>

export default {
  name: 'TurakasNavbar',
  props: {
    hero: Object
  },
  computed: {
    $_fontSize() {
      return this.hero.name.length < 10 ? 2 : 1.6
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

nav {
  flex: 0 0 auto;
  border-bottom: 1px solid $accent;
  padding: .5rem;
  display: flex;
  align-items: center;
}
nav img {
  height: 4rem;
}
.name {
  margin-left: 1rem;
  font-size: 2rem;
}

</style>
