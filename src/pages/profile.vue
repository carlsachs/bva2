<template>
  <div class="text-center bg-black text-gray-300">
    <h1>Profile</h1>
    <span>{{ auth0.state }}</span>
  </div>
</template>

<script setup lang="ts">

import { inject } from "vue"

const auth0: any = inject("auth0")

</script>

<style scoped>
</style>

<route lang="yaml">
meta:
  layout: default
</route>