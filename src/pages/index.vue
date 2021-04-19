<template>
  <div>
    
    <p class="text-4xl">
      <img src="/bva.png" alt="Bitcoin vs. Altcoins" height=40 class="inline-block"/>
    </p>

    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank">
        Bitcoin Vs. Altcoins
      </a>
    </p>

    <p>
      <em class="text-sm opacity-75">intro.desc</em>
    </p>

    <div class="p-5 m-6">
      <h2 class="text-xl font-bold">Auth State</h2>
      <pre class="text-xs text-white bg-black">{{ authState }}</pre>
    </div>

  </div>
</template>

<script lang="ts">
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="postcss" scoped>
</style>