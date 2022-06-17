
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



        <div ref="myEl" class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
            <h1 class="text-2xl mb-7 text-uppercase font-semibold">Strat Of The Month: <router-link to="/strat/2680" class="text-green-500">{{ stratname }}</router-link></h1>
            <apexchart ref="stratchart" type="area" height="400" :options="chartOptions" :series="series"></apexchart>
        </div>



        <h1 class="text-2xl text-white text-uppercase font-semibold mt-12">
            Top Strats 
            <button @click="setDays" :class="{ 'bg-indigo-900 bg-opacity-100':this.$route.query.d==7, 'bg-indigo-900 bg-opacity-10': this.$route.query.d!=7 }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <router-link class="text-green-500 text-xl font-semibold" to="?d=7">One Week</router-link>
            </button>
            <button @click="setDays" :class="{ 'bg-indigo-900 bg-opacity-100':(this.$route.query.d==31||!this.$route.query.d), 'bg-indigo-900 bg-opacity-10': (this.$route.query.d!=31 && this.$route.query.d) }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <router-link class="text-green-500 text-xl font-semibold" to="?d=31">One Month</router-link>
            </button>
            <button @click="setDays" :class="{ 'bg-indigo-900 bg-opacity-100':this.$route.query.d==180, 'bg-indigo-900 bg-opacity-10': this.$route.query.d!=180 }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <router-link class="text-green-500 text-xl font-semibold" to="?d=180">6 Months</router-link>
            </button>
            <button @click="setDays" :class="{ 'bg-indigo-900 bg-opacity-100':this.$route.query.d==365, 'bg-indigo-900 bg-opacity-10': this.$route.query.d!=365}" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <router-link class="text-green-500 text-xl font-semibold" to="?d=365">One Year</router-link>
            </button>
            <button @click="setSubOnly" :class="{ 'bg-indigo-900 bg-opacity-100':subOnly, 'bg-indigo-900 bg-opacity-10':!subOnly}" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <div class="text-green-500 text-xl font-semibold">Sub Only</div>
            </button>
            <button v-if="subOnly" @click="setBaseBTC" :class="{ 'bg-indigo-900 bg-opacity-100':baseAsset=='BTC'||!baseAsset, 'bg-indigo-900 bg-opacity-10':baseAsset!='BTC'&&baseAsset}" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <div class="text-green-500 text-xl font-semibold">BTC</div>
            </button>
            <button v-if="subOnly" @click="setBaseUSDT" :class="{ 'bg-indigo-900 bg-opacity-100':baseAsset=='USDT'||!baseAsset, 'bg-indigo-900 bg-opacity-10':baseAsset!='USDT'&&baseAsset}" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <div class="text-green-500 text-xl font-semibold">USDT</div>
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
                                        <th v-if="subOnly" class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Portfolio PnL</div>
                                        </th>
                                        <th v-if="!subOnly" class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Total PnL</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Currently Open</div>
                                        </th>
                                        <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="text-center">Max. Open Trades</div>
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
                                                <img v-if="row.logo" class="mx-auto object-contain md:object-scale-down my-2" width=200 :alt="row.stratname" :src="row.logo"/>
                                            </router-link>                                        
                                        </td>
                                        <td>
                                            <h1 :class="{ 'text-blue-500': row.forsale, 'text-gray-500': !row.forsale }" class="text-md font-semibold m-3">
                                                <router-link :to="/strat/+row.id">{{ row.stratname }}</router-link>
                                            </h1>
                                        </td>
                                        <td v-if="subOnly">
                                            <router-link :to="/strat/+row.id" class="font-bold text-sm text-green-500 font-semibold">{{ Number(row.portfoliopnl).toFixed(2) }}%</router-link>
                                        </td>
                                        <td v-if="!subOnly">
                                            <router-link :to="/strat/+row.id" class="font-bold text-sm text-green-500 font-semibold">{{ Number(row.sumpnl).toFixed(2) }}%</router-link>
                                        </td>
                                        <td>
                                            <router-link :to="/strat/+row.id" class="font-bold text-sm text-green-500 font-semibold">{{ row.open_count }}</router-link>
                                        </td>
                                        <td>
                                            <router-link :to="/strat/+row.id" class="font-bold text-sm text-green-500 font-semibold">{{ row.max_concurrent }}</router-link>
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
                                                <router-link :to="/strat/+row.id" class="font-bold text-green-200 text-sm font-semibold">
                                                    {{ _.find(products.items, {stratid:row.id})?.price }} {{ _.find(products.items, {stratid:row.id})?.currency }}
                                                </router-link>
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
                <a href="https://thesupertrades.com/" target="_new">
                    <img width=132 class="mx-auto mb-5" alt="Strategy Incubator" src="/super_trades_logo.png" />
                    <div class="text-2xl text-white">The Super Trades</div>
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

