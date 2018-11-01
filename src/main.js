import Vue from 'vue'
import App from './App.vue'
import sockets from 'vue-socket.io'

Vue.use(sockets, 'https://zoomi.turakas.online', {secure: true})

new Vue({
  el: '#turakas',
  render: h => h(App)
})
