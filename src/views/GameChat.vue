<template>
  <div class="chat">

      <transition-group class="message-group" el="div">
      <chat-message
        class="message"
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
        :hero="hero"
        :visible="chatOpen"
      />
      </transition-group>



<!-- :style="{opacity: chatOpen ? 1 : 0}" -->
    <form 
      id="chatFieldForm"
      v-on:submit.prevent="$_sendMessage"
      autocomplete="off"
    >
      <input
        id="chatField"
        class="chatField"
        :class="{'visible': chatOpen}"
        ref="chatField"
        type="text"
        placeholder="Say..."
        v-model="chatMessage"
      />
    </form>



    <button 
      
      ref="chatButton"
      class="toggleChatBtn height-1"
      :class="{toggleChatBtnOpen: chatOpen}"
      @click.prevent="$_openChat"
    >
    <img src="../assets/buttons/chat1.svg"/>
    </button>

  </div>
</template>

<script>
import ChatMessage from './ChatMessage'

export default {
  name: "GameChat",
  props: {
    hero: Object,
    gameId: String
  },
  components: {
    ChatMessage
  },
  data() {
    return {
      chatOpen: false,
      chatMessage: "",
      messages: []
    };
  },
  methods: {
    $_sendMessage() {
      if (this.chatOpen && this.chatMessage.length) {
        console.log("Sending message");

        this.$socket.emit("sendChat", {
          sender: this.hero.name,
          senderId: this.hero.id,
          gameId: this.gameId,
          body: this.chatMessage
        });

        this.chatMessage = "";
      }
    },
    $_openChat() {
      if (this.chatOpen) {
        console.log('on -> off')
        this.$_sendMessage()
        this.chatOpen = false
        
      } else {
        console.log("off -> on");
        this.chatOpen = true
        this.$refs.chatField.focus()
      }
    }
  },
  sockets: {
    getChat(chat) {
      console.log(chat);
      chat.id = this.messages.length + 1
      this.messages.unshift(chat);
    }
  }
};
</script>


<style lang="scss" scoped>
@import "./../style/variables";

.chat {
  // border: 1px solid blue;
  position: absolute;
  bottom: 9rem;
  right: 0rem;
  
  height: 22rem;
  width: 19rem;

  padding: .4rem;

  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: flex-end;
  z-index: 2;
  overflow: hidden;
}

.message-group {
  // border: 1px solid green;
  display: flex;
  height: 11.5rem;
  width: 100%;
  flex-flow: column-reverse nowrap;
  overflow: hidden;
}
.toggleChatBtn {
  height: 3.5em;
  width: 3.5em;
  border-radius: 50%;
  border-radius: 20% 20% 20% 100%;
}
.toggleChatBtnOpen {
  border-radius: 0% 0% 50% 50%;
  border-radius: 0% 0% 20% 100%;
}
.chatField {
  border: 1px solid $btn;
  opacity: 0;
  margin-left: auto;
  height: 2em;
  padding: 0 0.5em;
  width: 12rem;
  border-radius: 0.5em .5em 0 0.5em;
  background: rgba(255, 255, 255, .85);
  transition: all .2s ease-in-out;
}
.chatField:focus {
  border-width: 2px;
}

.visible {
  opacity: 1;
  z-index: 7;
}

.appear-enter {
  opacity: .5;
}
.appear-enter-active {
  transition: opacity 1s ease-in-out;
}
.appear-enter-to {
  opacity: 1
}
</style>

