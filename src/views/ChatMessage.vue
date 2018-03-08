<template>
  <div 
    class="message"
    :class="[{'your-message': message.senderId === hero.id},
             {'screened': visible},
             {'incoming': !visible && !inited},
             {'game-msg': message.sender === 'Game'},
            ]"
  >
    <div class="message-author">
      {{ message.sender }}
    </div>
    <div class="message-body">
      {{ message.body }}
    </div>
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
  display: flex;
  flex-flow: column;
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
.game-msg {
  background: $gameChatMessage;
}
.your-message {
  align-items: flex-end;
  margin-left: auto;
  margin-right: .1rem;
  border-radius: .5rem 0.5rem 0;
  background: $yourChatMessage;
}
.message-author {
  font-size: .8rem;
  font-weight: bold;
  line-height: 1;

  color: $titleLight;
}

.screened {
  opacity: 1;
}

.incoming {
  z-index: 12;
  animation-name: incoming;
  animation-duration: 3s;
}
.incoming-game {
  z-index: 12;
  animation-name: incoming;
  animation-duration: 2s;
}

@keyframes incoming {
  0%   { opacity: 1 }
  80%  { opacity: 1 }
  100% { opacity: 0 }
}
</style>
