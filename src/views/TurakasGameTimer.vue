<template>
  <div class="timer">
    <div 
      class="time"
      :style="{width: $_timeLength}"
    >

    </div>
  </div>
</template>

<script>
export default {
  name: 'GameTimer',
  props: {
    time: Object,
  },
  computed: {
    $_timeLength() {
      return 100 / this.time.limit * this.time.passed + '%'
    }
  }
}
</script>


<style lang="scss" scoped>
@import './../style/variables';

.timer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: .15em;
  background: $action;
}
.time {
  background: $accent;
  height: 100%;
}
</style>