import { onMounted, reactive, ref, computed, toRefs, defineComponent, watch, inject } from "vue"
import axios from "~/utils/axios"
import _ from "lodash"
import moment from "moment"
import { useRouter } from "vue-router"
import { useRequest } from 'vue-request'
import { usePriceStore } from '../stores/prices'
import { useProductStore } from '../stores/products'
import { startStats, endStats } from '~/modules/stats'
import { useHead } from '@vueuse/head'
import { useProductStore } from '~/stores/products'
import BigNumber from 'bignumber.js'

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

    /////////// /////////// ///////////

    const stratchart = ref(null)

    const openSignal = (row) => {
        router.push("/signal/"+ row.id)
    }

    /////////// /////////// ///////////
    
    const prices = usePriceStore()

    const router = useRouter()

    const openStrat = (id) => {
        router.push("/strat/"+ id)
    }

    const auth0: any = inject("auth0")

    const state = reactive({
        days: 31,
        stratcount: 0,
        auth0,
        products: [],
        baseAsset: null,
        subOnly: true,
        ///////// ///////// ///////// /////////
        stratname: '',
        total_pnl: 0,
        ///////// ///////// ///////// /////////
        series: [
            { name: "Bitcoin", data: [] },
            { name: "", data: [] }
        ],
        chartOptions: {
            chart: { width: "100%", type: 'area', stacked: false },
            colors: ['#00E396','#0080FB'],
            dataLabels: { enabled: false, enabledOnSeries: false },
            legend: {
                show: true,
                offsetY: 20, itemMargin: { horizontal: 10, vertical: 20 },
                labels: { colors: '#ffffff', },
            },
            fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.8 } },
            stroke: { curve: 'smooth', width: 2, },
            tooltip: { enabled: true, theme: 'dark', },
            xaxis: {
                type: "datetime",
                labels: { show: true, style: { colors: '#FFFFFF', fontSize: '12px' }, }
            },
            yaxis: { forceNiceScale: true, labels: { show: true, style: { colors: '#FFFFFF', fontSize: '10px' },
                    formatter: (value) => { return value+'%' },
                },
            }
        },
        ///////// ///////// ///////// /////////
    })

    state.products = useProductStore()

    ///////// ///////// ///////// /////////

    const myEl = ref(null);

     const getStratData = () => {
        console.log("getStratData...")
        return axios.get('/api/stratdata?id=2680')
    }

    const { data: signals } = useRequest( () =>  getStratData(), {
        cacheKey: 'signals',
        //cacheTime: 300000,
        pollingInterval: 10000,
        formatResult: res => {
            return res.data
        },
        onSuccess: (res) => {
            console.log("SIGNALS=>", res.length)
        }
    })
    
    watch(signals, (signals) => {
        console.log("watch signals...", signals[signals.length-1].sell_time)
    
        let tpnl_btc = []
        let tpnl_bva = []
        let pnl_btc = 0
        let pnl_bva = 0

        state.stratname = signals[0].stratname
        state.series[1].name = signals[0].stratname
        const days = 10 + (signals[signals.length-1].sell_time ? parseInt((Date.now() - signals[signals.length-1].sell_time)/86400000) : 0)
        
        axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit='+days)
        .then( btcs => {

            for ( var btc of btcs.data ) {
                pnl_btc = 100 * (Number(btc[4]) - Number(btc[1])) / Number(btc[1]) + pnl_btc
                tpnl_btc.push([ btc[0], pnl_btc.toFixed(2) ])
                const sum = signals.filter( bva => { 
                    return Number(bva.updated_time) > btc[0] && Number(bva.updated_time) <= btc[6] 
                })
                pnl_bva = state.max_concurrent ? _.sumBy(sum, o => { return Number(o.pnl) }) / state.max_concurrent + pnl_bva : _.sumBy(sum, o => { return Number(o.pnl) }) + pnl_bva
                tpnl_bva.push([ btc[0], pnl_bva.toFixed(2) ])
            }

            if (state.series[0].data.length===0) state.series[0].data = tpnl_btc
            if (state.series[1].data.length===0) state.series[1].data = tpnl_bva
        })
        .catch((err) => {
            console.log(err)
        })
        endStats(Date.now())
    })

    ///////// ///////// ///////// /////////

    async function setDays() {
        console.log("setDays")
        run()
    }

    async function setBaseBTC() {
        console.log("setBaseBTC")
        state.baseAsset = 'BTC'
        run()
    }

    async function setSubOnly() {
        console.log("setSubOnly")
        state.subOnly = !state.subOnly
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
        axios.get('/api/strategy?id=2680')
        .then( s => {
            state.max_concurrent = s.data.max_concurrent
        })
        .catch((err) => {
            console.log(err)
        })
        await getStratCount()
        run()
    })

    async function gotostrat(row) {
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
        return axios.get('/api/topstrats?days='+(router.currentRoute.value.query.d?router.currentRoute.value.query.d:31)+'&base='+state.baseAsset+'&so='+state.subOnly)
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
      gotostrat,
      strats,
      setDays,
      _,
      setBaseBTC,
      setBaseUSDT,
      setSubOnly,
      myEl,
      stratchart,
    }
  },
})
</script>


<style lang="postcss" scoped>
</style>