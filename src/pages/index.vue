<template>
    <div>

        <div class="text-3xl text-cyan-200 mt-10">
            Bitcoin Vs. Alts, BVA, is a marketplace offering subscriptions to the best crypto trading strategies.
        </div>
        <div class="text-3xl text-cyan-200 mt-10">
            Just let our robot trader manage your crypto portfolio for you.
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            We are currently tracking more than <router-link to="/signals" class="underline">1000 strategies</router-link>.
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            It was created to fund the #1 <a href='https://bitcoinvsaltcoins.com' target="_new" class="underline">open forward testing platform</a>.
        </div>
        <div class="text-xl text-cyan-200 mt-10">We are currently offering two subscriptions but more are coming soon.</div>
        <div class="text-xl text-cyan-200 mt-3">The mission of our two flagship strategies is simply to accumulate more BTC.</div>

        <div v-for="(strategy, i) in strategies" :key="strategy.name" class="mx-2 my-7 py-4 border-2 border-blue-900 rounded-lg text-white relative">
            
            <h1 class="mb-0 text-5xl text-uppercase font-semibold">{{ strategy.name }}</h1>

            <apexchart type="area" height="400" :options="chartOptions" :series="strategy.series"></apexchart>

            <div class="m-7 text-3xl">{{ strategy.description }}</div>

            <div v-if="!auth0.state.isAuthenticated" @click="login" class="uppercase mx-10 p-4 bg-indigo-900 text-orange-500 font-bold group flex-auto items-center shadow-xl gap-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                Limited Availability $19.80 
            </div>
            <div class="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-5 uppercase">
                <div class="flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5">
                    <div class="flex-auto">Total PnL</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ Number(strategy.total_pnl * 15).toFixed(2) }}%</div>
                </div>

                <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5">
                    <div class="flex-auto">Max. Concurrent Trades</div>
                    <div class="flex-auto text-justify text-blue-300 block">15</div>
                </div>

                <div class="flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5">
                    <div class="flex-auto">Portfolio PnL*</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strategy.total_pnl }}%</div>
                </div>

                <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5">
                    <div class="flex-auto">Trades Count</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strategy.total_signals }}</div>
                </div>

                <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5">
                    <div class="flex-auto">Avg. Profit per Trade</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strategy.avg_pnl }}%</div>
                </div>

                <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5">
                    <div class="flex-auto">Win Rate</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strategy.win_rate }}%</div>
                </div>

                <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5">
                    <div class="flex-auto">Verif. Trade History</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strategy.strat_lifetime }} days</div>
                </div>

                <router-link :to="'/strat/'+strategy.id" class="group bg-indigo-900 flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto font-bold">See All Signals</div>
                </router-link>
            </div>

            <div class="mt-5 italic">* PNL calculated using 1/15 of the whole BTC amount for each trade as recommended.</div>
        </div>

        <div class="p-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-5">
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
            <a href="https://www.binance.com/?ref=W5BD94FW" target="_new">
                <img width=200 class="mx-auto mb-5" alt="BvA Discord" src="/binance.svg" />
                <div class="text-3xl text-white">Official Binance Broker</div>
            </a>
            </div>
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
            <a href="https://bitcoinvsaltcoins.com" target="_new">
                <img width=132 class="mx-auto mb-5" alt="Strategy Incubator" src="/creator.png" />
                <div class="text-3xl text-white">Our Strategy Incubator</div>
            </a>
            </div>
        </div>
        <div class="p-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-5">
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
            <a href="https://discordapp.com/invite/4EQrEgj" target="_new">
                <img width=132 class="mx-auto mb-5" alt="BvA Discord" src="/discord.png" />
                <div class="text-3xl text-white">1200+ Discord Members</div>
            </a>
            </div>
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
            <a href="https://github.com/bitcoinvsalts/node-binance-trader" target="_new">
                <img width=102 class="mx-auto mt-3 mb-10" alt="BvA GitHub" src="/github.png" />
                <div class="text-3xl text-white">840+ GitHub Stars</div>
            </a>
            </div>
        </div>

    </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent, inject } from "vue"
import axios from "~/utils/axios"
import _ from "lodash"
import { useRouter } from "vue-router"
import { useLoadMoreStore } from '../stores/loadmore'
import { startStats, endStats } from '~/modules/stats'


export default defineComponent({
  name: "Dashboard",
  setup: () => {
    startStats(Date.now())
    console.log("INDEX")

    const router = useRouter()

    const loadMoreStore = useLoadMoreStore()
    loadMoreStore.resetProfile()
    loadMoreStore.resetStrat()

    const state = reactive({
        strategies: [
            {
                id: 466,
                name: "BVA Strategy",
                series: [{ name: "BVA", data: [] }],
                description: "The BVA strategy is the result of a prediction model trained using the latest Machine Learning practices. We use specific data sets made of crypto market data, social sentiments, TAs, traditional financial market data and some secret sauce.",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
            },
            {
                id: 595,
                name: "BVA LONG ONLY Strategy",
                series: [{ name: "BVA LONG ONLY", data: [] }],
                description: "The BVA LONG ONLY strategy is the same than the BVA strategy but only trades LONG signals (no need of margin wallet)",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
            },
            /*
            {
                id: 670,
                name: "Woltiks Strategy",
                series: [{ name: "Woltiks", data: [] }],
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
            }
            */
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
                    pnl_bva = pnl_bva + Number(row.pnl) / 15
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
        await auth0.client.loginWithRedirect({ appState: { targetUrl: '/profile' } })
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
