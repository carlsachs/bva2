<template>
  <div class="bg-gray-900">
    <nav>
      <div class='p-5 mt-5'>
        <Particles
          id="tsparticles"
          :options="{
              background: {
                  color: {
                      value: '#121826'
                  }
              },
              fpsLimit: 40,
              interactivity: {
                  detectsOn: 'canvas',
                  events: {
                      onClick: {
                          enable: true,
                          mode: 'push'
                      },
                      onHover: {
                          enable: true,
                          mode: 'repulse'
                      },
                      resize: true
                  },
                  modes: {
                      bubble: {
                          distance: 400,
                          duration: 2,
                          opacity: 0.8,
                          size: 40,
                          speed: 2
                      },
                      push: {
                          quantity: 4
                      },
                      repulse: {
                          distance: 200,
                          duration: 0.4
                      }
                  }
              },
              particles: {
                  color: {
                      value: '#ffffff'
                  },
                  links: {
                      color: '#ffffff',
                      distance: 150,
                      enable: true,
                      opacity: 0.5,
                      width: 1
                  },
                  collisions: {
                      enable: true
                  },
                  move: {
                      direction: 'none',
                      enable: true,
                      outMode: 'bounce',
                      random: false,
                      speed: 2,
                      straight: false
                  },
                  number: {
                      density: {
                          enable: true,
                          value_area: 800
                      },
                      value: 80
                  },
                  opacity: {
                      value: 0.5
                  },
                  shape: {
                      type: 'circle'
                  },
                  size: {
                      random: true,
                      value: 5
                  }
              },
              detectRetina: true
          }"
        />
        <router-link to="/">
            <img class="mx-auto" width=200 alt="BvA" src="/bva_small.png"/>
        </router-link>
        <Particles
          id="tsparticles2"
          :options="{
              background: {
                  color: {
                      value: '#121826'
                  }
              },
              fpsLimit: 40,
              interactivity: {
                  detectsOn: 'canvas',
                  events: {
                      onClick: {
                          enable: true,
                          mode: 'push'
                      },
                      onHover: {
                          enable: true,
                          mode: 'repulse'
                      },
                      resize: true
                  },
                  modes: {
                      bubble: {
                          distance: 400,
                          duration: 2,
                          opacity: 0.8,
                          size: 40,
                          speed: 2
                      },
                      push: {
                          quantity: 4
                      },
                      repulse: {
                          distance: 200,
                          duration: 0.4
                      }
                  }
              },
              particles: {
                  color: {
                      value: '#ffffff'
                  },
                  links: {
                      color: '#ffffff',
                      distance: 150,
                      enable: true,
                      opacity: 0.5,
                      width: 1
                  },
                  collisions: {
                      enable: true
                  },
                  move: {
                      direction: 'none',
                      enable: true,
                      outMode: 'bounce',
                      random: false,
                      speed: 2,
                      straight: false
                  },
                  number: {
                      density: {
                          enable: true,
                          value_area: 800
                      },
                      value: 80
                  },
                  opacity: {
                      value: 0.5
                  },
                  shape: {
                      type: 'circle'
                  },
                  size: {
                      random: true,
                      value: 5
                  }
              },
              detectRetina: true
          }"
        />
      </div>
    </nav>
  </div>
  <router-view></router-view>
  <div class="text-center mx-6 flex flex-row items-center justify-center p-2 space-x-5 mb-5">
    <div class="text-cyan-200">
      <u>Disclaimer</u>: There is a very high degree of risk involved in trading crypto. 
      Past results are not indicative of future returns.
      This platform is for educational purposes only.
    </div>
  </div>
  <div class="text-center p-5 m-6 flex flex-row items-center justify-center p-2 space-x-5 mb-5">
    <router-link to="/about" class="text-gray-300 font-bold">About us</router-link> &nbsp;
    <a href="https://twitter.com/BitcoinvsAlts" target="_new" class="text-blue-500 font-bold"><img class="mx-auto" width=30 alt="Twitter" src="/twitter.png"/></a> &nbsp;
    <a href="https://github.com/bitcoinvsalts/node-binance-trader" class="text-green-500 font-bold" target="_new"><img class="mx-auto" width=20 alt="GitHub" src="/github.png"/></a> &nbsp;
    <a href="https://t.me/joinchat/lmQ_xPE0WBo5NzYx" class="text-green-500 font-bold" target="_new"><img class="mx-auto" width=20 alt="GitHub" src="/tg.png"/></a> &nbsp;
    <a href="https://discordapp.com/invite/4EQrEgj" target="_new" class="text-purple-500 font-bold"><img class="mx-auto" width=20 alt="Discord" src="/discord.png"/></a> &nbsp;
    <a href="email:support@bitcoinvsalts.com" class="text-green-500 font-bold" target="_new"><img class="mx-auto" width=20 alt="GitHub" src="/email.png"/></a> &nbsp;
    <a href="https://wallet.nimiq.com/nimiq:NQ38SDPGREC3USTALLCT87GQTCUYFH5L6PCQ" target="_new"><img class="mx-auto" width=20 alt="Nimiq" src="https://cryptologos.cc/logos/nimiq-nim-logo.svg?v=013"/></a>
    <router-link to="/addyourstrat" class="text-gray-300 font-bold">Add your strategy</router-link>
  </div>
  <div class="text-center text-gray-300 p-5 m-6 flex flex-row items-center justify-center p-2 space-x-5 mb-5">
    <div class="text-green-500">{{ btc && Number(btc.price).toFixed(2) }} usd</div> &nbsp;
    Bitcoin Vs. Alts © 2019 – 2021
  </div>
  <div class="text-center text-xs text-indigo-300 p-5 m-2 flex flex-row items-center justify-center p-2 space-x-5 mb-5">
    {{ stats.timing }} secs - 2.2.0
  </div>
</template>

<script lang="ts">

import { computed, inject } from "vue"
import { usePriceStore } from './stores/prices'
import { useProductStore } from './stores/products'
import { useKlineStore } from './stores/klines'


export default {
  name: "App",
  setup() {
    console.log("APP")
    const stats: any = inject("stats")
    console.log("---=-=--=-")
    const prices = usePriceStore()
    const products = useProductStore()
    const klines = useKlineStore()
    prices.getItems()
    klines.getItems()
    products.getItems()
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
#tsparticles {
  height: 200px;
}
#tsparticles2 {
  height: 200px;
}
</style>