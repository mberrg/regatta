<template>
  <q-page class="fit column items-center">
    <div class="col-auto q-gutter-md q-pb-md">
      <q-input
        v-model.number="numHeats"
        label="Number of heats"
        type="number"
        filled
        style="width: 200px"
      />
      <q-input
        v-model.number="heatDelay"
        label="Delay between heats (min)"
        type="number"
        filled
        style="width: 200px"
      />
      <q-input
        filled
        v-model="startTime"
        mask="time"
        :rules="['time']"
        style="width: 200px"
      >
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="startTime" format24h />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-btn
        label="Start"
        color="primary"
        unelevated
        style="width: 200px"
        @click="start"
      />
    </div>
    <div
      class="col  flex flex-center content-stretch text-center"
      style="width: 100%"
    >
      <count-down class="fit  bg-red" v-resize-text="{ ratio: 0.5 }" />
    </div>
  </q-page>
</template>

<script lang="ts">
//<count-down class="col" v-resize-text="{ ratio: 0.5 }" />
//<div>foo</div>
import {
  defineComponent,
  computed,
  reactive,
  toRefs
} from '@vue/composition-api';
import { date } from 'quasar';
import ResizeText from 'vue-resize-text';

import { CountDown, useCountDown, SetState } from 'components/CountDown';

export default defineComponent({
  name: 'AdminPage',
  directives: {
    ResizeText
  },
  components: {
    CountDown
  },
  setup() {
    const state = reactive({
      numHeats: 3,
      heatDelay: 15,
      startTime: '00:00'
    });

    const start = async () => {
      const hour = parseInt(state.startTime.split(':')[0]);
      const minute = parseInt(state.startTime.split(':')[1]);

      const timeNow = new Date();
      let startTime = new Date();
      const hourNow = timeNow.getHours();

      if (hour < hourNow) {
        // next day
        startTime = date.addToDate(startTime, { days: 1 });
      }

      const startTimeMs = date
        .adjustDate(startTime, {
          hours: hour,
          minutes: minute,
          seconds: 0,
          milliseconds: 0
        })
        .valueOf();

      const newState: SetState = {
        startTimeMs: startTimeMs,
        nextHeat: startTimeMs - new Date().valueOf(),
        numHeats: state.numHeats,
        delayMinutesBetweenHeats: state.heatDelay,
        started: true,
        finnished: false,
        currentHeat: 1
      };
      const location = 'http://localhost/newState';
      const settings = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newState)
      };
      try {
        const fetchResponse = await fetch(location, settings);
        const data = await fetchResponse.json();
        return data;
      } catch (e) {
        console.log(e);
      }
    };
    return { ...toRefs(state), start };
  }
});
</script>
