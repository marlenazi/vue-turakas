<template>
  <div class="hero height-1">
    <div class="avatarAndRank">
      <img class="avatar" src="../../assets/theFool.svg" alt="" srcset="">
      <!-- <div class="rank">
        <span>Rank:</span>
        {{ hero.rank }}
      </div> -->
    </div>
    <div class="name">
      {{ hero.name }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'Hero',
  props: ['hero'],
  components: {

  },
  data() {
    return {
      
    }
  },
  methods: {

  },
  computed: {

  },
  created() {

  },
  sockets: {
    
  }
}
</script>

<style lang="scss" scoped>

@import './../../style/variables';

.hero {
  background: $bg;
  padding: .5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  flex: 0 0 auto;
}
.avatarAndRank {
  display: flex;
  flex-flow: row;
  align-items: center;
}
.avatar {
  height: 4rem;
  flex: 0 0 auto;
}
.rank {
  border: 1px solid black;
  width: 2rem;
  height: 2rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  margin: .5rem;
  font-size: 3rem;
  color: red;
}
.rank span {
  font-size: 1rem;
}
.name {
  margin: 1rem 1rem;
  font-size: 2rem;
  color: $title;
}

@media screen and (orientation: landscape) {

}
</style>
