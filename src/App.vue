<template>
  <div class="bg-gray-900">
    <nav>
      <div class='p-5 mt-5'>
        <img class="mx-auto" width=200 alt="BvA" src="bva_small.png"/>
      </div>
    </nav>
  </div>
  <router-view></router-view>
  <div class="text-center text-gray-300 p-5 m-6">
    <h2 class="">Footer</h2>
  </div>
</template>

<script lang="ts">

import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "App",
  setup() {
    //const { state } = useStore();
    //const authState = computed(() => state.auth);
    //return { authState };
    return;
  },
};
</script>

<style lang="postcss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @apply dark:text-gray-100;
}
.dark body {
  @apply bg-gray-800;
}
</style>