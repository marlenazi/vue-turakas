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
        @blur="chatOpen = false"
      />
    </form>



    <button 
      
      ref="chatButton"
      class="toggleChatBtn height-1"
      :class="{toggleChatBtnOpen: chatOpen}"
      @click.prevent="$_openChat"
    >
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
      messages: [
        {"id": '1', "sender":"Asdj","senderId": this.hero.id,"gameId":"ByW2u-fuz","body":"Esimene Mida ma ütleks?"},
        {"id": '2', "sender":"Asdj","senderId":"BykGr-fuf","gameId":"ByW2u-fuz","body":"Midagi kolmandat"},
        // {"sender":"asdf","senderId":this.hero.id,"gameId":"ByW2u-fuz","body":"tere on alati hea variant"},
        // {"sender":"Asdj","senderId":"SJaTV-z_f","gameId":"ByW2u-fuz","body":"Midagi kolmandat"},
        // {"sender":"asdf","senderId":"SJaTV-z_f","gameId":"ByW2u-fuz","body":"tere on alati hea variant"},
        // {"sender":"Asdj","senderId":this.hero.id,"gameId":"ByW2u-fuz","body":"Midagi teist kolmandat"},
        // {"sender":"asdf","senderId":"SJaTV-z_f","gameId":"ByW2u-fuz","body":"tere on alati hea variant"},
      ]
    };
  },
  methods: {
    $_sendMessage() {
      if (this.chatOpen && this.chatMessage.length) {
        console.log("Sending message");

        this.$socket.emit("sendChat", {
          id: this.messages.length + 1,
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
        this.chatOpen = false
      } else {
        this.chatOpen = true
        this.$refs.chatField.focus()
      }
    }
  },
  sockets: {
    getChat(chat) {
      console.log(chat);
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
  z-index: 0;
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
  background: rgba(255, 255, 255, .5);
  transition: all .2s ease-in-out;
}
.chatField:focus {
  border-width: 2px;
}

.visible {
  opacity: 1;
  z-index: 0;
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

