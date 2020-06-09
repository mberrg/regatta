<template>
  <div v-if="!started" class="countdown">Waiting setup</div>
  <div v-else class="countdown">
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
      currentHeat,
      numHeats,
      finnished,
      started
    } = useCountDown.getState();

    const countdown = useCountDown.getTimeleft();

    const heading = computed(() => {
      const heatTime = useCountDown.nextStartTime();
      if (currentHeat.value == 0) {
        return `First heat starting ${heatTime.value.toLocaleTimeString()}`;
      }
      if (!finnished.value) {
        return `Heat ${currentHeat.value +
          1} starting ${heatTime.value.toLocaleTimeString()}`;
      }
      return `Last heat started ${heatTime.value.toLocaleTimeString()}`;
    });

    const footer = computed(() => {
      if (currentHeat.value < 1) {
        return 'Waiting first start';
      }
      if (!finnished.value) {
        return `Heat ${currentHeat.value} of ${numHeats.value}`;
      }
      return `All heat started (${currentHeat.value + 1} of ${numHeats.value})`;
    });

    return {
      started,
      currentHeat,
      numHeats,
      heading,
      footer,
      countdown
    };
  }
});
</script>

<style lang="scss" scoped>
.countdown {
  line-height: 1;
}
</style>
