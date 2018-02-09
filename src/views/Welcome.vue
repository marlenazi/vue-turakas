<template>
  <div class="welcome">

      <header>
        <h1>{{ title }}</h1>
        <img src="../assets/theFool.svg" alt="the fool" srcset="">
      </header>

      <form action="" autocomplete="off">
        <!-- container for not to interfere with other elements on focus -->
        <div class=inputContainer>
          <input id="nameField" class="height-1"
            type="text" 
            name="nameField" 
            placeholder="Your Name"
            v-model="name"/>
        </div>

        <button 
        class="loginBtn" 
        @click.prevent="login" 
        :disabled="name.length < 3">
        Enter
        </button>

      </form>

  </div>
</template>

<script>


export default {
  name: 'Welcome',

  data () {
    return {
      title: 'Turakas',
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

<style lang="scss">

@import './../style/variables';

.welcome {
  
  background: $bg;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
header {
  flex: 0 0 16.5rem;
  // height: 16.5rem;
}

h1 {
  font-size: 3rem;
  text-align: center;
  font-variant: small-caps;
}
form {
  flex: 0 0 9.5rem;
  // height: 9.5rem;
}
/* for not to interfere with other elements on focus */
.inputContainer {
  height: 5rem;
  width: 14rem;
}
input {
  border: .1rem solid $btn;
  border-radius: .5rem;
  margin: .5rem;
  padding: .3rem;
  height: 3rem;
  width: 12rem;
  font-size: 1.4rem;
  text-align: center;
  transition: all 0.15s ease-in-out;
}
input:focus {
  font-size: 1.5rem;
  margin: 0.25rem;
  height: 3.5rem;
  width: 12.5rem;
  border: .25rem solid $btn;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 
              0 15px 12px rgba(0,0,0,0.22);
}
.loginBtn {
  height: 4.5rem;
  width: 4.5rem;
  border-radius: 50%;
  background: $btn;
  font-size: 1.2rem;
  color: $action;
}

</style>
