<template>
  <div>

    <div ref="myEl" class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">

      <h1 class="text-2xl mb-7 text-uppercase font-semibold">{{ pair }}</h1>
      <a :href="'/strat/'+stratid" class="text-xl mb-7 text-uppercase font-semibold">From {{ stratname }}</a>

        <apexchart type="candlestick" height="400" :options="chartOptions" :series="series"></apexchart>
        
        <div class="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-5 uppercase">

            <div class="flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Pair</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ pair }}</div>
            </div>

            <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Type</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ signal_type }}</div>
            </div>

            <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">PNL</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ pnl }}%</div>
            </div>

            <div v-if="buy_price" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Price</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ buy_price }}</div>
            </div>

            <div v-if="buy_trade_size" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Size</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ buy_trade_size }}</div>
            </div>

            <div v-if="sell_price" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Price</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ sell_price }}</div>
            </div>

            <div v-if="buy_time" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Time</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(buy_time)).format('YYYY MMM DD HH:mm') }}</div>
            </div>

            <div v-if="sell_time" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Time</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(sell_time)).format('YYYY MMM DD HH:mm') }}</div>
            </div>

            <div v-if="sell_trade_size" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Size</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ sell_trade_size }}</div>
            </div>

            <div v-if="buy_time_2" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Time 2</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(buy_time_2)).format('YYYY MMM DD HH:mm') }}</div>
            </div>

            <div v-if="buy_price_2" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Price 2</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ buy_price_2 }}</div>
            </div>

            <div v-if="buy_trade_size_5" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Size 2</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ buy_trade_size_2 }}</div>
            </div>

            <div v-if="sell_time_2" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Time 2</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(sell_time_2)).format('YYYY MMM DD HH:mm') }}</div>
            </div>

            <div v-if="sell_price_2" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Price 2</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ sell_price_2 }}</div>
            </div>

            <div v-if="sell_trade_size_2" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Size 2</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ sell_trade_size_2 }}</div>
            </div>

            <div v-if="buy_time_3" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Time 3</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(buy_time_3)).format('YYYY MMM DD HH:mm') }}</div>
            </div>

            <div v-if="buy_price_3" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Price 3</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ buy_price_3 }}</div>
            </div>

            <div v-if="buy_trade_size_3" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Size 3</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ buy_trade_size_3 }}</div>
            </div>

            <div v-if="sell_time_3" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Time 3</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(sell_time_3)).format('YYYY MMM DD HH:mm') }}</div>
            </div>

            <div v-if="sell_price_3" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Price 3</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ sell_price_3 }}</div>
            </div>

            <div v-if="sell_trade_size_3" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Size 3</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ sell_trade_size_3 }}</div>
            </div>

            <div v-if="buy_time_4" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Time 4</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(buy_time_4)).format('YYYY MMM DD HH:mm') }}</div>
            </div>

            <div v-if="buy_price_4" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Price 4</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ buy_price_4 }}</div>
            </div>

            <div v-if="buy_trade_size_4" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Size 4</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ buy_trade_size_4 }}</div>
            </div>

            <div v-if="sell_time_4" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Time 4</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(sell_time_4)).format('YYYY MMM DD HH:mm') }}</div>
            </div>

            <div v-if="sell_price_4" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Price 4</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ sell_price_4 }}</div>
            </div>

            <div v-if="sell_trade_size_4" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Size 4</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ sell_trade_size_4 }}</div>
            </div>

            <div v-if="buy_time_5" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Time 5</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(buy_time_5)).format('YYYY MMM DD HH:mm') }}</div>
            </div>

            <div v-if="buy_price_5" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Price 5</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ buy_price_5 }}</div>
            </div>

            <div v-if="buy_trade_size_5" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Buy Size 5</div>
                <div class="flex-auto text-justify text-blue-300 block">{{buy_trade_size_5 }}</div>
            </div>

            <div v-if="sell_time_5" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Time 5</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(sell_time_5)).format('YYYY MMM DD HH:mm') }}</div>
            </div>

            <div v-if="sell_price_5" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Price 5</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ sell_price_5 }}</div>
            </div>

            <div v-if="sell_trade_size_5" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                <div class="flex-auto">Sell Size 5</div>
                <div class="flex-auto text-justify text-blue-300 block">{{ sell_trade_size_5 }}</div>
            </div>

            <a target="_new" :href="'https://www.binance.com/en/trade/'+pair+'?theme=dark&type=cross&ref=W5BD94FW'" class="group bg-indigo-900 flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
                <div class="flex-auto font-bold" style="color:#F0B90B;">Binance</div>
            </a>

        </div>
    </div>
  </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, computed, defineComponent, inject } from "vue"
