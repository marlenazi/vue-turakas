<template>
  <div class="turakasGameFinished">

  
    <leave-button 
      class="leaveButton"
      :heroId="hero.id">
    </leave-button>

    <h2>
      Turakas
    </h2> 
    
    <div class="info">
      <img src="../assets/theFool.svg" alt="the fool" srcset="">
      <h2 class="loserName"> 
        {{ game.turakas.name }} 
      </h2>
      <!-- <p>All hail the dummy!</p> -->
      <br><br>
      <strong>Winner:</strong>
      <game-card
        id="winnerCards"
        v-for="card in [game.board[game.board.length - 1]]"
        :key="card.rank + card.suit"
        :rank="card.rank"
        :suit="card.suit"
        :bigRank="card.rank">
      </game-card>


      <strong class="winnerName">{{ game.winner.name }}</strong>
      
    </div>

  </div>
</template>

<script>
import LeaveButton from './TurakasGameLeaveButton'
import GameCard from './TurakasGameCard'

export default {
  name: 'TurakasGameFinished',
  props: {
    hero: Object,
    game: Object
  },
  components: {
    GameCard, LeaveButton
  },
  data() {
    return {
      msg: "Looks like this one is finished"
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
  height: 10rem;
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
#winnerCards {
  margin: .5em 0;
}
</style>