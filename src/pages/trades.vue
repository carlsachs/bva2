<template>
  <div v-if="auth0.state.isAuthenticated && auth0.state.user" class="text-center text-gray-300">

    <div v-if="!total_pnl" class="my-0 text-gray-300">Loading... <img class="mx-auto mb-5" src="/spinner.svg" /></div>

    <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">

      <h1 class="mb-7 text-3xl text-uppercase font-semibold">Your PNL</h1>

      <apexchart ref="mychart" type="area" height="400" :options="chartOptions" :series="series"></apexchart>
      
      <div class="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-5 uppercase">
        <div class="flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
          <div class="flex-auto">Total PnL</div>
          <div class="flex-auto text-justify text-blue-300 block">{{  Number(total_pnl).toFixed(2) }}%</div>
        </div>
        <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
          <div class="flex-auto">Trades Count</div>
          <div class="flex-auto text-justify text-blue-300 block">{{ total_signals }}</div>
        </div>
        <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
          <div class="flex-auto">Avg. Profit per Trade</div>
          <div class="flex-auto text-justify text-blue-300 block">{{ avg_pnl }}%</div>
        </div>
        <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 transition">
          <div class="flex-auto">Win Rate</div>
          <div class="flex-auto text-justify text-blue-300 block">{{ win_rate }}%</div>
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
                        <div class="text-center">STRAT NAME</div>
                      </th>
                       <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">PNL</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">STATUS</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">PAIR</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">TYPE</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">QTY</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">BUY PRICE</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">SELL PRICE</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody v-if="trades" v-for="(row, i) in trades.slice(0, 30 * loadMoreStore.profile)" :key="row.id" class="divide-y divide-gray-200 hover:bg-blue-900 hover:bg-opacity-40 visited:bg-blue-900 visited:bg-opacity-40">
                    <tr>
                      <td v-if="row.type === 'LONG'" :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ moment(Number(row.buy_time)).fromNow() }}</router-link>
                      </td>
                      <td v-else :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ moment(Number(row.sell_time)).fromNow() }}</router-link>
                      </td>
                      <td class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/strat/+row.stratid">{{ row.stratname }}</router-link>
                      </td>
                      <td v-if="row.pnl" :class="{ 'text-green-500': Number(row.pnl)>0, 'text-red-500': Number(row.pnl)<0 }" class="px-6 py-4 font-bold whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ Number(row.pnl).toFixed(2) }}%</router-link>
                      </td>
                      <td v-else class="italic px-6 py-4 text-gray-400 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id"> {{ getCurrentPnL(row) }}%</router-link>
                      </td>
                      <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.status }}</router-link>
                      </td>
                      <td class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.pair }}</router-link>
                      </td>
                      <td v-if="row.type==='SHORT'" class="text-orange-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.type }}</router-link>
                      </td>
                      <td v-else class="text-blue-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.type }}</router-link>
                      </td>
                      <td class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.qty }}</router-link>
                      </td>
                      <td class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.buy_price ? row.buy_price : '---' }}</router-link>
                      </td>
                      <td class="text-red-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.sell_price ? row.sell_price : '---' }}</router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <button v-if="trades?.length>0 && loadMoreStore.profile * 30 < trades?.length" class="mx-auto my-3 dark_button" type="button" @click="loadMore">Load More</button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">

import { provide, reactive, ref, toRefs, watch, inject, computed, onMounted } from 'vue'
import { useRouter } from "vue-router"
import _ from "lodash"
import moment from "moment"
import { useRequest } from 'vue-request'
import { usePriceStore } from '../stores/prices'
import { useKlineStore } from '../stores/klines'
import { useLoadMoreStore } from '../stores/loadmore'
import { useTradedStore } from '../stores/traded'
import { startStats, endStats } from '~/modules/stats'
import { updateUsername } from '~/modules/auth0'
import axios from "~/utils/axios"
import { useHead } from '@vueuse/head'
import BigNumber from 'bignumber.js'

