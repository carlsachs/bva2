<template>
  <div>

    <!--div class="mx-4 my-14 p-4 border-2 border-blue-900 rounded-lg">
        <p class="text-white">Welcome to Bitcoin vs. Alts, ...</p>
    </div-->

    <div class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">

        <h1 class="mb-7 text-uppercase font-semibold">The BVA Strategy {{id}} </h1>

        <apexchart type="candlestick" height="400" :options="chartOptions" :series="series"></apexchart>
        
        <div class="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-5 uppercase">

            <div class="flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-auto">Pair</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ pair }}</div>
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


    </div>
  </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent } from "vue"
import axios from "~/utils/axios"
import moment from "moment"
import _ from "lodash"

export default defineComponent({
  name: "Signal",
  props: {
    id: String,
  },
  setup: (props) => {

    const state = reactive({
      total_pnl: 0,
      avg_pnl: 0,
      strat_lifetime: 0,
      win_rate: 0,
      user: null,
      rows: [],
      pair: null,
      ///////// ///////// ///////// /////////
      series: [],
      chartOptions: {
        chart: {
          type: 'candlestick',
          height: 400,
          id: 'candles',
          /*
          toolbar: {
            autoSelected: 'pan',
            show: false
          },
          zoom: {
            enabled: false
          },
          */
        },
        annotations: {
          xaxis: [],
          //points: [],
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          enabled: false,
          theme: 'dark',
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: '#3C90EB',
              downward: '#DF7D46'
            }
          }
        },
        xaxis: {
          type: 'category',
          labels: {
            formatter: function(val) {
              return moment(val).format('MMM DD HH:mm')
            }
          }
        }
      },
      ///////// ///////// ///////// /////////
    })

    onMounted(() => {
      ////// ////// ////// ////// //////
      console.log("ID", props.id)
      axios.get('/api/signal?id='+props.id)
        .then( signal => {
          //console.log(signal.data[0])
          state.pair = signal.data[0].pair
          axios.get('https://api.binance.com/api/v3/klines?interval=15m&limit=150&symbol=' + signal.data[0].pair)
          .then( prices => {
            //console.log(prices.data.slice(0, 1))
            let data = []
            
            for ( var price of prices.data ) {
              data.push({
                x: new Date(price[0]),
                y: [ Number(price[1]), Number(price[2]), Number(price[3]), Number(price[4]) ]
                //y: Number(price[4]),
              })
              
              if (data.length===144) {
                console.log( price[0] )
                /*
                state.chartOptions.annotations.points.push(
                  {
                    x: new Date(price[0]),
                    y: Number(price[4]),
                    yAxisIndex: 0,
                    //seriesIndex: 0,
                    borderColor: '#FFF',
                    marker: {
                      size: 13,
                      fillColor: "#fff",
                      strokeColor: "red",
                      radius: 3,
                    },
                    label: {
                      borderColor: '#FFF',
                      text: 'Прогноз',
                      orientation: 'vertical',
                      style: {
                        background: '#fff',
                        color: '#777',
                        fontSize: '12px',
                      }
                    }
                  }
                )
                */
                
              }
              
            }
            state.series.push({'data': data})
            //console.log(JSON.stringify(state.series))

            setTimeout(function(){ 
                  state.chartOptions.annotations.xaxis.push(
                    {
                      x: moment(1621877400000).format('MMM DD HH:mm'),
                      borderColor: '#00E396',
                      label: {
                        borderColor: '#00E396',
                        style: {
                          fontSize: '12px',
                          color: '#fff',
                          background: '#00E396'
                        },
                        orientation: 'horizontal',
                        offsetY: 7,
                        text: 'Annotation Test'
                      }
                    }
                  )
                }, 1500)

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
      moment
    }
  },
})
</script>

<style>
</style>
