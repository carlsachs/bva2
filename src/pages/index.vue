<template>
    <div>

        <div v-for="(strategy, i) in strategies" :key="strategy.name" class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">
            <h1 class="mb-7 text-uppercase font-semibold">{{ strategy.name }}</h1>

            <apexchart type="area" height="400" :options="chartOptions" :series="strategy.series"></apexchart>
            
            <div class="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-5 uppercase">
                <router-link :to="'/strat/'+strategy.id" class="flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto">Period PnL *</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strategy.total_pnl }}%</div>
                </router-link>

                <router-link :to="'/strat/'+strategy.id" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto">Trades Count</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strategy.total_signals }}</div>
                </router-link>

                <router-link :to="'/strat/'+strategy.id" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto">Avg. Profit per Trade</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strategy.avg_pnl }}%</div>
                </router-link>

                <router-link :to="'/strat/'+strategy.id" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto">Win Rate</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strategy.win_rate }}%</div>
                </router-link>

                <router-link :to="'/strat/'+strategy.id" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto">Verif. Trade History</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strategy.strat_lifetime }} days</div>
                </router-link>

                <router-link to="/profile#apikey" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                    <div class="flex-auto text-green-500 font-semibold">Subscribe</div>
                </router-link>
            </div>

            <div class="mt-5 italic">* PNL calculated using 1/15 of the whole BTC amount for each trade.</div>
        </div>

    </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent } from "vue"
import axios from "~/utils/axios"
import moment from "moment"
import _ from "lodash"
import { useRouter } from "vue-router"

export default defineComponent({
  name: "Dashboard",
  setup: () => {

    const router = useRouter()

    const state = reactive({
        strategies: [
            {
                id: 466,
                name: "BVA Strategy",
                series: [{ name: "BVA", data: [] }],
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
            },
            {
                id: 595,
                name: "BVA Long Only Strategy",
                series: [{ name: "BVA Long Only", data: [] }],
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
            chart: {
                width: "100%",
                type: 'area',
                //stacked: false,
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

    onMounted(() => {
        for ( const i in state.strategies ) {
            axios.get('/api/strategy?id=' + state.strategies[i].id)
            .then( rows => {

                let tpnl_bva = []
                let pnl_bva = 0
                
                for ( var row of rows.data.reverse() ) {
                    pnl_bva = pnl_bva + Number(row.pnl) / 15
                    tpnl_bva.push([ Number(row.updated_time), Number(pnl_bva).toFixed(2) ])
                }

                state.strategies[i].strat_lifetime = parseInt((rows.data[rows.data.length-1].updated_time - rows.data[0].updated_time)/86400000)

                state.strategies[i].series[0].data = tpnl_bva

                //console.log("TPNL:", pnl_bva.toFixed(2) )
                state.strategies[i].total_pnl = pnl_bva.toFixed(2)
                state.strategies[i].total_signals = rows.data.length
                //console.log("TOTAL:", rows.data.length)
                //console.log("TRADE MEAN:", _.meanBy(rows.data, o => {return Number(o.pnl)}).toFixed(2))
                state.strategies[i].avg_pnl = _.meanBy(rows.data, o => {return Number(o.pnl)}).toFixed(2)
                const positifs = rows.data.filter( bva => { return Number(bva.pnl) > 0 })
                //console.log("POS COUNT:", positifs.length)
                //console.log("WIN RATE:", (100 * positifs.length / rows.data.length).toFixed(2) )
                state.strategies[i].win_rate = (100 * positifs.length / rows.data.length).toFixed(2)

            })
            .catch((err) => {
                console.log(err)
            })
        }
    })
    
    return {
      ...toRefs(state),
      //moment,
    }
  },
})
</script>

<style>
</style>
