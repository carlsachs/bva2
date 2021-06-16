<template>
  <div>

    <div ref="myEl" class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">

      <h1 class="text-5xl mb-7 text-uppercase font-semibold">{{ pair }}</h1>

      <apexchart type="candlestick" height="400" :options="chartOptions" :series="series"></apexchart>
      
      <div class="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-5 uppercase">
        <div class="flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
            <div class="flex-auto">Pair</div>
            <div class="flex-auto text-justify text-blue-300 block">{{ pair }}</div>
        </div>

        <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
            <div class="flex-auto">Type</div>
            <div class="flex-auto text-justify text-blue-300 block">{{ signal_type }}</div>
        </div>

        <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
            <div class="flex-auto">PNL</div>
            <div class="flex-auto text-justify text-blue-300 block">{{ pnl }}%</div>
        </div>

        <div v-if="buy_price" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
            <div class="flex-auto">Buy Price</div>
            <div class="flex-auto text-justify text-blue-300 block">{{ buy_price }}</div>
        </div>

        <div v-if="sell_price" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
            <div class="flex-auto">Sell Price</div>
            <div class="flex-auto text-justify text-blue-300 block">{{ sell_price }}</div>
        </div>

        <div v-if="buy_time" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
            <div class="flex-auto">Buy Time</div>
            <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(buy_time)).format('YYYY MMM DD HH:mm') }}</div>
        </div>

        <div v-if="sell_time" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
            <div class="flex-auto">Sell Time</div>
            <div class="flex-auto text-justify text-blue-300 block">{{ moment(Number(sell_time)).format('YYYY MMM DD HH:mm') }}</div>
        </div>

        <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
            <div class="flex-auto">Quantity</div>
            <div class="flex-auto text-justify text-blue-300 block">{{ qty }}</div>
        </div>
      </div>

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
                        <div class="text-center">SIDE</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">BUY PRICE</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">SELL PRICE</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody v-if="orders" class="divide-y divide-gray-200 cursor-pointer hover:bg-blue-900 hover:bg-opacity-40 visited:bg-blue-900 visited:bg-opacity-40" v-for="(row, i) in orders" :key="row.id">
                    <tr>
                      <td class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                          {{ moment(Number(row.updated_time)).format() }}
                      </td>
                      <td class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                        {{ row.pair }}
                      </td>
                      <td v-if="row.type==='SHORT'" class="text-orange-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                          {{ row.type }}
                      </td>
                      <td v-else class="text-blue-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                          {{ row.type }}
                      </td>
                      <td class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                          {{ row.price }}
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
import _ from "lodash"
import { startStats, endStats } from '~/modules/stats'
import { useRequest } from 'vue-request'


export default defineComponent({
  name: "trade",
  props: {
    id: String,
  },
  setup: (props) => {
    startStats(Date.now())

    const auth0: any = inject("auth0")

    const state = reactive({
      ///////// ///////// ///////// /////////
      id: auth0.state.user?.data?.info?.id,
      username: auth0.state.user?.data?.info?.nickname,
      token: auth0.state.user?.data?.info?.token,
      email: auth0.state.user?.data?.info?.email,
      subs: auth0.state.user?.subs,
      ///////// ///////// ///////// /////////
      signal_type: null,
      pair: null,
      pnl: 0,
      buy_price: null,
      sell_price: null,
      buy_time: null,
      sell_time: null,
      qty: null,
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

    const getOrders = () => {
      console.log("getOrders", auth0.state?.user?.data.email, props.id, auth0.state?.user?.token)
      return axios.get('/api/orders?email='+auth0.state?.user?.data.email+'&id='+props.id, { headers: {Authorization:`Bearer ${auth0.state?.user?.token}`} })
    }

    const { data: orders, run } = useRequest( () => getOrders(), {
      cacheKey: 'orders',
      manual: true,
      cacheTime: 300000,
      pollingInterval: 6000,
      formatResult: res => {
        return res.data
      },
      onSuccess: (res) => {
        console.log("ORDERS->", res.length)
      }
    })

    watch( () => auth0.state?.user?.data, (user) => {
      console.log("WATCH USER DATA ::::::::::::: ", JSON.stringify(user.nickname))
      state.username = user.nickname
      state.id = user.id
      state.email = user.email
      state.subs = user.subs
      state.token = auth0.state.user?.token
      run()
    })

    onMounted(() => {
      ////// ////// ////// ////// //////
      console.log("ID", props.id, auth0.state?.user?.data?.nickname)
      if (auth0.state.user?.token) {
        console.log("run =======>", auth0.state.user?.token)
        run()
      }
      axios.get('/api/trade?id='+props.id)
        .then( signal => {
          state.pair = signal.data[0].pair
          state.signal_type = signal.data[0].type
          state.buy_price = signal.data[0].buy_price
          state.sell_price = signal.data[0].sell_price
          state.buy_time = signal.data[0].buy_time
          state.sell_time = signal.data[0].sell_time
          state.pnl = Number(signal.data[0].pnl).toFixed(2)
          state.qty = Number(signal.data[0].qty)
          const startTime = state.signal_type === 'LONG' ? Number(signal.data[0].buy_time) - 19000000 : Number(signal.data[0].sell_time) - 19000000
          const endTime = signal.data[0].pnl ? (signal.data[0].type === "SHORT" ? Number(signal.data[0].buy_time) + 19000000 : Number(signal.data[0].sell_time) + 19000000) : Date.now()
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
                //console.log( "=======>", price[0] , price[1] )
                state.chartOptions.annotations.points[0].x = moment(price[0]).format('MMM DD HH:mm')
                state.chartOptions.annotations.points[0].y = Number(signal.data[0].sell_price)
                state.chartOptions.annotations.points[0].label.text = 'SELL'
              }
              if ( price[0] < Number(signal.data[0].buy_time) && Number(signal.data[0].buy_time) < (price[0]+86400000) ) {
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
            endStats(Date.now())
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

    const myEl = ref(null)
    
    return {
      ...toRefs(state),
      moment,
      myEl,
      orders
    }
  },
})
</script>

<style>
</style>
