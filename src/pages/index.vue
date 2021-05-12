<template>
  <div>
    <div class="mx-4 my-14 p-4 border-2 border-blue-900 rounded-lg">
        <p class="text-white">Welcome to Bitcoin vs. Alts, ...</p>
    </div>
    <div class="mx-4 my-14 pt-4 border-2 border-blue-900 rounded-lg">
        <apexchart type="area" height="550" :options="chartOptions" :series="series"></apexchart>
    </div>
    <div class="mx-4 my-14 p-4 border-2 border-blue-900 rounded-lg text-white relative">
        <h3 class="mt-4 text-uppercase font-semibold">BVA Strategie Performance</h3>
        <div class="m-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-5 uppercase">

            <div class="flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-initial">Period PnL</div>
                <div class="flex-initial text-justify text-blue-300 block">{{ total_pnl }}%</div>
            </div>

            <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-initial">Avg. Profit per Trade</div>
                <div class="flex-initial text-justify text-blue-300 block">{{ avg_pnl }}%</div>
            </div>

            <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-initial">Win Rate</div>
                <div class="flex-initial text-justify text-blue-300 block">{{ win_rate }}%</div>
            </div>

            <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-initial">Verified Trade History</div>
                <div class="flex-initial text-justify text-blue-300 block">1 year</div>
            </div>

        </div>
    </div>
    <!--p>{{ user }}</p-->
  </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent } from "vue";
import axios from "~/utils/axios";
import _ from "lodash";

export default defineComponent({
  name: "Dashboard",
  setup: () => {

    const state = reactive({
        total_pnl: 0,
        avg_pnl: 0,
        strat_lifetime: 0,
        win_rate: 0,
        user: null,
        ///////// ///////// ///////// /////////
        series: [
            {
                name: "Bitcoin",
                data: [],
            },
            {
                name: "BVA",
                data: [],
            }
        ],
        chartOptions: {
            chart: {
                width: "80%",
                type: 'area',
                stacked: true,
            },
            colors: ['#0080FB', '#00E396'],
            dataLabels: {
                enabled: false,
                enabledOnSeries: false,
            },
            legend: {
                show: true,
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

    onMounted(() => {
        axios.get('/api/signals')
        .then(res => {
            state.user = res
        })
        .catch((err) => {
            console.log(err)
        })
        ////// ////// ////// ////// //////
        axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=350')
        .then( btcs => {
            axios.get('/api/strategy?id=466')
            .then( bvas => {

                let tpnl_btc = []
                let tpnl_bva = []
                let pnl_btc = 0
                let pnl_bva = 0

                for ( var btc of btcs.data ) {
                    pnl_btc = 100 * (Number(btc[4]) - Number(btc[1])) / Number(btc[1]) + pnl_btc
                    tpnl_btc.push([ btc[0], pnl_btc.toFixed(0) ])
                    const sum = bvas.data.filter( bva => { 
                        return Number(bva.updated_time) > btc[0] && Number(bva.updated_time) <= btc[6] 
                    })
                    pnl_bva = _.sumBy(sum, o => { return Number(o.pnl) }) / 15 + pnl_bva
                    tpnl_bva.push([ btc[0], pnl_bva.toFixed(0) ])
                }

                state.series[0].data = tpnl_btc
                state.series[1].data = tpnl_bva

                console.log("TPNL:", tpnl_bva[tpnl_bva.length-1][1])
                state.total_pnl = tpnl_bva[tpnl_bva.length-1][1]
                console.log("TOTAL:", bvas.data.length)
                console.log("TRADE MEAN:", _.meanBy(bvas.data, o => {return Number(o.pnl)}).toFixed(2))
                state.avg_pnl = _.meanBy(bvas.data, o => {return Number(o.pnl)}).toFixed(2)
                const positifs = bvas.data.filter( bva => { return Number(bva.pnl) > 0 })
                console.log("POS COUNT:", positifs.length)
                console.log("WIN RATE:", (100 * positifs.length / bvas.data.length).toFixed(2) )
                state.win_rate = (100 * positifs.length / bvas.data.length).toFixed(2)

            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
        })
        ////// ////// ////// ////// //////
    })

    /*
    onBeforeMount( () => {
        fetchResults();
    })
    */ 
    
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style>
</style>
