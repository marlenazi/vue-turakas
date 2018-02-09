<template>
  <nav>
    <img class="avatar" src="../assets/theFool.svg" alt="turakas logo">
    <div class="name">
      {{ hero.name }}
    </div>
  </nav>
</template>

<script>

export default {
  name: 'TurakasNavbar',
  props: {
    hero: Object
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

nav {
  flex: 0 0 auto;
  margin: .5rem;
  border: .2rem solid $accent;
  border-radius: .5rem;
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
