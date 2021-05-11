<template>
  <div>
    <Hero />
    <apexchart type="area" height="550" :options="chartOptions" :series="series"></apexchart>
    <Features />
    <p>{{ user }}</p>
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
            fill: {
                type: 'gradient',
                gradient: {
                    opacityFrom: 0.6,
                    opacityTo: 0.8,
                }
            },
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

                console.log("TOTAL:", bvas.data.length)

                const positifs = bvas.data.filter( bva => { 
                    return Number(bva.pnl) > 0 
                })
                console.log("POS COUNT:", positifs.length)
                console.log("POS MAX:", Number(_.maxBy(positifs, o => {return Number(o.pnl)}).pnl).toFixed(2))
                console.log("POS MEAN:", _.meanBy(positifs, o => {return Number(o.pnl)}).toFixed(2))

                const negatifs = bvas.data.filter( bva => { 
                    return Number(bva.pnl) < 0 
                })
                console.log("NEG COUNT:", negatifs.length)
                console.log("NEG MIN:", Number(_.minBy(negatifs, o => {return Number(o.pnl)}).pnl).toFixed(2))
                console.log("NEG MEAN:", _.meanBy(negatifs, o => {return Number(o.pnl)}).toFixed(2))

                console.log("WIN / LOSS RATIO:", Number(positifs.length / negatifs.length).toFixed(2) )

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
