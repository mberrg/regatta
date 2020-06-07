<template>
  <q-page class="flex flex-center text-center">
    <div class="q-gutter-md">
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
    <count-down style="width: 100%" v-resize-text="{ ratio: 0.5 }" />
  </q-page>
</template>

<script>
import { date } from 'quasar';
import ResizeText from 'vue-resize-text';
import CountDown from '../components/CountDown';

export default {
  name: 'AdminPage',
  directives: {
    ResizeText
  },
  components: {
    CountDown
  },
  data() {
    return {
      numHeats: 3,
      heatDelay: 15,
      startTime: '00:00'
    };
  },
  methods: {
    start() {
      this.$store.commit('countdown/mutateNumHeats', this.numHeats);
      this.$store.commit('countdown/mutateHeatDelay', this.heatDelay);

      const hour = parseInt(this.startTime.split(':')[0]);
      const minute = parseInt(this.startTime.split(':')[1]);

      const timeNow = new Date();
      let startTime = new Date();
      const hourNow = timeNow.getHours();

      if (hour < hourNow) {
        // next day
        startTime = date.addToDate(startTime, { days: 1 });
      }

      startTime = date.adjustDate(startTime, {
        hours: hour,
        minutes: minute,
        seconds: 0,
        milliseconds: 0
      });

      this.$store.dispatch('countdown/setStarttime', startTime);
    }
  }
};
</script>
