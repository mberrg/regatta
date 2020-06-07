<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
import { useCountDown, SetState } from 'components/CountDown';

export default defineComponent({
  name: 'App',
  setup() {
    return {};
  }
});
</script>
