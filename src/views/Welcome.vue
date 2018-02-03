<template>
  <div class="welcome">
      {{ msg }}
      <input 
        id="nameField" 
        type="text" 
        name="nameField" 
        placeholder="Your Name"
        v-model="name">
      <button @click="login">Login</button>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      msg: 'Welcome',
      name: 'Nimega',
    }
  },
  methods: {
    login() {
      console.log('Login ' + this.name)
      this.$socket.emit('login', this.name)
    }
  }
}
</script>

<style>
.welcome {
  background: hotpink;
  height: 16rem;
  width: 16rem;
}
</style>
