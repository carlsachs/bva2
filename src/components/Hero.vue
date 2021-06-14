<template>
  <div class="p-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-5">
    <div class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">
      <a href="https://discordapp.com/invite/4EQrEgj" target="_new">
        <img class="mx-auto mb-5" alt="BvA Discord" src="/discord.png" />
        <div class="text-5xl text-white">+1250 Discord Members</div>
      </a>
    </div>
    <div class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">
      <a href="https://github.com/jsappme/node-binance-trader" target="_new">
        <img class="mx-auto mt-5 mb-13" alt="BvA GitHub" src="/github.png" />
        <div class="text-5xl text-white">+820 GitHub Stars</div>
      </a>
    </div>
  </div>
</template>


<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent } from "vue"
import axios from "~/utils/axios"

export default defineComponent({
  name: "Hero",
  setup: () => {

    const state = reactive({
        rows: [],
    })

    onMounted(() => {
        
    })
    
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style>
</style>
