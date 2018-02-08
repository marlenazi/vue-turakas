<template>
  <div class="welcome" onsubmit="return">
      <h1>{{ msg }}</h1>
      <img src="../assets/theFool.svg" alt="the fool" srcset="">
      <form action="">
        <input id="nameField" class="height-1"
          type="text" 
          name="nameField" 
          placeholder="Your Name"
          v-model="name"/>
        <button class="loginBtn" @click.prevent="login">Enter</button>
      </form>
  </div>
</template>

<script>


export default {
  name: 'Welcome',

  data () {
    return {
      msg: 'TURAKAS',
      name: 'Ar' + parseInt(Math.random() * 10) + 'o',
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
  height: 100%;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
}
img {
  height: 20rem;
}
h1 {
  font-size: 3rem;
  text-align: center;
}
form {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
}
input {
  border: .1rem solid rgb(255, 0, 140);
  border-radius: .5rem;
  padding: .3rem;
  height: 3rem;
  width: 12rem;
  font-size: 1.4rem;
  text-align: center;
}
input:focus {
  outline: none;
  border: .25rem solid rgb(255, 0, 140);
}
.loginBtn {
  margin: 1rem;
  height: 4.5rem;
  width: 4.5rem;
  border: none;
  border-radius: 50%;

  background: rgb(255, 0, 140);
  font-size: 1.2rem;
  color: white;
}

</style>
