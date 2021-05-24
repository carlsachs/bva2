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
                <div class="flex-auto">Type</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ signal_type }}</div>
            </div>

            <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-auto">PNL</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ pnl }}%</div>
            </div>

        </div>
    </div>
  </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent, watch } from "vue"
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
      signal_type: null,
      pair: null,
      pnl: 0,
      ///////// ///////// ///////// /////////
      series: [{
        name: 'candle',
        data: []
      }],
      chartOptions: {
        chart: {
          height: 400,
          type: 'candlestick',
        },
        title: {
          text: '',
          align: 'center'
        },
        annotations: {
          points: [
            {
              marker: {
                size: 8,
                fillColor: "red",
              },
              label: { text: '' }
            },
            {
              marker: {
                size: 8,
                fillColor: "green",
              },
              label: { text: '' }
            }
          ]
        },
        tooltip: {
          enabled: false,
        },
        xaxis: {
          type: 'category',
          labels: {
            formatter: function(val) {
              return moment(val).format('MMM DD HH:mm')
            }
          }
        },
        yaxis: {
          tooltip: {
            enabled: false
          }
        }
      }
      ///////// ///////// ///////// /////////
    })

    /*
    watch(state.chartOptions, (newVal: any, oldVal: any) => {
      console.log(JSON.stringify(oldVal), JSON.stringify(newVal))
    })
    */

    onMounted(() => {
      ////// ////// ////// ////// //////
      console.log("ID", props.id)
      axios.get('/api/signal?id='+props.id)
        .then( signal => {
          console.log(signal.data[0])

          state.pair = signal.data[0].pair
          state.signal_type = signal.data[0].type
          state.pnl = Number(signal.data[0].pnl).toFixed()

          const startTime = state.signal_type === 'LONG' ? Number(signal.data[0].buy_time) - 60000000 : Number(signal.data[0].sell_time) - 60000000
          console.log("startTime", moment(startTime).format('MMM DD HH:mm'))

          axios.get('https://api.binance.com/api/v3/klines?interval=15m&symbol='+signal.data[0].pair+'&startTime='+startTime+'&endTime='+Date.now())
          .then( prices => {
            //console.log(prices.data.slice(0, 1))
            let data = []
            
            for ( var price of prices.data ) {
              data.push({
                x: new Date(price[0]),
                y: [ Number(price[1]), Number(price[2]), Number(price[3]), Number(price[4]) ]
              })
              
              if ( price[0] < Number(signal.data[0].sell_time) && Number(signal.data[0].sell_time) < (price[0]+900000) ) {
                console.log( "=======>", price[0] , price[1] )

                state.chartOptions.annotations.points[0].x = moment(new Date(price[0])).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[0].y = Number(price[1])
                state.chartOptions.annotations.points[0].label.text = 'SHORT'

              }

              if ( price[0] < Number(signal.data[0].buy_time) && Number(signal.data[0].buy_time) < (price[0]+900000) ) {
                console.log( "=======>", price[0] , price[1] )

                state.chartOptions.annotations.points[1].x = moment(new Date(price[0])).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[1].y = Number(price[1])
                state.chartOptions.annotations.points[1].label.text = 'LONG'

              }
      
            }
            //state.series.push({'data': data})
            //console.log(JSON.stringify(state.series))

            state.series[0].data = data
            
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
