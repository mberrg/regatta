<template>
  <div>
    <div style="font-size: 0.2em; ">
      {{ heading }}
    </div>
    <div stye="line-height:1">
      {{ countdown.isNegative ? '-' : '' }}{{ countdown.hours }}:{{
        countdown.minutes
      }}:{{ countdown.seconds }}
    </div>
    <div style="font-size: 0.2em; ">Heat {{ heat }} of {{ totHeats }}</div>
  </div>
</template>

<script>
export default {
  name: 'CountDown',
  computed: {
    startTime() {
      return this.$store.getters['countdown/getStartTime'];
    },
    countdown() {
      return this.$store.getters['countdown/getTimeleft'];
    },
    heat() {
      return this.$store.getters['countdown/getHeatNum'];
    },
    totHeats() {
      return this.$store.getters['countdown/getTotHeats'];
    },
    heading() {
      if (this.heat == 1 && !this.countdown.isNegative) {
        return `First heat starting ${this.startTime.toLocaleTimeString()}`;
      }
      if (!this.countdown.isNegative) {
        return `Next heat starting ${this.startTime.toLocaleTimeString()}`;
      }
      return `Last heat started ${this.startTime.toLocaleTimeString()}`;
    }
  }
};
</script>
