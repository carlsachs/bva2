<template>
    <div>
        <div ref="myEl" class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">

            <h1 class="mb-7 text-uppercase font-semibold">{{ stratname }}</h1>

            <apexchart type="area" height="400" :options="chartOptions" :series="series"></apexchart>
            
            <div class="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-5 uppercase">
                <div class="flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto">Period PnL *</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ total_pnl }}%</div>
                </div>

                <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto">Trades Count</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ total_signals }}</div>
                </div>

                <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto">Avg. Profit per Trade</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ avg_pnl }}%</div>
                </div>

                <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto">Win Rate</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ win_rate }}%</div>
                </div>

                <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto">Verif. Trade History</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strat_lifetime }} days</div>
                </div>

                <router-link to="/profile#apikey" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto text-green-500 font-semibold">Subscribe</div>
                </router-link>
            </div>
            
            <div class="mt-5 italic">* PNL calculated using 1/15 of the whole BTC amount for each trade.</div>

            <div v-if="true" class="mt-4 p-4">
                <div class="flex flex-col">
                    <div class="-my-2 overflow-x-auto">
                        <div class="py-2 align-middle inline-block min-w-full">
                            <div class=" overflow-hidden border-1 border-blue-900 rounded-lg">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div class="text-center">TIME</div>
                                            </th>
                                            <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div class="text-center">PAIR</div>
                                            </th>
                                            <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div class="text-center">PNL</div>
                                            </th>
                                            <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div class="text-center">TYPE</div>
                                            </th>
                                            <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div class="text-center">BUY PRICE</div>
                                            </th>
                                            <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div class="text-center">SELL PRICE</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 cursor-pointer" v-for="(row, i) in rows" :key="row.id" v-on:click="openSignal(row)">
                                        <tr>
                                            <td v-if="row.type === 'LONG'" :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.pnl ? moment(Number(row.sell_time)).fromNow() : moment(Number(row.updated_time)).fromNow() }}
                                            </td>
                                            <td v-else :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.pnl ? moment(Number(row.buy_time)).fromNow() : moment(Number(row.updated_time)).fromNow() }}
                                            </td>
                                            <td class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                                                {{ row.pair }}
                                            </td>
                                            <td v-if="row.pnl" :class="{ 'text-green-500': Number(row.pnl)>0, 'text-red-500': Number(row.pnl)<0 }" class="px-6 py-4 font-bold whitespace-no-wrap text-sm leading-5">
                                                {{ Number(row.pnl).toFixed(2) }}%
                                            </td>
                                            <td v-else class="italic px-6 py-4 text-gray-400 whitespace-no-wrap text-sm leading-5">
                                                {{ getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%
                                            </td>
                                            <!--
                                            <td v-if="Number(row.pnl)>0" :class="{ 'font-bold': row.pnl }" class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.pnl ? Number(row.pnl).toFixed(2) : getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%
                                            </td>
                                            <td v-else :class="{ 'font-bold': row.pnl }" class="text-red-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.pnl ? Number(row.pnl).toFixed(2) : getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%
                                            </td>
                                            -->
                                            <td v-if="row.type==='SHORT'" class="text-orange-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.type }}
                                            </td>
                                            <td v-else class="text-blue-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.type }}
                                            </td>
                                            <td class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.buy_price ? row.buy_price : '---' }}
                                            </td>
                                            <td class="text-red-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.sell_price ? row.sell_price : '---' }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent, watch, inject } from "vue"
import axios from "~/utils/axios"
import moment from "moment"
import { useRouter } from "vue-router"
import _ from "lodash"

