<template>
  <q-page class="fit column items-center">
    <div class="col-auto q-gutter-md q-pb-md">
      <q-input
        v-model="password"
        label="Admin password"
        type="password"
        filled
        style="width: 200px"
      />
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
        :min="1"
        filled
        style="width: 200px"
        hint=">5min for full horn sequence"
      />
      <q-input
        filled
        v-model="startTime"
        mask="time"
        :rules="['time']"
        style="width: 200px"
        label="Start time"
      >
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="startTime" format24h />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <div>
        <q-btn
          label="Start"
          color="primary"
          unelevated
          style="width: 200px"
          @click="start"
        />
      </div>
      <div v-if="started">
        <q-btn
          label="Stop timers"
          color="red"
          unelevated
          style="width: 200px"
          @click="reset"
        />
      </div>
    </div>
    <div
      class="col  flex flex-center content-stretch text-center"
      style="width: 100%"
    >
      <count-down
        class="fit"
        v-resize-text="{ ratio: 0.5, maxFontSize: '150px' }"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
//<count-down class="col" v-resize-text="{ ratio: 0.5 }" />
//<div>foo</div>
import {
  defineComponent,
  reactive,
  toRefs,
  onActivated
} from '@vue/composition-api';
import { date } from 'quasar';
import ResizeText from 'vue-resize-text';

import { CountDown, SetState, useCountDown } from 'components/CountDown';

const location = 'https://regattastart.herokuapp.com';

export default defineComponent({
  name: 'AdminPage',
  directives: {
    ResizeText
  },
  components: {
    CountDown
  },

  setup() {
    const {
      numHeats,
      delayMinutesBetweenHeats,
      startTimeMs
    } = useCountDown.getState();
    const startime = new Date(startTimeMs.value);

    const state = reactive({
      numHeats: numHeats.value,
      heatDelay: delayMinutesBetweenHeats.value,
      startTime: `${startime.getHours()}:00`,
      password: ''
    });

    onActivated(() => {
      console.log('Admin onActivated');
      window.dispatchEvent(new Event('resize'));
    });

    const { started } = useCountDown.getState();
    const reset = async () => {
      try {
        const fetchResponse = await fetch(location + '/reset', {
          method: 'POST',
          mode: 'cors', // no-cors, *cors, same-origin
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reset: true })
        });
        await fetchResponse.json();
      } catch (e) {
        console.log(e);
      }
    };
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
        serverNow: 0,
        startTimeMs: startTimeMs,
        numHeats: state.numHeats,
        delayMinutesBetweenHeats: state.heatDelay,
        started: true,
        password: state.password
      };

      try {
        const fetchResponse = await fetch(location + '/newState', {
          method: 'POST',
          mode: 'cors', // no-cors, *cors, same-origin
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newState)
        });
        await fetchResponse.json();
      } catch (e) {
        console.log(e);
      }
    };
    return { ...toRefs(state), start, reset, started };
  }
});
</script>
