<template>
  <div class="welcome" onsubmit="return">
      <h1>{{ msg }}</h1>
      <form action="">
        <input 
          id="nameField" 
          type="text" 
          name="nameField" 
          placeholder="Your Name"
          v-model="name"/>
        <button @click.prevent="login">Login</button>
      </form>
  </div>
</template>

<script>


export default {
  name: 'Welcome',

  data () {
    return {
      msg: 'Lets play some cards',
      name: 'Macarena' + parseInt(Math.random() * 10),
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
  padding: 1rem;
}
h1 {
  font-size: 1.5rem;
  text-align: center;
}
</style>
