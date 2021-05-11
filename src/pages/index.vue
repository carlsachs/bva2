<template>
  <div>
    <Hero />
    <apexchart type="area" height="550" :options="chartOptions" :series="series"></apexchart>
    <apexchart type="bar" height="550" :options="chartOptions2" :series="series2"></apexchart>
    <Features />
    <p>{{ user }}</p>
  </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent } from "vue";
import axios from "~/utils/axios";

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
                stacked: false,
            },
            stroke: {
                curve: 'smooth'
            },
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
            stroke: { 
                curve: 'smooth',
                width: 1,
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
        series2: [
            {
                name: "BVA",
                data: [],
            }
        ],
        chartOptions2: {
            chart: {
                width: "80%",
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
            stroke: { 
                curve: 'smooth',
                width: 1,
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
                labels: {
                    show: true,
                    style: {
                        colors: '#FFFFFF',
                        fontSize: '10px',
                    },
                    formatter: (value) => { return value+'%' },
                },
            }
        }
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
        axios.get('/api/strategy?id=466')
        .then(res => {
            let tpnl = []
            let tpnl2 = []
            let pnl = 0
            for ( var item of res.data.reverse() ) {
                if (item.pnl) {
                    pnl = Number(item.pnl) / 15 + pnl
                    tpnl.push([Number(item.updated_time), parseInt(pnl)])
                    tpnl2.push([Number(item.updated_time), Number(item.pnl).toFixed(2) ])
                }
            }
            state.series[1].data = tpnl
            state.series2[0].data = tpnl2
        })
        .catch((err) => {
            console.log(err)
        })
        ////// ////// ////// ////// //////
        axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=350')
        .then(res => {
            let tpnl = []
            let pnl = 0
            for ( var item of res.data ) {
                pnl = 100 * (Number(item[4]) - Number(item[1])) / Number(item[1]) + pnl
                tpnl.push([item[0], parseInt(pnl)])
            }
            state.series[0].data = tpnl
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
