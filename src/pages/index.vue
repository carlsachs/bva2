<template>
    <div>
        <div class="p-4">
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
                <div class="text-2xl text-cyan-200 mt-3">
                    Our goal is to democratize access to the best crypto trading algorithms. 
                </div>
                <div class="text-xl text-cyan-200 mt-3">
                    We created this marketplace to fund the #1 <a href='https://bitcoinvsaltcoins.com' target="_new" class="underline">open forward testing platform</a>.
                </div>
                <div class="text-xl text-cyan-200 mt-3">
                    We are currently tracking more than <router-link to="/signals" class="underline">1200 strategies</router-link>.
                    Here are our curated strategies.
                </div>
                <div class="text-cyan-200 mt-3">
                    <u>Disclaimer</u>: There is a very high degree of risk involved in trading crypto. 
                    Past results are not indicative of future returns.
                    This platform is for educational purposes only.
                </div>
            </div>
        </div>

        <div class="p-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-5">
            <div v-for="(strategy, i) in strategies" :key="strategy.name" class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
                
                <router-link :to="'/strat/'+strategy.id" class=""><h1 class="mb-0 text-2xl text-uppercase font-semibold">{{ strategy.name }}</h1></router-link>

                <apexchart type="area" height="400" :options="chartOptions" :series="strategy.series"></apexchart>

                <div class="m-7 text-xl">{{ strategy.description }}</div>

                <div v-if="!auth0.state.isAuthenticated" @click="login" class="mx-10 p-4 bg-indigo-900 text-orange-500 font-bold group flex-auto items-center shadow-xl gap-5 rounded-lg mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    {{ strategy.price }} 
                </div>
                <div class="p-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-5 uppercase">
                    <div class="flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5">
                        <div class="flex-auto">Total PnL</div>
                        <div class="flex-auto text-justify text-blue-300 block">{{ Number(strategy.total_pnl).toFixed(2) }}%</div>
                    </div>

                    <div v-if="strategy.max_concurrent>1" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5">
                        <div class="flex-auto">Max. Concurrent Trades</div>
                        <div class="flex-auto text-justify text-blue-300 block">{{strategy.max_concurrent}}</div>
                    </div>

                    <div v-if="strategy.max_concurrent>1" class="flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5">
                        <div class="flex-auto">Portfolio PnL*</div>
                        <div class="flex-auto text-justify text-blue-300 block">{{ (Number(strategy.total_pnl)/Number(strategy.max_concurrent)).toFixed(2) }}%</div>
                    </div>

                    <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5">
                        <div class="flex-auto">Trades Count</div>
                        <div class="flex-auto text-justify text-blue-300 block">{{ strategy.total_signals }}</div>
                    </div>

                    <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5">
                        <div class="flex-auto">Avg. Profit per Trade</div>
                        <div class="flex-auto text-justify text-blue-300 block">{{ strategy.avg_pnl }}%</div>
                    </div>

                    <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5">
                        <div class="flex-auto">Win Rate</div>
                        <div class="flex-auto text-justify text-blue-300 block">{{ strategy.win_rate }}%</div>
                    </div>

                    <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5">
                        <div class="flex-auto">Verif. Trade History</div>
                        <div class="flex-auto text-justify text-blue-300 block">{{ strategy.strat_lifetime }} days</div>
                    </div>

                    <router-link :to="'/strat/'+strategy.id" class="group bg-indigo-900 flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                        <div class="flex-auto font-bold">See All Signals</div>
                    </router-link>
                </div>

                <div v-if="strategy.max_concurrent>1" class="mt-5 italic">* PNL calculated using 1/{{strategy.max_concurrent}} of the whole BTC amount for each trade as recommended.</div>
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
                    <div class="text-2xl text-white">840+ GitHub Stars</div>
                </a>
            </div>
        </div>

    </div>
</template>

<script lang="ts">

import { onMounted, reactive, computed, toRefs, defineComponent, inject } from "vue"
import axios from "~/utils/axios"
import _ from "lodash"
import { useRouter } from "vue-router"
import { useLoadMoreStore } from '../stores/loadmore'
import { startStats, endStats } from '~/modules/stats'
import { useHead } from '@vueuse/head'

