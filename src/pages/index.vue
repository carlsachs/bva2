<template>
  <div>

    <!--div class="mx-4 my-14 p-4 border-2 border-blue-900 rounded-lg">
        <p class="text-white">Welcome to Bitcoin vs. Alts, ...</p>
    </div-->

    <div class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">

        <h1 class="mb-7 text-uppercase font-semibold">The BVA Strategy</h1>

        <apexchart type="area" height="400" :options="chartOptions" :series="series"></apexchart>
        
        <div class="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-5 uppercase">

            <div class="flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-auto">Period PnL</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ total_pnl }}%</div>
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
                <div class="flex-auto text-justify text-blue-300 block">1 year</div>
            </div>

            <router-link to="/profile#apikey" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-auto">Subscribe</div>
            </router-link>

            <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-auto">Follow</div>
            </div>

        </div>

        <div class="mt-4 p-4">
            <div class="flex flex-col">
                <div class="-my-2 overflow-x-auto">
                    <div class="py-2 align-middle inline-block min-w-full">
                        <div
                            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th
                                            class="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="flex cursor-pointer">
                                                <span class="mr-2">PRODUCT NAME</span>
                                            </div>
                                        </th>
                                        <th
                                            class="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="flex cursor-pointer">
                                                <span class="mr-2">Stock</span>
                                            </div>
                                        </th>
                                        <th
                                            class="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="flex cursor-pointer">
                                                <span class="mr-2">STATUS</span>
                                            </div>
                                        </th>
                                        <th
                                            class="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="flex cursor-pointer">
                                                <span class="mr-2">ACTION</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td
                                            class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                            <p>Apple MacBook Pro 13</p>
                                            <p class="text-xs text-gray-400">PC & Laptop
                                            </p>
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                            <p>77</p>
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                            <div class="flex text-green-500">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    class="w-5 h-5 mr-1" fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p>Active</p>
                                            </div>
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                            <div class="flex space-x-4">
                                                <a href="#" class="text-blue-500 hover:text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    class="w-5 h-5 mr-1"
                                                    fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                <p>Edit</p>
                                                </a>
                                                <a href="#" class="text-red-500 hover:text-red-600">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    class="w-5 h-5 mr-1 ml-3"
                                                    fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <p>Delete</p>
                                                </a>
                                            </div>
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
                width: "100%",
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
                offsetY: 20,
                itemMargin: {
                    //horizontal: 5,
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

    onMounted(() => {
        ////// ////// ////// ////// //////
        /*
        axios.get('/api/signals')
        .then(res => {
            state.user = res
        })
        .catch((err) => {
            console.log(err)
        })
        */
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
