<template>
  <div class="bg-gray-900">
    <nav>
      <div class='p-5 mt-5'>
        <img class="mx-auto" width=200 alt="BvA" src="/bva_small.png"/>
      </div>
    </nav>
  </div>
  <router-view></router-view>
  <div class="text-center p-5 m-6 flex flex-row items-center justify-center p-2 space-x-5 mb-5">
    <a href="https://twitter.com/BitcoinvsAlts" target="_new" class="text-blue-500">@BitcoinvsAlts</a> &nbsp;
    <a href="https://github.com/jsappme/node-binance-trader" class="text-green-500" target="_new">NBT</a> &nbsp;
    <a href="https://discordapp.com/invite/4EQrEgj" target="_new" class="text-purple-500">Discord Server</a>
  </div>
  <div class="text-center text-gray-300 p-5 m-6 flex flex-row items-center justify-center p-2 space-x-5 mb-5">
    Bitcoin vs. Alts © 2019–2021 
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