import axios from "~/utils/axios"
import moment from "moment"
import _ from "lodash"
import { startStats, endStats } from '~/modules/stats'
import { useHead } from '@vueuse/head'
import BigNumber from 'bignumber.js'

export default defineComponent({
  name: "signal",
  props: {
    id: String,
  },
  setup: (props) => {

    startStats(Date.now())

    const state = reactive({
      signal_type: null,
      pair: null,
      stratname: "",
      stratid: null,
      pnl: 0,
      buy_price: null,
      sell_price: null,
      buy_time: null,
      sell_time: null,
      buy_trade_size: null,
      sell_trade_size: null,
      buy_time_2: null,
      sell_time_2: null,
      buy_price_2: null,
      sell_price_2: null,
      trade_size_2: null,
      buy_trade_size_2: null,
      sell_trade_size_2: null,
      buy_time_3: null,
      sell_time_3: null,
      buy_price_3: null,
      sell_price_3: null,
      trade_size_3: null,
      buy_trade_size_3: null,
      sell_trade_size_3: null,
      buy_time_4: null,
      sell_time_4: null,
      buy_price_4: null,
      sell_price_4: null,
      buy_trade_size_4: null,
      sell_trade_size_4: null,
      buy_time_5: null,
      sell_time_5: null,
      buy_price_5: null,
      sell_price_5: null,
      buy_trade_size_5: null,
      sell_trade_size_5: null,
      ///////// ///////// ///////// /////////
      series: [{ name: 'candle', data: [] }],
      chartOptions: {
        chart: { height: 400, type: 'candlestick' },
        tooltip: { enabled: true, theme: 'dark' },
        annotations: {
          points: [
            { marker: { size: 8, fillColor: "red" }, label: { text: '' } },
            { marker: { size: 8, fillColor: "green" }, label: { text: '' } },
            { marker: { size: 8, fillColor: "red" }, label: { text: '' } },
            { marker: { size: 8, fillColor: "green" }, label: { text: '' } },
            { marker: { size: 8, fillColor: "red" }, label: { text: '' } },
            { marker: { size: 8, fillColor: "green" }, label: { text: '' } },
            { marker: { size: 8, fillColor: "red" }, label: { text: '' } },
            { marker: { size: 8, fillColor: "green" }, label: { text: '' } },
            { marker: { size: 8, fillColor: "red" }, label: { text: '' } },
            { marker: { size: 8, fillColor: "green" }, label: { text: '' } },
          ]
        },
        xaxis: { type: 'category', floating: true },
        yaxis: { show: false, tooltip: { enabled: false } }
      }
      ///////// ///////// ///////// /////////
    })

    useHead({
        title: computed( () => state.stratname + " " + state.pair + " Trading Signal Performnce & Chart"),
        meta: [
            {
            name: `description`,
            content: computed(() => state.stratname + " " + state.pair + " trading signal chart and historical performance tracked by BVA."),
            },
        ],
    })

    onMounted(() => {
      ////// ////// ////// ////// //////
      console.log("ID", props.id)
      axios.get('/api/signal?id='+props.id)
        .then( signal => {
          //console.log(signal.data[0])

          state.pair = signal.data[0].pair
          state.stratname = signal.data[0].stratname
          state.stratid = signal.data[0].stratid
          state.signal_type = signal.data[0].type
          state.buy_price = signal.data[0].buy_price
          state.sell_price = signal.data[0].sell_price
          state.buy_time = signal.data[0].buy_time
          state.sell_time = signal.data[0].sell_time
          state.buy_trade_size = signal.data[0].buy_trade_size
          state.sell_trade_size = signal.data[0].sell_trade_size
          state.buy_time_2 = signal.data[0].buy_time_2
          state.sell_time_2 = signal.data[0].sell_time_2
          state.buy_price_2 = signal.data[0].buy_price_2
          state.sell_price_2 = signal.data[0].sell_price_2
          state.buy_trade_size_2 = signal.data[0].buy_trade_size_2
          state.sell_trade_size_2 = signal.data[0].sell_trade_size_2
          state.buy_time_3 = signal.data[0].buy_time_3
          state.sell_time_3 = signal.data[0].sell_time_3
          state.buy_price_3 = signal.data[0].buy_price_3
          state.sell_price_3 = signal.data[0].sell_price_3
          state.buy_trade_size_3 = signal.data[0].buy_trade_size_3
          state.sell_trade_size_3 = signal.data[0].sell_trade_size_3
          state.buy_time_4 = signal.data[0].buy_time_4
          state.sell_time_4 = signal.data[0].sell_time_4
          state.buy_price_4 = signal.data[0].buy_price_4
          state.sell_price_4 = signal.data[0].sell_price_4
          state.buy_trade_size_4 = signal.data[0].buy_trade_size_4
          state.sell_trade_size_4 = signal.data[0].sell_trade_size_4
          state.buy_time_5 = signal.data[0].buy_time_5
          state.sell_time_5 = signal.data[0].sell_time_5
          state.buy_price_5 = signal.data[0].buy_price_5
          state.sell_price_5 = signal.data[0].sell_price_5
          state.buy_trade_size_5 = signal.data[0].buy_trade_size_5
          state.sell_trade_size_5 = signal.data[0].sell_trade_size_5
          state.pnl = Number(signal.data[0].pnl).toFixed(2)

          const startTime = state.signal_type === 'LONG' ? Number(signal.data[0].buy_time) - 49000000 : Number(signal.data[0].sell_time) - 49000000
          let last_trade_time = 0
          if (state.signal_type === 'SHORT') {
            if (Number(signal.data[0].buy_time_5) > 0) {
              last_trade_time = Number(signal.data[0].buy_time_5) + 49000000
            } 
            else if (Number(signal.data[0].buy_time_4) > 0) {
              last_trade_time = Number(signal.data[0].buy_time_4) + 49000000
            }
            else if (Number(signal.data[0].buy_time_3) > 0) {
              last_trade_time = Number(signal.data[0].buy_time_3) + 49000000
            }
            else if (Number(signal.data[0].buy_time_2) > 0) {
              last_trade_time = Number(signal.data[0].buy_time_2) + 49000000
            }
            else {
              last_trade_time = Number(signal.data[0].buy_time) + 49000000
            }
          }
          else {
            if (Number(signal.data[0].sell_time_5) > 0) {
              last_trade_time = Number(signal.data[0].sell_time_5) + 49000000
            } 
            else if (Number(signal.data[0].sell_time_4) > 0) {
              last_trade_time = Number(signal.data[0].sell_time_4) + 49000000
            }
            else if (Number(signal.data[0].sell_time_3) > 0) {
              last_trade_time = Number(signal.data[0].sell_time_3) + 49000000
            }
            else if (Number(signal.data[0].sell_time_2) > 0) {
              last_trade_time = Number(signal.data[0].sell_time_2) + 49000000
            }
            else {
              last_trade_time = Number(signal.data[0].sell_time) + 49000000
            }
          }
          const endTime = signal.data[0].pnl ? last_trade_time : Date.now()
          
          let interv = '15m'
          if ( ((endTime-startTime)/86400000) > 4) { interv = '1h' }
          else if ( ((endTime-startTime)/86400000) > 20) { interv = '1d' }

          axios.get('https://api.binance.com/api/v3/klines?interval='+interv+'&symbol='+signal.data[0].pair+'&startTime='+startTime+'&endTime=' + endTime)
          .then( prices => {
            let data = []
            
            for ( var price of prices.data ) {
              data.push({
                x: moment(price[0]).format('MMM DD HH:mm'),
                y: [ Number(price[1]), Number(price[2]), Number(price[3]), Number(price[4]) ]
              })
              
              if ( price[0] < Number(signal.data[0].sell_time) && Number(signal.data[0].sell_time) < (price[0]+86400000) ) {
                state.chartOptions.annotations.points[0].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[0].y = Number(signal.data[0].sell_price)
                state.chartOptions.annotations.points[0].label.text = 'SELL'
              }

              if ( price[0] < Number(signal.data[0].buy_time) && Number(signal.data[0].buy_time) < (price[0]+86400000) ) {
                state.chartOptions.annotations.points[1].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[1].y = Number(signal.data[0].buy_price)
                state.chartOptions.annotations.points[1].label.text = 'BUY'
              }

              if ( price[0] < Number(signal.data[0].sell_time_2) && Number(signal.data[0].sell_time_2) < (price[0]+86400000) ) {
                state.chartOptions.annotations.points[2].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[2].y = Number(signal.data[0].sell_price_2)
                state.chartOptions.annotations.points[2].label.text = 'SELL2'
              }

              if ( price[0] < Number(signal.data[0].buy_time_2) && Number(signal.data[0].buy_time_2) < (price[0]+86400000) ) {
                state.chartOptions.annotations.points[3].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[3].y = Number(signal.data[0].buy_price_2)
                state.chartOptions.annotations.points[3].label.text = 'BUY2'
              }

              if ( price[0] < Number(signal.data[0].sell_time_3) && Number(signal.data[0].sell_time_3) < (price[0]+86400000) ) {
                state.chartOptions.annotations.points[4].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[4].y = Number(signal.data[0].sell_price_3)
                state.chartOptions.annotations.points[4].label.text = 'SELL3'
              }

              if ( price[0] < Number(signal.data[0].buy_time_3) && Number(signal.data[0].buy_time_3) < (price[0]+86400000) ) {
                state.chartOptions.annotations.points[5].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[5].y = Number(signal.data[0].buy_price_3)
                state.chartOptions.annotations.points[5].label.text = 'BUY3'
              }

              if ( price[0] < Number(signal.data[0].sell_time_4) && Number(signal.data[0].sell_time_4) < (price[0]+86400000) ) {
                state.chartOptions.annotations.points[6].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[6].y = Number(signal.data[0].sell_price_4)
                state.chartOptions.annotations.points[6].label.text = 'SELL4'
              }

              if ( price[0] < Number(signal.data[0].buy_time_4) && Number(signal.data[0].buy_time_4) < (price[0]+86400000) ) {
                state.chartOptions.annotations.points[7].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[7].y = Number(signal.data[0].buy_price_4)
                state.chartOptions.annotations.points[7].label.text = 'BUY4'
              }

              if ( price[0] < Number(signal.data[0].sell_time_5) && Number(signal.data[0].sell_time_5) < (price[0]+86400000) ) {
                state.chartOptions.annotations.points[8].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[8].y = Number(signal.data[0].sell_price_5)
                state.chartOptions.annotations.points[8].label.text = 'SELL5'
              }

              if ( price[0] < Number(signal.data[0].buy_time_5) && Number(signal.data[0].buy_time_5) < (price[0]+86400000) ) {
                state.chartOptions.annotations.points[9].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[9].y = Number(signal.data[0].buy_price_5)
                state.chartOptions.annotations.points[9].label.text = 'BUY5'
              }
            }
            //state.series.push({'data': data})
            //console.log(JSON.stringify(state.series))
            state.series[0].data = data
            if (signal.data[0].pnl === null) {
              const last_price = new BigNumber(prices.data[prices.data.length-1][4])
              console.log("===last_price===>", last_price.toString() )
              // LONG //
              if (state.signal_type === 'LONG') {
                const sum_trade_size = Number(signal.data[0].buy_trade_size_4) + Number(signal.data[0].buy_trade_size_3) + Number(signal.data[0].buy_trade_size_2) + Number(signal.data[0].buy_trade_size)
                if ( Number(signal.data[0].buy_price_4) > 0 ) {
                  const pnl_4 = last_price.minus(signal.data[0].buy_price_4).times(signal.data[0].buy_trade_size_4).times(100).dividedBy(signal.data[0].buy_price_4).dividedBy(sum_trade_size)
                  const pnl_3 = last_price.minus(signal.data[0].buy_price_3).times(signal.data[0].buy_trade_size_3).times(100).dividedBy(signal.data[0].buy_price_3).dividedBy(sum_trade_size)
                  const pnl_2 = last_price.minus(signal.data[0].buy_price_2).times(signal.data[0].buy_trade_size_2).times(100).dividedBy(signal.data[0].buy_price_2).dividedBy(sum_trade_size)
                  const pnl_1 = last_price.minus(signal.data[0].buy_price).times(signal.data[0].buy_trade_size).times(100).dividedBy(signal.data[0].buy_price).dividedBy(sum_trade_size)
                  state.pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).toString())
                  console.log("===PNL===>", signal.data[0].buy_trade_size_4 )
                }
                else if ( Number(signal.data[0].buy_price_3) > 0 ) {
                  const pnl_3 = last_price.minus(signal.data[0].buy_price_3).times(signal.data[0].buy_trade_size_3).times(100).dividedBy(signal.data[0].buy_price_3).dividedBy(sum_trade_size)
                  const pnl_2 = last_price.minus(signal.data[0].buy_price_2).times(signal.data[0].buy_trade_size_2).times(100).dividedBy(signal.data[0].buy_price_2).dividedBy(sum_trade_size)
                  const pnl_1 = last_price.minus(signal.data[0].buy_price).times(signal.data[0].buy_trade_size).times(100).dividedBy(signal.data[0].buy_price).dividedBy(sum_trade_size)
                  state.pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).toString())
                }
                else if ( Number(signal.data[0].buy_price_2) > 0 ) {
                  const pnl_2 = last_price.minus(signal.data[0].buy_price_2).times(signal.data[0].buy_trade_size_2).times(100).dividedBy(signal.data[0].buy_price_2).dividedBy(sum_trade_size)
                  const pnl_1 = last_price.minus(signal.data[0].buy_price).times(signal.data[0].buy_trade_size).times(100).dividedBy(signal.data[0].buy_price).dividedBy(sum_trade_size)
                  state.pnl = Number(pnl_1.plus(pnl_2).toString())
                }
                else {
                  const pnl_1 = last_price.minus(signal.data[0].buy_price).times(signal.data[0].buy_trade_size).times(100).dividedBy(signal.data[0].buy_price).dividedBy(sum_trade_size)
                  state.pnl = Number(pnl_1.toString())
                }
                console.log('pnl: ' + state.pnl)
              }
              // SHORT //
              else {                
                const sum_trade_size = Number(signal.data[0].buy_trade_size_4) + Number(signal.data[0].buy_trade_size_3) + Number(signal.data[0].buy_trade_size_2) + Number(signal.data[0].buy_trade_size)
                if ( Number(signal.data[0].sell_price_4) > 0 ) {
                    const sell_price_4 = new BigNumber(signal.data[0].sell_price_4)
                    const sell_price_3 = new BigNumber(signal.data[0].sell_price_3)
                    const sell_price_2 = new BigNumber(signal.data[0].sell_price_2)
                    const sell_price = new BigNumber(signal.data[0].sell_price)
                    const pnl_4 = sell_price_4.minus(last_price).times(signal.data[0].sell_trade_size_4).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                    const pnl_3 = sell_price_3.minus(last_price).times(signal.data[0].sell_trade_size_3).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                    const pnl_2 = sell_price_2.minus(last_price).times(signal.data[0].sell_trade_size_2).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                    const pnl_1 = sell_price.minus(last_price).times(signal.data[0].sell_trade_size).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                    state.pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).toString())
                }
                else if ( Number(signal.data[0].sell_price_3) > 0 ) {
                    const sell_price_3 = new BigNumber(signal.data[0].sell_price_3)
                    const sell_price_2 = new BigNumber(signal.data[0].sell_price_2)
                    const sell_price = new BigNumber(signal.data[0].sell_price)
                    const pnl_3 = sell_price_3.minus(last_price).times(signal.data[0].sell_trade_size_3).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                    const pnl_2 = sell_price_2.minus(last_price).times(signal.data[0].sell_trade_size_2).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                    const pnl_1 = sell_price.minus(last_price).times(signal.data[0].sell_trade_size).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                    state.pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).toString())
                }
                else if ( Number(signal.data[0].sell_price_2) > 0 ) {
                    const sell_price_2 = new BigNumber(signal.data[0].sell_price_2)
                    const sell_price = new BigNumber(signal.data[0].sell_price)
                    const pnl_2 = sell_price_2.minus(last_price).times(signal.data[0].sell_trade_size_2).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                    const pnl_1 = sell_price.minus(last_price).times(signal.data[0].sell_trade_size).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                    state.pnl = Number(pnl_1.plus(pnl_2).toString())
                }
                else {
                    const sell_price = new BigNumber(signal.data[0].sell_price)
                    const pnl_1 = sell_price.minus(last_price).times(signal.data[0].sell_trade_size).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                    state.pnl = Number(pnl_1.toString())
                }
              }
              state.pnl = state.pnl - 0.1
              state.pnl = state.pnl.toFixed(2)
            }

            endStats(Date.now())
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })
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
