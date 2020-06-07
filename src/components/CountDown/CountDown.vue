<template>
  <div class="countdown">
    <div style="font-size: 0.2em; ">
      {{ heading }}
    </div>
    <div>
      {{ countdown.isNegative ? '-' : '' }}{{ countdown.hours }}:{{
        countdown.minutes
      }}:{{ countdown.seconds }}
    </div>
    <div style="font-size: 0.2em; ">
      {{ footer }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { useCountDown } from './store';
export default defineComponent({
  name: 'CountDown',

  setup() {
    const {
      startTime,
      currentHeat,
      numHeats,
      nextHeat
    } = useCountDown.getState();

    const countdown = useCountDown.getTimeleft();

    const heading = computed(() => {
      const isNegative = nextHeat.value < 0;
      if (currentHeat.value == 1 && !isNegative) {
        return `First heat starting ${startTime.value.toLocaleTimeString()}`;
      }
      if (!isNegative) {
        return `Heat ${
          currentHeat.value
        } starting ${startTime.value.toLocaleTimeString()}`;
      }
      return `Last heat started ${startTime.value.toLocaleTimeString()}`;
    });

    const footer = computed(() => {
      const isNegative = nextHeat.value < 0;

      if (!isNegative) {
        return `Heat ${currentHeat.value} of ${numHeats.value}`;
      }
      return `All heat started ${currentHeat.value} of ${numHeats.value}`;
    });

    return { startTime, currentHeat, numHeats, heading, footer, countdown };
  }
});
</script>

<style lang="scss" scoped>
.countdown {
  line-height: 1;
}
</style>
