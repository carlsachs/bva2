
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
                            In addition to tracking and comparing <a href='https://bitcoinvsaltcoins.com' target="_new"><b class="text-green-500">{{ stratcount}}</b></a> <b>crypto auto trading strategies</b>,
                        </div>
                        <div class="text-xl text-cyan-200 mt-3">
                            we offer <b><span class="text-yellow-300">Binance</span> auto trading subscriptions</b> to the best ones.
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

        <img class="mx-auto my-20" width=60 alt="Binance" src="/binance.svg" />

        <h1 class="text-2xl text-white text-uppercase font-semibold mt-6">
            <button @click="setBaseBTC" :class="{ 'bg-indigo-900 bg-opacity-100':baseAsset=='BTC', 'bg-indigo-900 bg-opacity-10':baseAsset!='BTC'}" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <div class="text-green-500 text-xl font-semibold">BTC</div>
            </button>
            <button @click="setBaseUSDT" :class="{ 'bg-indigo-900 bg-opacity-100':baseAsset=='USDT', 'bg-indigo-900 bg-opacity-10':baseAsset!='USDT'}" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <div class="text-green-500 text-xl font-semibold">USDT</div>
            </button>
            Top Strategies for the Past 
            <button @click="setDays" :class="{ 'bg-indigo-900 bg-opacity-100':this.$route.query.d==7, 'bg-indigo-900 bg-opacity-10':this.$route.query.d!=7 }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <router-link class="text-green-500 text-xl font-semibold" to="?d=7">One Week</router-link>
            </button>
            <button @click="setDays" :class="{ 'bg-indigo-900 bg-opacity-100':(this.$route.query.d==31 || !this.$route.query.d), 'bg-indigo-900 bg-opacity-10':(this.$route.query.d!=31 && this.$route.query.d) }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <router-link class="text-green-500 text-xl font-semibold" to="?d=31">One Month</router-link>
            </button>
            <button @click="setDays" :class="{ 'bg-indigo-900 bg-opacity-100':this.$route.query.d==180, 'bg-indigo-900 bg-opacity-10':this.$route.query.d!=180 }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <router-link class="text-green-500 text-xl font-semibold" to="?d=180">6 Months</router-link>
            </button>
            <button @click="setDays" :class="{ 'bg-indigo-900 bg-opacity-100':this.$route.query.d==365, 'bg-indigo-900 bg-opacity-10': this.$route.query.d!=365}" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <router-link class="text-green-500 text-xl font-semibold" to="?d=365">One Year</router-link>
            </button>
        </h1>
        <div v-if="!strats" class="my-4 text-gray-300">Loading... <img class="mx-auto mb-5" src="/spinner.svg" /></div>


        <div v-if="true" class="mt-4 p-4">
            <div class="flex flex-col">
                <div class="-my-2 overflow-x-auto">
                    <div class="py-2 align-middle inline-block min-w-full">
                        <div class=" overflow-hidden border-1 border-blue-900 rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">#</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Logo</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Name</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Portfolio PnL</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Max. Open Trades</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Total PnL</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Win Rate</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Tot. Trades</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Avg. PnL</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Price per month</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Market</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Base Asset</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="strats" class="divide-y divide-gray-200 hover:bg-blue-900 hover:bg-opacity-40 visited:bg-blue-900 visited:bg-opacity-40" v-for="(row, i) in strats" :key="row.id">
                                    <tr>
                                        <td>
                                            <b class="text-blue-400">{{i+1}}.</b>
                                        </td>
                                        <td>
                                            <router-link :to="/strat/+row.id">
                                                <img v-if="row.logo" class="mx-auto object-contain md:object-scale-down" width=200 :alt="row.stratname" :src="row.logo"/>
                                            </router-link>                                        
                                        </td>
                                        <td>
                                            <h1 :class="{ 'text-blue-500': row.forsale, 'text-gray-500': !row.forsale }" class="text-md font-semibold m-3">
                                                <router-link :to="/strat/+row.id">{{ row.stratname }}</router-link>
                                            </h1>
                                        </td>
                                        <td>
                                            <router-link :to="/strat/+row.id" class="font-bold text-sm text-green-500 font-semibold">{{ Number(row.portfoliopnl).toFixed(2) }}%</router-link>
                                        </td>
                                        <td>
                                            <router-link :to="/strat/+row.id" class="font-bold text-sm text-green-500 font-semibold">{{ row.max_concurrent }}</router-link>
                                        </td>
                                        <td>
                                            <router-link :to="/strat/+row.id" class="font-bold text-sm text-green-500 font-semibold">{{ Number(row.sumpnl).toFixed(2) }}%</router-link>
                                        </td>
                                        <td>
                                            <router-link :to="/strat/+row.id" class="font-bold text-sm text-green-500 font-semibold">{{ (Number(row.countppnl)*100/Number(row.countpnl)).toFixed(2) }}%</router-link>                                        </td>
                                        <td>
                                            <router-link :to="/strat/+row.id" class="font-bold text-sm text-green-500 font-semibold">{{ Number(row.countpnl).toFixed(0) }}</router-link>
                                        </td>
                                        <td>
                                            <router-link :to="/strat/+row.id" class="font-bold text-sm text-green-500 font-semibold">{{ Number(row.avgpnl).toFixed(2) }}%</router-link>
                                        </td>
                                        <td>
                                            <div class="text-white">
                                                <div class="font-bold text-green-200 text-sm font-semibold">
                                                    {{ _.find(products.items, {stratid:row.id})?.price }} {{ _.find(products.items, {stratid:row.id})?.currency }}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <button class="font-bold mx-1 text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                                                <router-link :to="/strat/+row.id" class="font-bold text-green-500 font-semibold">{{ _.find(products.items, {stratid:row.id})?.mode }}</router-link>
                                            </button>
                                        </td>
                                        <td>
                                            <button class="font-bold mx-1 text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                                                <router-link :to="/strat/+row.id" class="font-bold text-green-500 font-semibold">{{ _.find(products.items, {stratid:row.id})?.base_asset }}</router-link>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
