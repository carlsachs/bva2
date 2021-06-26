<template>
  <div class="bg-gray-900">
    <nav>
      <div class='p-5 mt-5'>
        <router-link to="/">
          <img class="mx-auto" width=200 alt="BvA" src="/bva_small.png"/>
        </router-link>
      </div>
    </nav>
  </div>
  <router-view></router-view>
  <div class="text-center p-5 m-6 flex flex-row items-center justify-center p-2 space-x-5 mb-5">
    <router-link to="/about" class="text-gray-300 font-bold">About us</router-link> &nbsp;
    <a href="https://twitter.com/BitcoinvsAlts" target="_new" class="text-blue-500 font-bold"><img class="mx-auto" width=30 alt="Twitter" src="/twitter.png"/></a> &nbsp;
    <a href="https://github.com/bitcoinvsalts/node-binance-trader" class="text-green-500 font-bold" target="_new"><img class="mx-auto" width=20 alt="GitHub" src="/github.png"/></a> &nbsp;
    <a href="https://t.me/joinchat/lmQ_xPE0WBo5NzYx" class="text-green-500 font-bold" target="_new"><img class="mx-auto" width=20 alt="GitHub" src="/tg.png"/></a> &nbsp;
    <a href="https://discordapp.com/invite/4EQrEgj" target="_new" class="text-purple-500 font-bold"><img class="mx-auto" width=20 alt="Discord" src="/discord.png"/></a> &nbsp;
    <router-link to="/about" class="text-gray-300 font-bold">Contact us</router-link>
  </div>
  <div class="text-center text-gray-300 p-5 m-6 flex flex-row items-center justify-center p-2 space-x-5 mb-5">
    <div class="text-green-500">{{ btc && Number(btc.price).toFixed(2) }} usd</div> &nbsp;
    Bitcoin Vs. Alts © 2019 – 2021
  </div>
  <div class="text-center text-xs text-indigo-300 p-5 m-2 flex flex-row items-center justify-center p-2 space-x-5 mb-5">
    {{ stats.timing }} secs - 2.1.0
  </div>
</template>

<script lang="ts">

import { computed, inject } from "vue"
import { usePriceStore } from './stores/prices'
import { useKlineStore } from './stores/klines'


export default {
  name: "App",
  setup() {
    console.log("APP")

    const stats: any = inject("stats")
    console.log("---=-=--=-")
    const prices = usePriceStore()
    const klines = useKlineStore()
    prices.getItems()
    klines.getItems()
    //const prices: any = inject("prices")
    const btc = computed( () => prices.items.find(e => e.symbol === 'BTCUSDT') )
    return {
      btc,
      stats
    }
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