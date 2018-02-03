import Vue from 'vue'
import App from './App.vue'
import sockets from 'vue-socket.io'

Vue.use(sockets, 'http://192.168.0.103:2000')

new Vue({
  el: '#turakas',
  render: h => h(App)
})
