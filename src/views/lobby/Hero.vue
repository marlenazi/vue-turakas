<template>
  <div class="hero height-1">
    <div class="avatarAndRank">
      <img class="avatar" src="../../assets/theFool.svg" alt="" srcset="">
      <!-- <div class="rank">
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

<style scoped>
.hero {
  background: whitesmoke;
  margin: .5rem;
  padding: .5rem;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 0 0 auto;
}
.avatarAndRank {
  display: flex;
  flex-flow: column;
  align-items: center;
}
.avatar {
  height: 6rem;
  flex: 0 0 auto;
}
.rank {
  border: 1px solid black;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: .5rem;
  font-size: 3rem;
}
.name {
  margin: 1rem 1rem;
  font-size: 3rem;
}
</style>
