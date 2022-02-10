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

        <div v-if="status" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
            <div class="flex-auto">Status</div>
            <div class="flex-auto text-justify text-blue-300 block">{{ status }}</div>
        </div>

        <!--div v-if="market_type" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
            <div class="flex-auto">Type</div>
            <div class="flex-auto text-justify text-blue-300 block">{{ market_type }}</div>
        </div-->

        <div v-if="auth0.state?.user?.data?.id===userid && !delTradeconfirm && status!=='DELETED' " @click="confirmDelTrade" class="group flex items-center bg-opacity-10 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
            <div class="flex-auto font-bold">Delete</div>
        </div>
        <div v-if="auth0.state?.user?.data?.id===userid && delTradeconfirm && status!=='DELETED' " @click="delTrade" class="group flex items-center bg-red-900 bg-opacity-90 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-opacity-100 transition">
            <div class="flex-auto font-bold">Confirm</div>
        </div>

        <div v-if="auth0.state?.user?.data?.id===userid && (status==='TRADED' || status==='STOPPED' || status==='FAILED') && !closeTradeconfirm && status!=='CLOSED' " @click="confirmCloseTrade" class="group flex items-center bg-opacity-10 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
            <div class="flex-auto font-bold">Close</div>
        </div>
        <div v-if="auth0.state?.user?.data?.id===userid && (status==='TRADED' || status==='STOPPED' || status==='FAILED') && closeTradeconfirm && status!=='CLOSED' " @click="closeTrade" class="group flex items-center bg-red-900 bg-opacity-90 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-opacity-100 transition">
            <div class="flex-auto font-bold">Confirm</div>
        </div>

        <div v-if="auth0.state?.user?.data?.id===userid && status==='TRADED' && !stopTradeconfirm && status!=='STOPPED' " @click="confirmStopTrade" class="group flex items-center bg-opacity-10 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
            <div class="flex-auto font-bold">Stop</div>
        </div>
        <div v-if="auth0.state?.user?.data?.id===userid && status==='TRADED' && stopTradeconfirm && status!=='STOPPED' " @click="stopTrade" class="group flex items-center bg-red-900 bg-opacity-90 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-opacity-100 transition">
            <div class="flex-auto font-bold">Confirm</div>
        </div>

        <a target="_new" :href="'https://www.binance.com/en/trade/'+pair+'?theme=dark&type=cross&ref=W5BD94FW'" class="group bg-indigo-900 flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
            <div class="flex-auto font-bold" style="color:#F0B90B;">Binance</div>
        </a>

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
                        <div class="text-center">QTY</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">PRICE</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">RESULT</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody v-if="orders" class="divide-y divide-gray-200 cursor-pointer hover:bg-blue-900 hover:bg-opacity-40 visited:bg-blue-900 visited:bg-opacity-40" v-for="(row, i) in orders" :key="row.id">
                    <tr>
                      <td class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                          {{ moment(Number(row.updated_time)).format('YYYY MMM DD HH:mm') }}
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
                      <td class="text-blue-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                          {{ row.qty }}
                      </td>
                      <td class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                          {{ row.price }}
                      </td>
                      <td v-if="row.result" class="text-blue-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                          {{ row.result }}
                      </td>
                      <td v-else class="text-orange-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                          {{ row.error }}
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
import { useRouter } from "vue-router"
import BigNumber from 'bignumber.js'

