<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from '@vue/composition-api';

export default defineComponent({
  name: 'App',
  setup() {
    return {};
    onUnmounted(() => {
      console.log('App unmounted!');
    });
  }
});
</script>