export default defineComponent({
  name: "strategy",
  props: {
    id: String,
  },
  setup: (props) => {

    const smoothScroll = inject('smoothScroll')

    const router = useRouter()

    const openSignal = (row) => {
        router.push("/signal/"+ row.id)
    }

    const state = reactive({
        stratname: '',
        total_pnl: 0,
        avg_pnl: 0,
        strat_lifetime: 0,
        total_signals: 0,
        win_rate: 0,
        user: null,
        rows: [],
        prices: [],
        ///////// ///////// ///////// /////////
        series: [
            {
                name: "Bitcoin",
                data: [],
            },
            {
                name: "",
                data: [],
            }
        ],
        chartOptions: {
            chart: {
                width: "100%",
                type: 'area',
                stacked: true,
            },
            colors: ['#00E396','#0080FB'],
            dataLabels: {
                enabled: false,
                enabledOnSeries: false,
            },
            legend: {
                show: true,
                offsetY: 20,
                itemMargin: {
                    horizontal: 10,
                    vertical: 20
                },
                labels: {
                    colors: '#ffffff',
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    opacityFrom: 0.6,
                    opacityTo: 0.8,
                }
            },
            stroke: { 
                curve: 'smooth',
                width: 2,
            },
            tooltip: {
                enabled: true,
                theme: 'dark',
            },
            xaxis: {
                type: "datetime",
                labels: {
                    show: true,
                    style: {
                        colors: '#FFFFFF',
                        fontSize: '12px',
                    },
                }
            },
            yaxis: {
                min: 0,
                forceNiceScale: true,
                labels: {
                    show: true,
                    style: {
                        colors: '#FFFFFF',
                        fontSize: '10px',
                    },
                    formatter: (value) => { return value+'%' },
                },
            }
        },
        ///////// ///////// ///////// /////////
    })

    const getCurrentPnL = (symbol, sell_price, buy_price) => {
        let pnl = 0
        if (state.prices.length) {
            const currentPrice = state.prices.find( (r) => { return r.symbol === symbol }).price
            if (currentPrice) {
                if (sell_price > 0) {
                    pnl = 100 * (sell_price - currentPrice) / currentPrice
                }
                else if (buy_price > 0) {
                    pnl = 100 * (currentPrice - buy_price) / buy_price
                }
            }
        }
        //console.log(symbol, pnl)
        return pnl.toFixed(2)
    }

    onMounted(() => {
        ////// ////// ////// ////// //////
        axios.get('https://api.binance.com/api/v3/ticker/price')
        .then( prices => {
          state.prices = prices.data
        })
        .catch((err) => {
          console.log(err)
        })
        ////// ////// ////// ////// //////
        axios.get('/api/strategy?id='+props.id)
        .then( rows => {

            let tpnl_btc = []
            let tpnl_bva = []
            let pnl_btc = 0
            let pnl_bva = 0

            state.stratname = rows.data[0].stratname
            state.series[1].name = rows.data[0].stratname
            state.strat_lifetime = parseInt((rows.data[0].updated_time - rows.data[rows.data.length-1].updated_time)/86400000)
            const days = 10 + state.strat_lifetime
            state.total_signals = rows.data.length
            
            state.rows = rows.data.slice(0, 100)

            axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit='+days)
            .then( btcs => {

                for ( var btc of btcs.data ) {
                    pnl_btc = 100 * (Number(btc[4]) - Number(btc[1])) / Number(btc[1]) + pnl_btc
                    tpnl_btc.push([ btc[0], pnl_btc.toFixed(2) ])
                    const sum = rows.data.filter( bva => { 
                        return Number(bva.updated_time) > btc[0] && Number(bva.updated_time) <= btc[6] 
                    })
                    pnl_bva = _.sumBy(sum, o => { return Number(o.pnl) }) / 15 + pnl_bva
                    tpnl_bva.push([ btc[0], pnl_bva.toFixed(2) ])
                }

                state.series[0].data = tpnl_btc
                state.series[1].data = tpnl_bva

                //console.log("TPNL:", tpnl_bva[tpnl_bva.length-1][1])
                state.total_pnl = tpnl_bva[tpnl_bva.length-1][1]
                //console.log("TOTAL:", rows.data.length)
                //console.log("TRADE MEAN:", _.meanBy(rows.data, o => {return Number(o.pnl)}).toFixed(2))
                state.avg_pnl = _.meanBy(rows.data, o => {return Number(o.pnl)}).toFixed(2)
                const positifs = rows.data.filter( bva => { return Number(bva.pnl) > 0 })
                //console.log("POS COUNT:", positifs.length)
                //console.log("WIN RATE:", (100 * positifs.length / rows.data.length).toFixed(2) )
                state.win_rate = (100 * positifs.length / rows.data.length).toFixed(2)

            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
        })
        ////// ////// ////// ////// //////
        /*
        setTimeout(function(){ 
            smoothScroll({
                scrollTo: myEl.value,
                hash: '#sampleHash',
                duration: 1000,
                offset: -30, 
                updateHistory: false,
            })
         }, 1000)
        */
    })      

    const myEl = ref(null)

    return {
      ...toRefs(state),
      moment,
      openSignal,
      getCurrentPnL,
      myEl
    }
  },
})
</script>

<style>
</style>