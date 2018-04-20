<template>
  <div class="welcome">

      <header>
        <h1>{{ title }}</h1>
        <p>A PRE NUCLEAR CARD GAME</p>
        <img src="../assets/theFool.svg" alt="the fool" srcset="">
      </header>

      <form action="" autocomplete="off">
        <!-- container for not to interfere with other elements on focus -->
        <div class=inputContainer>
          <input
            @keyup.enter="$refs.loginButton.click()"
            id="nameField"
            class="height-1"
            type="text"
            maxlength="15" 
            name="nameField" 
            placeholder="Anonymous"
            v-model="nameModel"/>
        </div>

        <button 
          class="loginBtn"
          ref="loginButton"
          @click.prevent="login" 
          :disabled="name.length < 1">
          Enter
        </button>

      </form>

  </div>
</template>

<script>


export default {
  name: 'Welcome',
  props: {
    hero: Object,
  },
  data () {
    return {
      title: 'Turakas',
      nameModel: '',
    }
  },
  methods: {
    login() {
      // console.log('Login ' + this.name)
      this.$socket.emit('login', this.nameModel.length ?

                                 this.nameModel 
                                 : this.name           )
    }
  },
  computed: {
    name() {
      return this.hero.name || 'Anon'
    }
  }
}
</script>

<style lang="scss" scoped>

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
}

h1 {
  font-size: 3rem;
  text-align: center;
  font-variant: small-caps;
}
header p {
  font-size: .8rem;
  text-align: center;
}
form {
  flex: 0 0 9.5rem;
  text-align: center;
}
/* for not to interfere with other elements on focus */
.inputContainer {
  height: 5rem;
  width: 14rem;
}
input {
  border: .1rem solid $accent;
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


@media screen and (max-height: 250px) {
  .welcome {
    // when keyboard was open, it squashed the layout, especially in landscape
    flex-wrap: nowrap;
  }
}
</style>
