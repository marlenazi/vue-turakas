<template>
  <div 
    class="message"
    :class="[{'your-message': message.senderId === hero.id}, 
             {'screened': visible},
             {'incoming': !visible && !inited},]"
  >
    {{ message.body }}
    <!-- {{ visible }} -->
  </div>
</template>

<script>
export default {
  name: 'ChatMessage',
  props: {
    message: Object,
    hero: Object,
    visible: Boolean,
  },
  data() {
    return {
      inited: false,
    }
  },
  updated() {
    // we use this to stop the incoming animation from running
    this.inited = true
  },
}
</script>

<style lang="scss" scoped>
@import "./../style/variables";

.message {
  opacity: 0;
  display: inline-block;
  flex: 0 0 auto;

  margin: 0.2rem 0;
  margin-right: auto;
  padding: 0.2rem 0.5rem;

  max-width: 12rem;

  border-radius: 0 0.5rem .5rem;
  background: $chatMessage;
  font-family: Lucida Sans Unicode;
  color: $text;
  word-wrap: break-word;
  overflow: hidden;
  transition: opacity .2s ease-in-out;
}
.your-message {

  margin-left: auto;
  margin-right: .1rem;
  border-radius: .5rem 0.5rem 0;
  background: $yourChatMessage;
}
.screened {
  opacity: 1;
}

.incoming {
  z-index: 12;
  animation-name: incoming;
  animation-duration: 5s;
}
@keyframes incoming {
  0%   { opacity: 1 }
  20%  { opacity: 1 }
  40%  { opacity: 1 }
  60%  { opacity: 1 }
  80%  { opacity: 1 }
  100% { opacity: 0 }
}
</style>
