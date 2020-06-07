<template>
  <q-layout view="lhr lpR lfr">
    <q-header class="bg-white no-shadow text-primary" height-hint="50">
      <q-toolbar>
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
import Vue from 'vue';

export default Vue.extend({
  name: 'MainLayout',

  components: {},

  data() {
    return {};
  }
});
</script>
