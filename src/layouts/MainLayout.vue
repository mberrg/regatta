<template>
  <q-layout
    view="lhr lpR lfr"
    v-bind:class="{ active: isActive, normal: !isActive }"
  >
    <q-header class="bg-white no-shadow text-primary" height-hint="50">
      <q-toolbar>
        <q-select
          dense
          borderless
          v-model="heat"
          :options="heats"
          emit-value
          map-options
          label="Sound horn for heat"
          class="col-auto"
          style="width: 200px"
        />
        <q-space />
        <q-btn
          v-if="$route.name == 'admin'"
          flat
          round
          dense
          color="black"
          icon="home"
          :to="{ name: 'home' }"
        />
        <q-btn
          v-else
          flat
          color="black"
          round
          dense
          icon="build"
          :to="{ name: 'admin' }"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {
  defineComponent,
  watchEffect,
  reactive,
  toRefs,
  computed
} from '@vue/composition-api';

import { useCountDown } from '../components/CountDown';
declare global {
  interface Window {
    allOn?: () => void;
    allOff?: () => void;
  }
}

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const {
      started,
      secondsLeft,
      minutesLeft,
      hoursLeft,
      finnished,
      numHeats,
      currentHeat
    } = useCountDown.getState();
    let timeout: NodeJS.Timeout | undefined = undefined;
    const state = reactive({ isActive: false, heat: 0 });
    const horn = new Audio('statics/horn.wav'); // Must be static and not loading when tab idle

    const soundHorn = () => {
      horn.play();
      timeout = undefined;
    };

    watchEffect(() => {
      if (
        started.value &&
        !finnished.value &&
        hoursLeft.value == 0 &&
        secondsLeft.value == 0
      ) {
        if (
          minutesLeft.value == 5 ||
          minutesLeft.value == 4 ||
          minutesLeft.value == 1 ||
          minutesLeft.value == 0
        ) {
          //state.heat == 0  => all heats
          if (state.heat == 0 || state.heat == currentHeat.value) {
            if (window.allOn && window.allOff) {
              // Has horn functions (running on electron)
              setTimeout(window.allOn, 10); //TODO handle overlaping timeouts
              setTimeout(window.allOn, 1000);
            } else {
              if (!timeout) timeout = setTimeout(soundHorn, 10); // Call this async
            }
          }

          state.isActive = true; // change colors on screen
          setTimeout(() => (state.isActive = false), 1000); // Call this async
        }
      }
    });
    const heats = computed(() => {
      const heats = [
        {
          label: 'None',
          value: -1
        },
        {
          label: 'All',
          value: 0
        }
      ];
      for (let i = 1; i <= numHeats.value; i++) {
        heats.push({
          label: `Heat ${i}`,
          value: i
        });
      }
      return heats;
    });

    return { ...toRefs(state), heats };
  }
});
</script>

<style lang="scss" scoped>
.normal {
  background: white;
  color: black;
}

.active {
  color: white;
  background: black;
}
</style>