import _ from "lodash"
import moment from "moment"
import { useRouter } from "vue-router"
import { useRequest } from 'vue-request'
import { usePriceStore } from '../stores/prices'
import { startStats, endStats } from '~/modules/stats'
import { useHead } from '@vueuse/head'
import { useProductStore } from '~/stores/products'


export default defineComponent({
  name: "strats",
  setup: () => {
    startStats(Date.now())

    useHead({
        title: computed( () => "Bitcoin vs. Alts : Top Crypto Auto Trading Algorithms"),
        meta: [
            {
            name: `description`,
            content: computed( () => "Our goal is to democratize access to the best crypto auto trading algorithms. We track, compare and sell subscriptions to the best crypto auto trading strategies in the world."),
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
        days: 4*7*12,
        stratcount: 0,
        auth0,
        products: [],
        baseAsset: 'USDT',
    })

    state.products = useProductStore()

    async function setDays() {
        console.log("setDays")
        run()
    }

    async function setBaseBTC() {
        console.log("setBaseBTC")
        state.baseAsset = 'BTC'
        run()
    }

    async function setBaseUSDT() {
        console.log("setBaseUSDT")
        state.baseAsset = 'USDT'
        run()
    }

    const getStratCount = async () => {
      const res = await axios.get('/api/stratcount')
      state.stratcount = parseInt(res.data.max)
      console.log("getStratCount:", state.stratcount)
    }

    onMounted( async () => {
        await getStratCount()
        run()
    })

    async function subscribe(row) {
        router.push("/strat/"+ row.id)
        /*
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
        */
    }

    const getStrats = () => {
        console.log("getStrats...", router.currentRoute.value.query.d)
        return axios.get('/api/topstrats?days='+(router.currentRoute.value.query.d?router.currentRoute.value.query.d:31)+'&base='+state.baseAsset)
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
        endStats(Date.now())
    })

    return {
      ...toRefs(state),
      moment,
      subscribe,
      strats,
      setDays,
      _,
      setBaseBTC,
      setBaseUSDT,
    }
  },
})
</script>

<style lang="postcss" scoped>
</style>