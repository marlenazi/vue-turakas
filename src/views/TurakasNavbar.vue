<template>
  <nav>
    <img class="avatar" src="../assets/theFool.svg" alt="turakas logo">
    <div class="rank-name">
      <div class="rank">
        {{ hero.rank }} <span class="rankLabel">wins</span>
      </div>
      <div 
        class="name"
        v-bind:style="{fontSize: $_fontSize + 'rem'}"
      >
        {{ hero.name }}
      </div>
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
  padding-bottom: .5rem;
  display: flex;
  align-items: flex-end;
}
nav img {
  height: 5rem;
  margin-left: 0em;
}
.rank-name {

}
.rank {
  color: $accent;
  font-size: 1.5rem;
}

.rankLabel {
  color: $title;
  font-size: 1rem;
}

</style>