export default defineComponent({
  name: "Dashboard",
  setup: () => {
    startStats(Date.now())
    console.log("INDEX")

    useHead({
        title: computed( () => "Bitcoin vs. Alts"),
        meta: [
            {
            name: `description`,
            content: computed(() => "The goal of Bitcoin vs. Alts aka BVA is to democratize access to the best crypto trading algorithms."),
            },
        ],
    })

    const router = useRouter()

    const loadMoreStore = useLoadMoreStore()
    loadMoreStore.resetProfile()
    loadMoreStore.resetStrat()

    const state = reactive({
        strategies: [
            {
                id: 1255,
                name: "Dominus V5 10 pairs",
                series: [{ name: "DOM", data: [] }],
                description: "This is a trending strategy that can be used with any crypto and stock market pair and its designed to destroy buy and hold by a long margin. These signals are for 10 pairs, which allow to diversify risk and minimize drawdown (BTC - ETH - ADA - MATIC - BNB - DOGE - LINK - SOL - XRP - LTC).",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
                max_concurrent: 10,
                price: "Limited Availability 499 USDT",
            },
            {
                id: 1262,
                name: "BBWinner",
                series: [{ name: "BB", data: [] }],
                description: "A highly effective FUTURES strategy that is based on going in favor of the global trend but against the micro trend when the price exceeds the Bollinger Bands. The strategy only sends cryptocurrency signals based on the historical profitability of these coins with this strategy.",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
                max_concurrent: 20,
                price: "Limited Availability 50 USDT",
            },
            {
                id: 882,
                name: "DS STRATEGY2 USDT",
                series: [{ name: "DS2", data: [] }],
                description: "The strategy trades long signals for Altcoin/USDT pairs. You only need a spot wallet. Makes deals when the market is bullish and when the market is bearish, so the strategy is always in action. Аdvice: use together with SX STRATEGY USDT for more profit.",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
                max_concurrent: 20,
                price: "Limited Availability 0.07 BNB",
            },
            {
                id: 1024,
                name: "SX STRATEGY USDT",
                series: [{ name: "SX", data: [] }],
                description: "The strategy trades long signals for Altcoin/USDT pairs. You only need a spot wallet. Makes deals when the market is bullish and when the market is bearish, so the strategy is always in action. Аdvice: use together with DS STRATEGY2 USDT for more profit.",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
                max_concurrent: 20,
                price: "Limited Availability 0.07 BNB",
            },
            {
                id: 466,
                name: "The BVA Strat",
                series: [{ name: "BVA", data: [] }],
                description: "The mission of the BVA strategy is simply to accumulate more BTC. It is the result of a prediction model trained using the latest Machine Learning practices. We use specific data sets made of crypto market data, social sentiments, TAs, traditional financial market data and some secret sauce.",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
                max_concurrent: 15,
                price: "Limited Availability $19.80",
            },
            {
                id: 595,
                name: "BVA Long Only Strategy",
                series: [{ name: "BVA Long Only", data: [] }],
                description: "The BVA Long Only strategy is the same than the BVA strategy but only trades LONG SPOT signals (no need of margin wallet)",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
                max_concurrent: 15,
                price: "Limited Availability $19.80",
            },
            {
                id: 623,
                name: "HITARUS_MODEL_ONE",
                series: [{ name: "H1", data: [] }],
                description: "Targets small but stable profits. It only opens long positions and is also active when the market downs.",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
                max_concurrent: 15,
                price: "Limited Availability 0.07 BNB",
            },
            {
                id: 948,
                name: "Fist4Fun.V02.ENJUSDT",
                series: [{ name: "F4F", data: [] }],
                description: "One Future Pair Strategy.",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
                max_concurrent: 1,
                price: "Limited Availability 0.07 BNB",
            }
        ],
        user: null,
        //rows: [],
        ///////// ///////// ///////// /////////
        chartOptions: {
            chart: { width: "100%", type: 'area' },
            colors: ['#0080FB', '#00E396'],
            dataLabels: { enabled: false, enabledOnSeries: false, },
            legend: { show: true, offsetY: 20, itemMargin: { horizontal: 10, vertical: 20 }, labels: { colors: '#ffffff' }, },
            fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.8, } },
            stroke: {  curve: 'smooth', width: 2, },
            tooltip: { enabled: true, theme: 'dark', },
            xaxis: { type: "datetime", labels: { show: true, style: { colors: '#FFFFFF', fontSize: '12px' }} },
            yaxis: { forceNiceScale: true, labels: { show: true, style: { colors: '#FFFFFF', fontSize: '10px'},
                    formatter: (value) => { return value+'%' },
                },
            }
        },
        ///////// ///////// ///////// /////////
    })

    onMounted(() => {
        for ( const i in state.strategies ) {
            axios.get('/api/stratdata?id=' + state.strategies[i].id)
            .then( rows => {
                let tpnl_bva = []
                let pnl_bva = 0
                for ( var row of rows.data.reverse() ) {
                    pnl_bva = pnl_bva + Number(row.pnl)
                    tpnl_bva.push([ Number(row.updated_time), Number(pnl_bva).toFixed(2) ])
                }
                state.strategies[i].strat_lifetime = parseInt((rows.data[rows.data.length-1].updated_time - rows.data[0].updated_time)/86400000)
                state.strategies[i].series[0].data = tpnl_bva
                state.strategies[i].total_pnl = pnl_bva.toFixed(2)
                state.strategies[i].total_signals = rows.data.length
                state.strategies[i].avg_pnl = _.meanBy(rows.data, o => {return Number(o.pnl)}).toFixed(2)
                const positifs = rows.data.filter( bva => { return Number(bva.pnl) > 0 })
                state.strategies[i].win_rate = (100 * positifs.length / rows.data.length).toFixed(2)
            })
            .catch((err) => {
                console.log(err)
            })
        }
        endStats(Date.now())
    })

    const auth0: any = inject("auth0")

    async function login() {
        // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#loginwithredirect
        console.log("-0-0-0-0-0-0-0-", window.location.href)
        //auth0.client.loginWithRedirect({ appState: { targetUrl: window.location.href } })
        await auth0.client.loginWithRedirect({ appState: { targetUrl: '/subscriptions' } })
        //await auth0.client.loginWithPopup()
        //console.log("-1-1-1-1-1-1-", await auth0.client.getUser() )
    }
    
    return {
      ...toRefs(state),
      auth0,
      login
    }
  },
})
</script>

<style>
</style>