export default {
  methods: {
    /*
    setDetailsForComponent(email, password) {    
      console.log("Calling from child component", email, password)
    }
    */
  },
  setup() {
    startStats(Date.now())

    useHead({
        title: computed( () => "Your Trades"),
    })

    const loadMoreStore = useLoadMoreStore()
    loadMoreStore.resetStrat()

    const mychart = ref(null)

    const prices = usePriceStore()
    const klines = useKlineStore()
    
    const auth0: any = inject("auth0")

    const state = reactive({ 
      ///////// ///////// ///////// /////////
      auth0, 
      ///////// ///////// ///////// /////////
      id: auth0.state.user?.data?.id,
      username: auth0.state.user?.data?.nickname,
      token: auth0.state.user?.data?.token,
      email: auth0.state.user?.data?.email,
      ///////// ///////// ///////// /////////
      total_pnl: 0,
      avg_pnl: 0,
      strat_lifetime: 0,
      total_signals: 0,
      win_rate: 0,
      ///////// ///////// ///////// /////////
      series: [{ name: "Bitcoin", data: [] }, { name: "You", data: [] }],
      ///////// ///////// ///////// /////////
      chartOptions: {
        chart: { width: "100%", type: 'area', stacked: true },
        colors: ['#00E396','#0080FB'],
        dataLabels: { enabled: false, enabledOnSeries: false },
        legend: {
          show: true,
          offsetY: 20, itemMargin: { horizontal: 10, vertical: 20 },
          labels: { colors: '#ffffff', },
        },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.8 } },
        stroke: { curve: 'smooth', width: 2, },
        tooltip: { enabled: true, theme: 'dark', },
        xaxis: {
          type: "datetime",
          labels: { show: true, style: { colors: '#FFFFFF', fontSize: '12px' }, }
        },
        yaxis: { forceNiceScale: true, labels: { show: true, style: { colors: '#FFFFFF', fontSize: '10px' },
            formatter: (value) => { return value+'%' },
          },
        }
      },
      ///////// ///////// ///////// /////////
    })

    watch( () => auth0.state.user?.data, (user) => {
      console.log("WATCH USER DATA", JSON.stringify(user.subs[0]))
      state.username = user.nickname
      state.id = user.id
      state.email = user.email
      state.token = auth0.state.user?.token
      run()
    })

    const getTrades = () => {
      console.log("getTrades")
      return axios.get('/api/trades?sub='+auth0.state?.user?.data?.sub+'&id='+ auth0.state?.user?.data?.id, { headers: {Authorization:`Bearer ${auth0.state?.user?.token}`} })
    }

    const { data: trades, run } = useRequest( () => getTrades(), {
      cacheKey: 'trades',
      manual: true,
      //cacheTime: 300000,
      pollingInterval: 28000,
      formatResult: res => {
        return res.data
      },
      onSuccess: (res) => {
        console.log("TRADES->", res.length)
      }
    })

    onMounted( async () => {
      console.log("onMounted...", auth0.state.user?.token, auth0.state.user?.data?.email)
      if (auth0.state.user?.token && auth0.state.user?.data?.email) {
        console.log("re run =======>", auth0.state.user?.token)
        state.username = auth0.state.user?.data?.nickname
        state.id = auth0.state.user?.data?.id
        state.email = auth0.state.user?.data?.email
        run()
      }
    })

    watch( trades, (trades) => {
      console.log("trades...", trades.length)
      state.strat_lifetime = parseInt((Date.now() - trades[trades.length-1]?.updated_time)/86400000)
      console.log("strat_lifetime", state.strat_lifetime)
      const days = 10 + state.strat_lifetime
      state.total_signals = trades.length
      let tpnl_btc = []
      let tpnl_bva = []
      let pnl_btc = 0
      let pnl_bva = 0
      for ( var btc of klines.items.slice(klines.items.length-1-state.strat_lifetime, klines.items.length-1) ) {
        pnl_btc = 100 * (Number(btc[4]) - Number(btc[1])) / Number(btc[1]) + pnl_btc
        tpnl_btc.push([ btc[0], pnl_btc.toFixed(2) ])
        const sum = trades.filter( bva => { 
          return Number(bva.updated_time) > btc[0] && Number(bva.updated_time) <= btc[6] 
        })
        pnl_bva = _.sumBy(sum, o => { return Number(o.pnl) }) + pnl_bva
        tpnl_bva.push([ btc[0], pnl_bva.toFixed(2) ])
      }
      if (state.series[0].data.length===0) state.series[0].data = tpnl_btc
      if (state.series[1].data.length===0) state.series[1].data = tpnl_bva
      state.total_pnl = tpnl_bva.length?tpnl_bva[tpnl_bva.length-1][1]:0
      state.avg_pnl = _.meanBy(trades, o => {return Number(o.pnl)}).toFixed(2)
      const positifs = trades.filter( bva => { return Number(bva.pnl) > 0 })
      state.win_rate = (100 * positifs.length / trades.length).toFixed(2)
      endStats(Date.now())
    })

    const getCurrentPnL = (row) => {
        //console.log("getCurrentPnL...", JSON.stringify(row))
        const type = row.type
        const symbol = row.pair
        let pnl = 0
        if (prices.items.length) {
            const currentPrice = prices.items.find( (r) => { return r.symbol === symbol }).price
            const last_price = new BigNumber(currentPrice)
            if (currentPrice) {

                if (Number(row.buy_trade_size)>0 || Number(row.sell_trade_size)>0) {
                    // DCA
                    const sum_buy_trade_size = Number(row?.buy_trade_size) 
                        + Number(row?.buy_trade_size_2) 
                        + Number(row?.buy_trade_size_3) 
                        + Number(row?.buy_trade_size_4) 
                        + Number(row?.buy_trade_size_5)

                    const sum_sell_trade_size = Number(row?.sell_trade_size) 
                        + Number(row?.sell_trade_size_2) 
                        + Number(row?.sell_trade_size_3) 
                        + Number(row?.sell_trade_size_4) 
                        + Number(row?.sell_trade_size_5)

                    if (type === 'LONG') {

                        const buy_price_5 = new BigNumber(row?.buy_price_5||0)
                        const dca_buy_price_5 = buy_price_5.times(row?.buy_trade_size_5||0).div(sum_buy_trade_size)
                        const buy_price_4 = new BigNumber(row?.buy_price_4||0)
                        const dca_buy_price_4 = buy_price_4.times(row?.buy_trade_size_4||0).div(sum_buy_trade_size)
                        const buy_price_3 = new BigNumber(row?.buy_price_3||0)
                        const dca_buy_price_3 = buy_price_3.times(row?.buy_trade_size_3||0).div(sum_buy_trade_size)
                        const buy_price_2 = new BigNumber(row?.buy_price_2||0)
                        const dca_buy_price_2 = buy_price_2.times(row?.buy_trade_size_2||0).div(sum_buy_trade_size)
                        const buy_price_1 = new BigNumber(row?.buy_price||0)
                        const dca_buy_price_1 = buy_price_1.times(row?.buy_trade_size||0).div(sum_buy_trade_size)
                        const dca_buy_price = dca_buy_price_1.plus(dca_buy_price_2).plus(dca_buy_price_3).plus(dca_buy_price_4).plus(dca_buy_price_5)

                        //console.log("dca_buy_price_1", dca_buy_price_1, row?.buy_price||0, buy_price_1, sum_buy_trade_size)

                        if (sum_sell_trade_size) {
                            if (row?.sell_trade_size_4) {
                                const sell_price_4 = new BigNumber(row.sell_price_4)
                                const sell_price_3 = new BigNumber(row.sell_price_3)
                                const sell_price_2 = new BigNumber(row.sell_price_2)
                                const sell_price_1 = new BigNumber(row.sell_price)
                                const pnl_1 = sell_price_1.minus(dca_buy_price).times(row.sell_trade_size).dividedBy(dca_buy_price).dividedBy(100)
                                const pnl_2 = sell_price_2.minus(dca_buy_price).times(row.sell_trade_size_2).dividedBy(dca_buy_price).dividedBy(100)
                                const pnl_3 = sell_price_3.minus(dca_buy_price).times(row.sell_trade_size_3).dividedBy(dca_buy_price).dividedBy(100)
                                const pnl_4 = sell_price_4.minus(dca_buy_price).times(row.sell_trade_size_4).dividedBy(dca_buy_price).dividedBy(100)
                                const pnl_5 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price).dividedBy(100)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).plus(pnl_5).times(100).minus(0.2).toFixed(2))
                                console.log("PNL", pnl)
                            }
                            else if (row?.sell_trade_size_3) {
                                const sell_price_3 = new BigNumber(row.sell_price_3)
                                const sell_price_2 = new BigNumber(row.sell_price_2)
                                const sell_price_1 = new BigNumber(row.sell_price)
                                const pnl_1 = sell_price_1.minus(dca_buy_price).times(row.sell_trade_size).dividedBy(dca_buy_price).dividedBy(100)
                                const pnl_2 = sell_price_2.minus(dca_buy_price).times(row.sell_trade_size_2).dividedBy(dca_buy_price).dividedBy(100)
                                const pnl_3 = sell_price_3.minus(dca_buy_price).times(row.sell_trade_size_3).dividedBy(dca_buy_price).dividedBy(100)
                                const pnl_4 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price).dividedBy(100)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).times(100).minus(0.2).toFixed(2))
                                console.log("PNL", pnl)
                            }
                            else if (row?.sell_trade_size_2) {
                                const sell_price_2 = new BigNumber(row.sell_price_2)
                                const sell_price_1 = new BigNumber(row.sell_price)
                                const pnl_1 = sell_price_1.minus(dca_buy_price).times(row.sell_trade_size).dividedBy(dca_buy_price).dividedBy(100)
                                const pnl_2 = sell_price_2.minus(dca_buy_price).times(row.sell_trade_size_2).dividedBy(dca_buy_price).dividedBy(100)
                                const pnl_3 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price).dividedBy(100)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).times(100).minus(0.2).toFixed(2))
                                console.log("PNL", pnl)
                            }
                            else if (row?.sell_trade_size) {
                                const sell_price_1 = new BigNumber(row.sell_price)
                                const pnl_1 = sell_price_1.minus(dca_buy_price).times(row.sell_trade_size).dividedBy(dca_buy_price).dividedBy(100)
                                const pnl_2 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price).dividedBy(100)
                                pnl = Number(pnl_1.plus(pnl_2).times(100).minus(0.2).toFixed(2))
                            }
                        }
                        else if (sum_buy_trade_size) {
                            pnl = Number(last_price.minus(dca_buy_price).times(sum_buy_trade_size).div(dca_buy_price).minus(0.2).toFixed(2))
                        }
                        else {
                            pnl = Number(last_price.minus(dca_buy_price).div(dca_buy_price).times(100).minus(0.2).toFixed(2))
                        }
                    }
                    else {
                        // SHORT //

                        const sell_price_5 = new BigNumber(row?.sell_price_5||0)
                        const dca_sell_price_5 = sell_price_5.times(row?.sell_trade_size_5||0).div(sum_sell_trade_size)
                        const sell_price_4 = new BigNumber(row?.sell_price_4||0)
                        const dca_sell_price_4 = sell_price_4.times(row?.sell_trade_size_4||0).div(sum_sell_trade_size)
                        const sell_price_3 = new BigNumber(row?.sell_price_3||0)
                        const dca_sell_price_3 = sell_price_3.times(row?.sell_trade_size_3||0).div(sum_sell_trade_size)
                        const sell_price_2 = new BigNumber(row?.sell_price_2||0)
                        const dca_sell_price_2 = sell_price_2.times(row?.sell_trade_size_2||0).div(sum_sell_trade_size)
                        const sell_price_1 = new BigNumber(row?.sell_price||0)
                        const dca_sell_price_1 = sell_price_1.times(row?.sell_trade_size||0).div(sum_sell_trade_size)
                        const dca_sell_price = dca_sell_price_1.plus(dca_sell_price_2).plus(dca_sell_price_3).plus(dca_sell_price_4).plus(dca_sell_price_5)

                        if (sum_buy_trade_size) {
                            if (row?.buy_trade_size_4) {
                                const buy_price_4 = new BigNumber(row.buy_price_4)
                                const buy_price_3 = new BigNumber(row.buy_price_3)
                                const buy_price_2 = new BigNumber(row.buy_price_2)
                                const buy_price_1 = new BigNumber(row.buy_price)
                                const pnl_1 = dca_sell_price.minus(buy_price_1).times(row.buy_trade_size).dividedBy(buy_price_1).dividedBy(100)
                                const pnl_2 = dca_sell_price.minus(buy_price_2).times(row.buy_trade_size_2).dividedBy(buy_price_2).dividedBy(100)
                                const pnl_3 = dca_sell_price.minus(buy_price_3).times(row.buy_trade_size_3).dividedBy(buy_price_3).dividedBy(100)
                                const pnl_4 = dca_sell_price.minus(buy_price_4).times(row.buy_trade_size_4).dividedBy(buy_price_4).dividedBy(100)
                                const pnl_5 = dca_sell_price.minus(last_price).times(100 - sum_buy_trade_size).dividedBy(last_price).dividedBy(100)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).plus(pnl_5).times(100).minus(0.2).toFixed(2))
                            }
                            else if (row?.buy_trade_size_3) {
                                const buy_price_3 = new BigNumber(row.buy_price_3)
                                const buy_price_2 = new BigNumber(row.buy_price_2)
                                const buy_price_1 = new BigNumber(row.buy_price)
                                const pnl_1 = dca_sell_price.minus(buy_price_1).times(row.buy_trade_size).dividedBy(buy_price_1).dividedBy(100)
                                const pnl_2 = dca_sell_price.minus(buy_price_2).times(row.buy_trade_size_2).dividedBy(buy_price_2).dividedBy(100)
                                const pnl_3 = dca_sell_price.minus(buy_price_3).times(row.buy_trade_size_3).dividedBy(buy_price_3).dividedBy(100)
                                const pnl_4 = dca_sell_price.minus(last_price).times(100 - sum_buy_trade_size).dividedBy(last_price).dividedBy(100)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).times(100).minus(0.2).toFixed(2))
                            }
                            else if (row?.buy_trade_size_2) {
                                const buy_price_2 = new BigNumber(row.buy_price_2)
                                const buy_price_1 = new BigNumber(row.buy_price)
                                const pnl_1 = dca_sell_price.minus(buy_price_1).times(row.buy_trade_size).dividedBy(buy_price_1).dividedBy(100)
                                const pnl_2 = dca_sell_price.minus(buy_price_2).times(row.buy_trade_size_2).dividedBy(buy_price_2).dividedBy(100)
                                const pnl_3 = dca_sell_price.minus(last_price).times(100 - sum_buy_trade_size).dividedBy(last_price).dividedBy(100)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).times(100).minus(0.2).toFixed(2))
                            }
                            else if (row?.buy_trade_size) {
                                const buy_price_1 = new BigNumber(row.buy_price)
                                const pnl_1 = dca_sell_price.minus(buy_price_1).times(row.buy_trade_size).dividedBy(buy_price_1).dividedBy(100)
                                const pnl_2 = dca_sell_price.minus(last_price).times(100 - sum_buy_trade_size).dividedBy(last_price).dividedBy(100)
                                pnl = Number(pnl_1.plus(pnl_2).times(100).minus(0.2).toFixed(2))
                            }
                        }
                        else if (sum_sell_trade_size) {
                            pnl = Number(dca_sell_price.minus(last_price).div(last_price).times(sum_sell_trade_size).minus(0.2).toFixed(2))
                        }
                        else {
                            pnl = Number(dca_sell_price.minus(last_price).div(last_price).times(100).minus(0.2).toFixed(2))
                        }               
                    }
                }
                else {
                    const sell_price = Number(row.sell_price)
                    const buy_price = Number(row.buy_price)
                    if (type === 'LONG') {
                        pnl = (100 * (currentPrice - buy_price) / buy_price) - 0.2
                    }
                    else {
                        pnl = (100 * (sell_price - currentPrice) / currentPrice) - 0.2                    
                    }
                }
            }
        }
        return pnl.toFixed(2)
    }

    const loadMore = () => {
      console.log("loadMore........")
      loadMoreStore.moreProfile()
      console.log("loadMore...", loadMoreStore.profile)
    }
    
    return {
      ...toRefs(state),
      moment,
      getCurrentPnL,
      mychart,
      loadMoreStore,
      loadMore,
      trades,
    }

  },
}
</script>

<style scoped>

.dark_button {
  @apply border-2 px-3 py-2 border-blue-900 rounded-lg text-gray-400 cursor-pointer hover:bg-gray-800 hover:text-gray-200;
}

.red_button {
  @apply border-2 px-3 py-2 border-red-600 rounded-lg px-3 py-2 text-red-400 cursor-pointer hover:bg-red-600 hover:text-red-200;
}

.green_button {
  @apply border-2 px-3 py-2 border-green-600 rounded-lg text-green-400 cursor-pointer bg-green-600 text-green-200;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #48bb78;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>