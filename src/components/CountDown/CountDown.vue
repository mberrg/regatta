<template>
  <div v-if="!started" class="countdown">Waiting setup</div>
  <div v-else class="countdown">
    <div style="font-size: 0.2em; ">
      {{ heading }}
    </div>
    <div>
      {{ isNegative ? '-' : '' }}{{ pad(hoursLeft, 2) }}:{{
        pad(minutesLeft, 2)
      }}:{{ pad(secondsLeft, 2) }}
    </div>
    <div style="font-size: 0.2em; ">
      {{ footer }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from '@vue/composition-api';
import { useCountDown } from './store';

function pad(num: number, size: number) {
  let s = String(num);
  while (s.length < (size || 2)) {
    s = '0' + s;
  }
  return s;
}

export default defineComponent({
  name: 'CountDown',

  setup() {
    const {
      currentHeat,
      numHeats,
      finnished,
      started,
      secondsLeft,
      minutesLeft,
      hoursLeft,
      isNegative
    } = useCountDown.getState();

    const heading = computed(() => {
      const heatTime = useCountDown.nextStartTime();

      if (!finnished.value) {
        if (currentHeat.value == 0) {
          return `First heat starting ${heatTime.value.toLocaleTimeString()}`;
        }
        return `Heat ${currentHeat.value +
          1} starting ${heatTime.value.toLocaleTimeString()}`;
      }
      return `Last heat started ${heatTime.value.toLocaleTimeString()}`;
    });

    const footer = computed(() => {
      if (!finnished.value) {
        if (currentHeat.value < 1) {
          return 'Waiting first start';
        }
        return `Heat ${currentHeat.value} of ${numHeats.value}`;
      }
      return `All heat started (${currentHeat.value} of ${numHeats.value})`;
    });

    return {
      pad,
      started,
      currentHeat,
      numHeats,
      heading,
      footer,
      isNegative,
      secondsLeft,
      minutesLeft,
      hoursLeft
    };
  }
});
</script>

<style lang="scss" scoped>
.countdown {
  line-height: 1;
}
</style>
