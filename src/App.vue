<template>
  <div class="text-center text-gray-300">
    <nav>
      <a href="/" class="m-auto m-5 text-lg">Bitcoin vs. Altcoins</a>
      <div class="m-auto m-5 text-sm text-center opacity-25">
        2.0.7. beta
      </div>
    </nav>
  </div>
  <router-view></router-view>
  <div class="p-5 m-6">
    <h2 class="text-xl font-bold">Auth State</h2>
    <pre class="text-xs text-white bg-black">{{  }}</pre>
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