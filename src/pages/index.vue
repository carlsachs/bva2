
<template>
    <div>


        <div class="mx-2">
            <div class="my-2 overflow-x-auto">
                <div class="py-2 align-middle inline-block min-w-full">
                    <div class="mx-2 my-4 p-4 border-2 border-blue-900 brounded-lg text-white relative">
                        <div class="text-2xl text-cyan-200 mt-3">
                            Our goal is to democratize access to the best crypto trading algorithms. 
                        </div>
                        <!--div class="text-xl text-cyan-200 mt-3">
                            We created this marketplace to fund the #1 <a href='https://bitcoinvsaltcoins.com' target="_new" class="underline">open forward testing platform</a>.
                        </div-->
                        <div class="text-xl text-cyan-200 mt-3">
                            We track the performance (PnL) of more than <router-link to="/signals" class="underline">1400 strategies</router-link>.
                        </div>
                        <div class="text-cyan-200 mt-3">
                            <u>Disclaimer</u>: There is a very high degree of risk involved in trading crypto. 
                            Past results are not indicative of future returns.
                            This platform is for <b>educational</b> purposes only.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h1 class="text-2xl text-white text-uppercase font-semibold mt-6">
            Top Strategies for the Past 
            <button @click="setDays(1)" :class="{ 'bg-indigo-900 bg-opacity-100':days==1, 'bg-indigo-900 bg-opacity-10':days!=1 }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <div class="text-green-500 text-xl font-semibold">24H</div>
            </button>
            <button @click="setDays(7)" :class="{ 'bg-indigo-900 bg-opacity-100':days==7, 'bg-indigo-900 bg-opacity-10':days!=7 }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <div class="text-green-500 text-xl font-semibold">One Week</div>
            </button>
            <button @click="setDays(4*7)" :class="{ 'bg-indigo-900 bg-opacity-100':days==4*7, 'bg-indigo-900 bg-opacity-10':days!=4*7 }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <div class="text-green-500 text-xl font-semibold">One Month</div>
            </button>
            <button @click="setDays(4*7*12)" :class="{ 'bg-indigo-900 bg-opacity-100':days==4*7*12, 'bg-indigo-900 bg-opacity-10':days!=4*7*12 }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <div class="text-green-500 text-xl font-semibold">One Year</div>
            </button>
        </h1>
        <div v-if="!strats" class="my-4 text-gray-300">Loading... <img class="mx-auto mb-5" src="/spinner.svg" /></div>
        <div v-if="strats" v-for="(row, i) in strats" :key="row.id">
            <div class="mx-2">
                <div class="my-2 overflow-x-auto">
                    <div class="py-2 align-middle inline-block min-w-full">
                        <div class="mx-2 my-4 py-4 border-2 border-blue-900 brounded-lg text-white relative">
                            <router-link :to="/strat/+row.id">
                                <img v-if="row.logo" class="mx-auto my-10 object-contain md:object-scale-down" width=200 :alt="row.stratname" :src="row.logo"/>
                                <div :class="{ 'text-green-500': Number(row.sumpnl)>0, 'text-red-500': Number(row.sumpnl)<0 }" class="text-xl font-bold">{{ Number(row.sumpnl).toFixed(2) }}%</div>
                            </router-link>
                            <button v-if="row.forsale" @click="subscribe" class="my-4 font-bold mx-auto text-xl items-center bg-indigo-900 bg-opacity-10 shadow-xl px-6 py-5 rounded-lg cursor-pointer hover:bg-opacity-100 transition">
                                <div class="text-green-500 text-xl font-semibold">Subscribe</div>
                            </button>
                            <h1 :class="{ 'text-green-500': row.forsale, 'text-gray-500': !row.forsale }" class="text-xl">
                                <router-link :to="/strat/+row.id">{{ row.stratname }}</router-link>
                            </h1>
                            {{ row.description }}
                        </div>       
                    </div>
                </div>
            </div>
        </div>

        <div class="p-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-5">
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
                <a href="https://www.binance.com/?ref=W5BD94FW" target="_new">
                    <img width=200 class="mx-auto mb-5" alt="BvA Discord" src="/binance.svg" />
                    <div class="text-2xl text-white">Official Binance Broker</div>
                </a>
            </div>
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
                <a href="https://bitcoinvsaltcoins.com" target="_new">
                    <img width=132 class="mx-auto mb-5" alt="Strategy Incubator" src="/creator.png" />
                    <div class="text-2xl text-white">Our Strategy Incubator</div>
                </a>
            </div>
        </div>
        <div class="p-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-5">
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
                <a href="https://discordapp.com/invite/4EQrEgj" target="_new">
                    <img width=132 class="mx-auto mb-5" alt="BvA Discord" src="/discord.png" />
                    <div class="text-2xl text-white">1200+ Discord Members</div>
                </a>
            </div>
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
                <a href="https://github.com/bitcoinvsalts/node-binance-trader" target="_new">
                    <img width=102 class="mx-auto mt-3 mb-10" alt="BvA GitHub" src="/github.png" />
                    <div class="text-2xl text-white">900+ GitHub Stars</div>
                </a>
            </div>
        </div>

    </div>
</template>

<script lang="ts">

import { reactive, computed, toRefs, onMounted, defineComponent, watch, inject } from "vue"
import axios from "~/utils/axios"
import moment from "moment"
import { useRouter } from "vue-router"
import { useRequest } from 'vue-request'
import { usePriceStore } from '../stores/prices'
import { startStats, endStats } from '~/modules/stats'
import { useHead } from '@vueuse/head'

export default defineComponent({
  name: "strats",
  setup: () => {
    startStats(Date.now())

    useHead({
        title: computed( () => "Bitcoin vs. Alts"),
        meta: [
            {
            name: `description`,
            content: computed(() => "The goal of Bitcoin vs. Alts aka BVA is to democratize access to the best crypto trading algorithms."),
            },
        ],
    })
    
    const prices = usePriceStore()

    const router = useRouter()

    const openStrat = (id) => {
        router.push("/strat/"+ id)
    }

    const auth0: any = inject("auth0")

    const state = reactive({
        days: 7,
        ///////// ///////// ///////// /////////
        auth0,
        ///////// ///////// ///////// /////////
    })

    async function setDays(days) {
        console.log("setDays", days)
        state.days = days
        run()
    }

    onMounted(() => {
      run()
    })

    async function subscribe() {
        console.log("subscribe", !auth0.state.isAuthenticated)
        if (!auth0.state.isAuthenticated) {
            console.log("-0-0-0-0-0-0-0-", window.location.href)
            //auth0.client.loginWithRedirect({ appState: { targetUrl: window.location.href } })
            await auth0.client.loginWithRedirect({ appState: { targetUrl: '/subscriptions' } })  
            // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#loginwithredirect   
            //await auth0.client.loginWithPopup()
        }
        else {
            router.push("/subscriptions")
        }
    }

    const getStrats = () => {
        console.log("getStrats...", state.days)
        return axios.get('/api/topstrats?days='+state.days)
    } 

    const { data: strats, run } = useRequest( () =>  getStrats(), {
        cacheKey: 'strats',
        manual: true,
        //cacheTime: 300000,
        pollingInterval: 20000,
        formatResult: res => {
            //console.log(res)
            return res.data
        },
        onSuccess: (res) => {
            console.log("34411--1-1>", res.length)
        }
    })
    
    watch(strats, (strats) => {
        console.log("strats...", strats.length)
        endStats(Date.now())
    })

    return {
      ...toRefs(state),
      moment,
      subscribe,
      strats,
      setDays
    }
  },
})
</script>

<style lang="postcss" scoped>
</style>