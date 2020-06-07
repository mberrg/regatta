<template>
  <q-page class="flex flex-center content-stretch text-center">
    <count-down style="width: 100%" v-resize-text="{ ratio: 0.5 }" />
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ResizeText from 'vue-resize-text';
import { CountDown } from '../components/CountDown';

export default Vue.extend({
  name: 'PageIndex',
  directives: {
    ResizeText
  },
  components: { CountDown }
});
</script>
