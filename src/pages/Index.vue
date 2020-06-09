<template>
  <q-page class="flex flex-center content-stretch text-center">
    <count-down style="width: 100%" v-resize-text="{ ratio: 0.5 }" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onActivated } from '@vue/composition-api';
import ResizeText from 'vue-resize-text';
import { CountDown } from '../components/CountDown';

export default defineComponent({
  name: 'PageIndex',
  directives: {
    ResizeText
  },
  components: { CountDown },
  setup() {
    onActivated(() => {
      console.log('PageIndex onActivated');
      window.dispatchEvent(new Event('resize'));
    });
  }
});
</script>
