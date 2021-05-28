<template>
  <div>

    <div ref="myEl" class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">

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

            <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-auto">Buy Price</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ buy_price }}</div>
            </div>

            <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-auto">Sell Price</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ sell_price }}</div>
            </div>

        </div>
    </div>
  </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent, watch, inject } from "vue"
import axios from "~/utils/axios"
import moment from "moment"
import _ from "lodash"

export default defineComponent({
  name: "signal",
  props: {
    id: String,
  },
  setup: (props) => {

    const smoothScroll = inject('smoothScroll')

    const state = reactive({
      signal_type: null,
      pair: null,
      pnl: 0,
      buy_price: null,
      sell_price: null,
      ///////// ///////// ///////// /////////
      series: [{ name: 'candle', data: [] }],
      chartOptions: {
        chart: { height: 400, type: 'candlestick' },
        tooltip: { enabled: true, theme: 'dark' },
        annotations: {
          points: [
            { marker: { size: 8, fillColor: "red" }, label: { text: '' } },
            { marker: { size: 8, fillColor: "green" }, label: { text: '' } },
          ]
        },
        xaxis: { type: 'category', floating: true },
        yaxis: { show: false, tooltip: { enabled: false } }
      }
      ///////// ///////// ///////// /////////
    })

    onMounted(() => {
      ////// ////// ////// ////// //////
      console.log("ID", props.id)
      axios.get('/api/signal?id='+props.id)
        .then( signal => {
          //console.log(signal.data[0])

          state.pair = signal.data[0].pair
          state.signal_type = signal.data[0].type
          state.buy_price = signal.data[0].buy_price
          state.sell_price = signal.data[0].sell_price
          state.pnl = Number(signal.data[0].pnl).toFixed(2)

          const startTime = state.signal_type === 'LONG' ? Number(signal.data[0].buy_time) - 160000000 : Number(signal.data[0].sell_time) - 160000000
          const endTime = signal.data[0].pnl ? Number(signal.data[0].sell_time) + 160000000 : Date.now()

          axios.get('https://api.binance.com/api/v3/klines?interval=15m&symbol='+signal.data[0].pair+'&startTime='+startTime+'&endTime=' + endTime)
          .then( prices => {
            let data = []
            
            for ( var price of prices.data ) {
              data.push({
                x: moment(price[0]).format('MMM DD HH:mm'),
                y: [ Number(price[1]), Number(price[2]), Number(price[3]), Number(price[4]) ]
              })
              
              if ( price[0] < Number(signal.data[0].sell_time) && Number(signal.data[0].sell_time) < (price[0]+900000) ) {
                //console.log( "=======>", price[0] , price[1] )
                state.chartOptions.annotations.points[0].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[0].y = Number(signal.data[0].sell_price)
                state.chartOptions.annotations.points[0].label.text = 'SELL'
              }

              if ( price[0] < Number(signal.data[0].buy_time) && Number(signal.data[0].buy_time) < (price[0]+900000) ) {
                //console.log( "=======>", price[0] , price[1] )
                state.chartOptions.annotations.points[1].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[1].y = Number(signal.data[0].buy_price)
                state.chartOptions.annotations.points[1].label.text = 'BUY'
              }
            }
            //state.series.push({'data': data})
            //console.log(JSON.stringify(state.series))
            state.series[0].data = data

            if (signal.data[0].pnl == null) {
              const last_price = Number(prices.data[prices.data.length-1][4])
              state.pnl = (state.signal_type === 'LONG') ? (100 * (last_price-state.buy_price)/state.buy_price) : (100 * (state.sell_price-last_price)/last_price)
              state.pnl = state.pnl.toFixed(2)
            }

          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })
      ////// ////// ////// ////// //////
      setTimeout(function(){ 
          smoothScroll({
              scrollTo: myEl.value,
              hash: '#sampleHash',
              duration: 1000,
              offset: -30, 
          })
        }, 1000);
    })

    const myEl = ref(null)
    
    return {
      ...toRefs(state),
      moment,
      myEl
    }
  },
})
</script>

<style>
</style>