export default defineComponent({
  name: "trade",
  props: {
    id: String,
  },
  setup: (props) => {
    startStats(Date.now())

    const router = useRouter()
    const auth0: any = inject("auth0")

    const state = reactive({
      ///////// ///////// ///////// /////////
      id: auth0.state.user?.data?.id,
      username: auth0.state.user?.data?.nickname,
      token: auth0.state.user?.data?.token,
      email: auth0.state.user?.data?.email,
      subs: auth0.state.user?.subs,
      ///////// ///////// ///////// /////////
      signal_type: null,
      pair: null,
      stratname: "",
      stratid: null,
      pnl: 0,
      buy_price: null,
      sell_price: null,
      buy_time: null,
      sell_time: null,
      qty: null,
      ///////// ///////// ///////// /////////
      buy_trade_size: null,
      sell_trade_size: null,
      buy_time_2: null,
      sell_time_2: null,
      buy_price_2: null,
      sell_price_2: null,
      trade_size_2: null,
      buy_trade_size_2: null,
      qty_buy_2: null,
      qty_sell_2: null,
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
      status: null,
      market_type: null,
      userid: null,
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
      },
      ///////// ///////// ///////// /////////
      delTradeconfirm: false,
      closeTradeconfirm: false,
      stopTradeconfirm: false,
    })

    const getOrders = () => {
      console.log("getOrdersXXXXXXXXX", auth0.state?.user?.data.email, props.id, auth0.state?.user?.token)
      return axios.get('/api/orders?sub='+auth0.state?.user?.data.sub+'&id='+props.id, { headers: {Authorization:`Bearer ${auth0.state?.user?.token}`} })
    }

    const { data: orders, run } = useRequest( () => getOrders(), {
      cacheKey: 'orders',
      manual: true,
      //cacheTime: 300000,
      pollingInterval: 9000,
      formatResult: res => {
        console.log("formatResult=======>", res)
        return res.data
      },
      onSuccess: (res) => {
        console.log("ORDERS->", res.length)
      }
    })

    watch( () => auth0.state?.user?.data, (user) => {
      console.log("WATCH USER DATA ::::::::::::: ", JSON.stringify(user.nickname),  user.id, state.userid)
      if ( user.id !== state.userid) {
        router.replace("/subscriptions")
      }
      else {
        state.username = user.nickname
        state.id = user.id
        state.email = user.email
        state.subs = user.subs
        state.token = auth0.state.user?.token
        run()
      }
    })

    onMounted(() => {
      ////// ////// ////// ////// //////
      console.log("ID", props.id, auth0.state?.user?.data?.nickname, auth0.state.user?.token)
      if (auth0.state.user?.token) {
        console.log("run =======>", auth0.state.user?.token)
        run()
      }
      axios.get('/api/trade?id='+props.id)
        .then( signal => {
          state.userid = signal.data[0].userid
          state.pair = signal.data[0].pair
          state.stratname = signal.data[0].stratname
          state.stratid = signal.data[0].stratid
          state.signal_type = signal.data[0].type
          state.buy_time = signal.data[0].buy_time
          state.sell_time = signal.data[0].sell_time
          
          state.buy_price = signal.data[0].buy_price
          state.sell_price = signal.data[0].sell_price
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

          state.qty = Number(signal.data[0].qty)
          state.pnl = Number(signal.data[0].pnl).toFixed(2)
          state.market_type = signal.data[0].market_type
          state.status = signal.data[0].status
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
            /*
            state.series[0].data = data
            if (signal.data[0].pnl == null) {
              const last_price = Number(prices.data[prices.data.length-1][4])
              state.pnl = (state.signal_type === 'LONG') ? (100 * (last_price-state.buy_price)/state.buy_price) : (100 * (state.sell_price-last_price)/last_price)
              state.pnl = state.pnl.toFixed(2)
            }
            */

            state.series[0].data = data
            if (signal.data[0].pnl === null) {
              const last_price = new BigNumber(prices.data[prices.data.length-1][4])

              if (Number(signal.data[0]?.buy_trade_size)>0 || Number(signal.data[0]?.sell_trade_size)>0) {
                //DCA
                const sum_buy_trade_size = Number(signal.data[0]?.buy_trade_size) 
                    + Number(signal.data[0]?.buy_trade_size_2) 
                    + Number(signal.data[0]?.buy_trade_size_3) 
                    + Number(signal.data[0]?.buy_trade_size_4) 
                    + Number(signal.data[0]?.buy_trade_size_5)
                //console.log("sum_buy_trade_size", sum_buy_trade_size.toFixed(2))

                const sum_sell_trade_size = Number(signal.data[0]?.sell_trade_size) 
                    + Number(signal.data[0]?.sell_trade_size_2) 
                    + Number(signal.data[0]?.sell_trade_size_3) 
                    + Number(signal.data[0]?.sell_trade_size_4) 
                    + Number(signal.data[0]?.sell_trade_size_5)
                //console.log("sum_sell_trade_size", sum_sell_trade_size.toFixed(2))

                if (state.signal_type === 'LONG') {

                  const buy_price_5 = new BigNumber(signal.data[0]?.buy_price_5||0)
                  const dca_buy_price_5 = buy_price_5.times(signal.data[0]?.buy_trade_size_5||0).div(sum_buy_trade_size)
                  //console.log("dca_buy_price_5", dca_buy_price_5.toFixed(2))
                  const buy_price_4 = new BigNumber(signal.data[0]?.buy_price_4||0)
                  const dca_buy_price_4 = buy_price_4.times(signal.data[0]?.buy_trade_size_4||0).div(sum_buy_trade_size)
                  //console.log("dca_buy_price_4", dca_buy_price_4.toFixed(2))
                  const buy_price_3 = new BigNumber(signal.data[0]?.buy_price_3||0)
                  const dca_buy_price_3 = buy_price_3.times(signal.data[0]?.buy_trade_size_3||0).div(sum_buy_trade_size)
                  //console.log("dca_buy_price_3", dca_buy_price_3.toFixed(2))
                  const buy_price_2 = new BigNumber(signal.data[0]?.buy_price_2||0)
                  const dca_buy_price_2 = buy_price_2.times(signal.data[0]?.buy_trade_size_2||0).div(sum_buy_trade_size)
                  //console.log("dca_buy_price_2", dca_buy_price_2.toFixed(2))
                  const buy_price_1 = new BigNumber(signal.data[0]?.buy_price||0)
                  const dca_buy_price_1 = buy_price_1.times(signal.data[0]?.buy_trade_size||0).div(sum_buy_trade_size)
                  //console.log("dca_buy_price_1", dca_buy_price_1.toFixed(2))
                  const dca_buy_price = dca_buy_price_1.plus(dca_buy_price_2).plus(dca_buy_price_3).plus(dca_buy_price_4).plus(dca_buy_price_5)
                  //console.log("dca_buy_price", dca_buy_price.toFixed(2))
                  //console.log("last_price", last_price.toFixed(2))

                  if (sum_sell_trade_size) {
                    if (signal.data[0]?.sell_trade_size_4) {
                        const sell_price_4 = new BigNumber(signal.data[0].sell_price_4)
                        const sell_price_3 = new BigNumber(signal.data[0].sell_price_3)
                        const sell_price_2 = new BigNumber(signal.data[0].sell_price_2)
                        const sell_price_1 = new BigNumber(signal.data[0].sell_price)
                        const pnl_1 = sell_price_1.minus(dca_buy_price).times(signal.data[0].sell_trade_size).dividedBy(dca_buy_price)
                        const pnl_2 = sell_price_2.minus(dca_buy_price).times(signal.data[0].sell_trade_size_2).dividedBy(dca_buy_price)
                        const pnl_3 = sell_price_3.minus(dca_buy_price).times(signal.data[0].sell_trade_size_3).dividedBy(dca_buy_price)
                        const pnl_4 = sell_price_4.minus(dca_buy_price).times(signal.data[0].sell_trade_size_4).dividedBy(dca_buy_price) 
                        const pnl_5 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price)
                        state.pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).plus(pnl_5).times(100).minus(0.2).toFixed(2))
                    }
                    else if (signal.data[0]?.sell_trade_size_3) {
                        const sell_price_3 = new BigNumber(signal.data[0].sell_price_3)
                        const sell_price_2 = new BigNumber(signal.data[0].sell_price_2)
                        const sell_price_1 = new BigNumber(signal.data[0].sell_price)
                        const pnl_1 = sell_price_1.minus(dca_buy_price).times(signal.data[0].sell_trade_size).dividedBy(dca_buy_price)
                        const pnl_2 = sell_price_2.minus(dca_buy_price).times(signal.data[0].sell_trade_size_2).dividedBy(dca_buy_price)
                        const pnl_3 = sell_price_3.minus(dca_buy_price).times(signal.data[0].sell_trade_size_3).dividedBy(dca_buy_price)
                        const pnl_4 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price)
                        state.pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).times(100).minus(0.2).toFixed(2))
                    }
                    else if (signal.data[0]?.sell_trade_size_2) {
                        const sell_price_2 = new BigNumber(signal.data[0].sell_price_2)
                        const sell_price_1 = new BigNumber(signal.data[0].sell_price)
                        const pnl_1 = sell_price_1.minus(dca_buy_price).times(signal.data[0].sell_trade_size).dividedBy(dca_buy_price)
                        const pnl_2 = sell_price_2.minus(dca_buy_price).times(signal.data[0].sell_trade_size_2).dividedBy(dca_buy_price)
                        const pnl_3 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price)
                        state.pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).times(100).minus(0.2).toFixed(2))
                    }
                    else if (signal.data[0]?.sell_trade_size) {
                        const sell_price_1 = new BigNumber(signal.data[0].sell_price)
                        const pnl_1 = sell_price_1.minus(dca_buy_price).times(signal.data[0].sell_trade_size).dividedBy(dca_buy_price)
                        const pnl_2 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price)
                        state.pnl = Number(pnl_1.plus(pnl_2).times(100).minus(0.2).toFixed(2))
                    }
                  }
                  else {
                      state.pnl = Number(last_price.minus(dca_buy_price).div(dca_buy_price).times(100).minus(0.2).toFixed(2))
                      console.log("pnl", state.pnl)
                  }

                }
                else {
                  // SHORT //

                  const sell_price_5 = new BigNumber(signal.data[0]?.sell_price_5||0)
                  const dca_sell_price_5 = sell_price_5.times(signal.data[0]?.sell_trade_size_5||0).div(sum_sell_trade_size)
                  console.log("dca_sell_price_5", dca_sell_price_5.toFixed(2))
                  const sell_price_4 = new BigNumber(signal.data[0]?.sell_price_4||0)
                  const dca_sell_price_4 = sell_price_4.times(signal.data[0]?.sell_trade_size_4||0).div(sum_sell_trade_size)
                  console.log("dca_sell_price_4", dca_sell_price_4.toFixed(2))
                  const sell_price_3 = new BigNumber(signal.data[0]?.sell_price_3||0)
                  const dca_sell_price_3 = sell_price_3.times(signal.data[0]?.sell_trade_size_3||0).div(sum_sell_trade_size)
                  console.log("dca_sell_price_3", dca_sell_price_3.toFixed(2))
                  const sell_price_2 = new BigNumber(signal.data[0]?.sell_price_2||0)
                  const dca_sell_price_2 = sell_price_2.times(signal.data[0]?.sell_trade_size_2||0).div(sum_sell_trade_size)
                  console.log("dca_sell_price_2", dca_sell_price_2.toFixed(2))
                  const sell_price_1 = new BigNumber(signal.data[0]?.sell_price||0)
                  const dca_sell_price_1 = sell_price_1.times(signal.data[0]?.sell_trade_size||0).div(sum_sell_trade_size)
                  console.log("dca_sell_price_1", dca_sell_price_1.toFixed(2))
                  const dca_sell_price = dca_sell_price_1.plus(dca_sell_price_2).plus(dca_sell_price_3).plus(dca_sell_price_4).plus(dca_sell_price_5)
                  console.log("dca_sell_price", dca_sell_price.toFixed(2))
                  console.log("last_price", last_price.toFixed(2))

                  if (sum_buy_trade_size) {
                    if (signal.data[0]?.buy_trade_size_4) {
                        const buy_price_4 = new BigNumber(signal.data[0].buy_price_4)
                        const buy_price_3 = new BigNumber(signal.data[0].buy_price_3)
                        const buy_price_2 = new BigNumber(signal.data[0].buy_price_2)
                        const buy_price_1 = new BigNumber(signal.data[0].buy_price)
                        const pnl_1 = dca_sell_price.minus(buy_price_1).times(signal.data[0].buy_trade_size).dividedBy(buy_price_1)
                        const pnl_2 = dca_sell_price.minus(buy_price_2).times(signal.data[0].buy_trade_size_2).dividedBy(buy_price_2)
                        const pnl_3 = dca_sell_price.minus(buy_price_3).times(signal.data[0].buy_trade_size_3).dividedBy(buy_price_3)
                        const pnl_4 = dca_sell_price.minus(buy_price_4).times(signal.data[0].buy_trade_size_4).dividedBy(buy_price_4) 
                        const pnl_5 = dca_sell_price.minus(last_price).times(100 - sum_sell_trade_size).dividedBy(last_price)
                        state.pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).plus(pnl_5).times(100).minus(0.2).toFixed(2))
                    }
                    else if (signal.data[0]?.buy_trade_size_3) {
                        const buy_price_3 = new BigNumber(signal.data[0].buy_price_3)
                        const buy_price_2 = new BigNumber(signal.data[0].buy_price_2)
                        const buy_price_1 = new BigNumber(signal.data[0].buy_price)
                        const pnl_1 = dca_sell_price.minus(buy_price_1).times(signal.data[0].buy_trade_size).dividedBy(buy_price_1)
                        const pnl_2 = dca_sell_price.minus(buy_price_2).times(signal.data[0].buy_trade_size_2).dividedBy(buy_price_2)
                        const pnl_3 = dca_sell_price.minus(buy_price_3).times(signal.data[0].buy_trade_size_3).dividedBy(buy_price_3)
                        const pnl_4 = dca_sell_price.minus(last_price).times(100 - sum_sell_trade_size).dividedBy(last_price)
                        state.pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).times(100).minus(0.2).toFixed(2))
                    }
                    else if (signal.data[0]?.buy_trade_size_2) {
                        const buy_price_2 = new BigNumber(signal.data[0].buy_price_2)
                        const buy_price_1 = new BigNumber(signal.data[0].buy_price)
                        const pnl_1 = dca_sell_price.minus(buy_price_1).times(signal.data[0].buy_trade_size).dividedBy(buy_price_1)
                        const pnl_2 = dca_sell_price.minus(buy_price_2).times(signal.data[0].buy_trade_size_2).dividedBy(buy_price_2)
                        const pnl_3 = dca_sell_price.minus(last_price).times(100 - sum_sell_trade_size).dividedBy(last_price)
                        state.pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).times(100).minus(0.2).toFixed(2))
                    }
                    else if (signal.data[0]?.buy_trade_size) {
                        const buy_price_1 = new BigNumber(signal.data[0].buy_price)
                        const pnl_1 = dca_sell_price.minus(buy_price_1).times(signal.data[0].buy_trade_size).dividedBy(buy_price_1)
                        const pnl_2 = dca_sell_price.minus(last_price).times(100 - sum_sell_trade_size).dividedBy(last_price)
                        state.pnl = Number(pnl_1.plus(pnl_2).times(100).minus(0.2).toFixed(2))
                    }
                  }
                  else {
                      state.pnl = Number(dca_sell_price.minus(last_price).div(last_price).times(100).minus(0.2).toFixed(2))
                  }
                }
              }
              else {
                const sell_price = Number(signal.data[0]?.sell_price)
                const buy_price = Number(signal.data[0]?.buy_price)
                if (state.signal_type === 'LONG') {
                    state.pnl = ((100 * (Number(last_price) - buy_price) / buy_price) - 0.2).toFixed(2)
                }
                else {
                    state.pnl = ((100 * (sell_price - Number(last_price)) / Number(last_price)) - 0.2 ).toFixed(2)                   
                }
              }
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

    
    const confirmDelTrade = async () => {
      state.delTradeconfirm = true
    }

    const delTrade = async () => {
      console.log("-del-", props.id)
      state.status = 'DELETED'
      await axios.post('/api/deltrade?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
        { 
          tid: props.id,
          email:auth0.state?.user?.email, 
        },
        { headers: {Authorization:`Bearer ${auth0.state.user?.token}`} }
      )
      .then( (response) => {
        console.log("delTrade result:", response.data)
      })
      .catch( (error) => {
        console.log("delTrade ERROR", error)
      })
    }

    const confirmStopTrade = async () => {
      state.stopTradeconfirm = true
    }

    const stopTrade = async () => {
      console.log("-stop-", props.id)
      state.status = 'STOPPED'
      await axios.post('/api/stoptrade?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
        { 
          tid: props.id,
          email:auth0.state?.user?.email, 
        },
        { headers: {Authorization:`Bearer ${auth0.state.user?.token}`} }
      )
      .then( (response) => {
        console.log("stopTrade result:", response.data)
      })
      .catch( (error) => {
        console.log("stopTrade ERROR", error)
      })
    }

    const confirmCloseTrade = async () => {
      state.closeTradeconfirm = true
    }

    const closeTrade = async () => {
      console.log("-close-", props.id)
      state.status = 'CLOSED'
      await axios.post('/api/closetrade?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
        { 
          tid: props.id,
          email:auth0.state?.user?.email, 
        },
        { headers: {Authorization:`Bearer ${auth0.state.user?.token}`} }
      )
      .then( (response) => {
        console.log("closeTrade result:", response.data)
      })
      .catch( (error) => {
        console.log("closeTrade ERROR", error)
      })
    }

    const myEl = ref(null)
    
    return {
      ...toRefs(state),
      moment,
      myEl,
      orders,
      auth0,
      delTrade,
      confirmDelTrade,
      stopTrade,
      confirmStopTrade,
      closeTrade,
      confirmCloseTrade,
    }
  },
})
</script>

<style>
</style>
