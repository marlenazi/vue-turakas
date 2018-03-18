<template>
  <div class="turakasGameFinished">

    <leave-button 
      class="leaveButton"
      :heroId="hero.id">
    </leave-button>

    
    <div class="info">

      <div class="winnerCards">
        <game-card
          id="lastCards"
          v-for="card in cards"
          :key="card.rank + card.suit"
          :rank="card.rank"
          :suit="card.suit"
          :bigRank="card.rank"
        />
      </div>
      <h3>
        Winner
      </h3>

      <h2 class="loserName"> 
        {{ game.turakas.name }} 
      </h2>
      <!-- <p>All hail the dummy!</p> -->
      <br><br>
      
      <img src="../assets/theFool.svg" alt="the fool" srcset="">
      <strong>Loser</strong>


      <strong class="winnerName">{{ game.winner.name }}</strong>
      
    </div>

  </div>
</template>

<script>
import LeaveButton from './TurakasGameLeaveButton'
import GameCard from './TurakasGameCard'

export default {
  name: 'GameFinished',
  props: {
    hero: Object,
    game: Object
  },
  components: {
    GameCard, LeaveButton
  },
  data() {
    return {
      msg: "Looks like this one is finished",
      cards: this.game.pagunid.length ? this.game.pagunid : [this.game.board[this.game.board.length - 1]]
    }
  }
}

</script>

<style lang="scss" scoped>
@import './../style/variables';

.turakasGameFinished {
  flex: 1 0 auto;
  border-radius: .5rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
h1 {
  font-size: 2rem;
}
img {
  height: 7rem;
}
.message {
  padding: 2rem;
}

.leaveButton {
  margin-right: auto;
}

.info {
  padding: 0 3rem;
  display: flex;
  flex-flow: column;
  align-items: center;
}

.loserName {
  color: $accent;
}
.winnerName {
  color: $accent;
}
.winnerCards {
  display: flex;
}
#lastCards {
  margin: .5em;
}
</style>