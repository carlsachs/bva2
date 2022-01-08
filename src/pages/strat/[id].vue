<template>
    <div>
        <div v-if="!total_pnl" class="my-0 text-gray-300">Loading... <img class="mx-auto mb-5" src="/spinner.svg" /></div>

        <div ref="myEl" class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">

            <h1 class="text-2xl mb-7 text-uppercase font-semibold">{{ stratname }}</h1>

            <apexchart ref="stratchart" type="area" height="400" :options="chartOptions" :series="series"></apexchart>

            <div v-if="description" class="m-7 text-xl">{{ description }}</div>
            
            <div class="p-4 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-1 sm:gap-5 uppercase">

                <div class="flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                    <div class="flex-auto">Total PnL</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ max_concurrent ? (Number(total_pnl) * Number(max_concurrent)).toFixed(2) : Number(total_pnl).toFixed(2) }}%</div>
                </div>

                 <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                    <div class="flex-auto">Currently Open</div>
                    <div class="flex-auto text-justify text-blue-300 block font-bold">{{ open_count }}</div>
                </div>

                <div v-if="max_concurrent>=1" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                    <div class="flex-auto">Max. Concurrent Trades</div>
                    <div class="flex-auto text-justify text-blue-300 block font-bold">{{ max_concurrent }}</div>
                </div>

                <div v-if="max_concurrent>=1" class="flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                    <div class="flex-auto">Portfolio PnL*</div>
                    <div class="flex-auto text-justify text-blue-300 block font-bold">{{ Number(total_pnl).toFixed(2) }}%</div>
                </div>

                <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                    <div class="flex-auto">Trades Count</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ total_signals }}</div>
                </div>

                <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                    <div class="flex-auto">Avg. Profit per Trade</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ avg_pnl }}%</div>
                </div>

                <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                    <div class="flex-auto">Win Rate</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ win_rate }}%</div>
                </div>

                <div class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                    <div class="flex-auto">Verif. Trade History</div>
                    <div class="flex-auto text-justify text-blue-300 block">{{ strat_lifetime }}</div>
                </div>

                <div v-if="_.find(products.items, {stratid:id})" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                    <div class="flex-auto">Market</div>
                    <div class="flex-auto text-justify text-blue-300 block"><b>{{ _.find(products.items, {stratid:id})?.mode }}</b></div>
                </div>

                <div v-if="_.find(products.items, {stratid:id})" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                    <div class="flex-auto text-green-500">Available Subs.</div>
                    <div class="flex-auto text-justify text-blue-300 block"><b>{{ _.find(products.items, {stratid:id})?.count }}</b></div>
                </div>

                <div v-if="_.find(products.items, {stratid:id})" class="group flex items-center bg-opacity-40 shadow-xl gap-5 px-6 py-5  mt-5 transition">
                    <div class="flex-auto text-green-500"></div>
                    <div class="flex-auto text-justify text-green-500 block"><b><span class="text-blue-300">{{ _.find(products.items, {stratid:id})?.price }}</span> {{ _.find(products.items, {stratid:id})?.currency }} / month</b></div>
                </div>

                <div v-if="_.find(products.items, {stratid:id}) && !auth0.state.isAuthenticated" @click="login" class="font-bold group flex text-xl items-center bg-indigo-900 bg-opacity-80 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5 cursor-pointer hover:bg-opacity-100 transition">
                    <div class="flex-auto text-green-500 text-xl font-semibold">Subscribe</div>
                </div>
                <Stripe
                    v-if="_.find(products.items, {stratid:id}) && !_.find(auth0.state.user?.data?.subs, {code:_.find(products.items, {stratid:id}).code}) && _.find(products.items, {stratid:id}).stripe_id && auth0.state.isAuthenticated"
                    :customerEmail="auth0.state.user?.email" 
                    :clientReferenceId="auth0.state.user?.data?.id" 
                    :stripeId="_.find(products.items, {stratid:id}).stripe_id"
                    :description="_.find(products.items, {stratid:id}).name"
                    :price="Number(_.find(products.items, {stratid:id}).price)"
                />
                <div v-if="_.find(products.items, {stratid:id}) && !_.find(auth0.state.user?.data?.subs, {code:_.find(products.items, {stratid:id}).code}) && _.find(products.items, {stratid:id}).stripe_id==null && auth0.state.isAuthenticated && !loading" @click="subscribe" class="font-bold group flex text-xl items-center bg-indigo-900 bg-opacity-80 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5 cursor-pointer hover:bg-opacity-100 transition">
                    <div class="flex-auto text-green-500 text-xl font-semibold">Subscribe</div>
                </div>
                <div v-if="_.find(products.items, {stratid:id}) && !_.find(auth0.state.user?.data?.subs, {code:_.find(products.items, {stratid:id}).code}) && _.find(products.items, {stratid:id}).stripe_id==null && auth0.state.isAuthenticated && loading" class="font-bold group flex text-xl items-center bg-red-800 bg-opacity-10 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5 cursor-pointer hover:bg-opacity-100 transition">
                    <div class="flex-auto text-green-500 text-xl font-semibold">Loading...</div>
                </div>
                <div v-if="_.find(products.items, {stratid:id}) && _.find(auth0.state.user?.data?.subs, {code:_.find(products.items, {stratid:id}).code}) && auth0.state.isAuthenticated" @click="setup" class="font-bold group flex text-xl items-center bg-indigo-900 bg-opacity-80 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5 cursor-pointer hover:bg-opacity-100 transition">
                    <div class="flex-auto text-green-500 text-xl font-semibold">Setup</div>
                </div>

            </div>
            
            <div v-if="max_concurrent>=1" class="mt-5 italic">* PNL calculated using Tot. PnL / Max. Concurrent Trades</div>
            <div class="mt-5 italic">** All our calculated PNL include some trading fees (0.2% for each signal)</div>

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
                                                <div class="text-center">PNL**</div>
                                            </th>
                                            <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div class="text-center">TYPE</div>
                                            </th>
                                            <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div class="text-center">BUY PRICE</div>
                                            </th>
                                            <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div class="text-center">SELL PRICE</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="signals" class="divide-y divide-gray-200 hover:bg-blue-900 hover:bg-opacity-40 visited:bg-blue-900 visited:bg-opacity-40" v-for="(row, i) in signals.slice(0, 30 * loadMoreStore.strat)" :key="row.id">
                                        <tr>
                                            <td v-if="row.type === 'LONG'" :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/signal/+row.id">{{ moment(Number(row.buy_time)).fromNow() }}</router-link>
                                            </td>
                                            <td v-else :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/signal/+row.id">{{ moment(Number(row.sell_time)).fromNow() }}</router-link>
                                            </td>
                                            <td class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/signal/+row.id">{{ row.pair }}</router-link>
                                            </td>
                                            <td v-if="row.pnl" :class="{ 'text-green-500': Number(row.pnl)>0, 'text-red-500': Number(row.pnl)<0 }" class="px-6 py-4 font-bold whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/signal/+row.id">{{ Number(row.pnl).toFixed(2) }}%</router-link>
                                            </td>
                                            <td v-else class="italic px-6 py-4 text-gray-400 whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/signal/+row.id">{{ prices && getCurrentPnL(row) }}%</router-link>
                                            </td>
                                            <!--
                                            <td v-if="Number(row.pnl)>0" :class="{ 'font-bold': row.pnl }" class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.pnl ? Number(row.pnl).toFixed(2) : getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%
                                            </td>
                                            <td v-else :class="{ 'font-bold': row.pnl }" class="text-red-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.pnl ? Number(row.pnl).toFixed(2) : getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%
                                            </td>
                                            -->
                                            <td v-if="row.type==='SHORT'" class="text-orange-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/signal/+row.id">{{ row.type }}</router-link>
                                            </td>
                                            <td v-else class="text-blue-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/signal/+row.id">{{ row.type }}</router-link>
                                            </td>
                                            <td class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/signal/+row.id">{{ row.buy_price ? row.buy_price : '---' }}</router-link>
                                            </td>
                                            <td class="text-red-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/signal/+row.id">{{ row.sell_price ? row.sell_price : '---' }}</router-link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button v-if="signals?.length>0 && loadMoreStore.strat * 30 < signals?.length" class="mx-auto dark_button" type="button" @click="loadMore">Load More</button>

            <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
            <div class="modal__content">
                <span class="modal__title">Subscription Confirmation</span>
                <div>
                    <div v-if="Number(_.find(products.items, {stratid:id})?.price)>0" class=" text-cyan-200 m-3">
                    In order to activate your subscription, you need to deposit <b class="text-green-500">{{ _.find(products.items, {stratid:id})?.price }} USDT</b> <br>
                    to the following BEP2 address: <b>bnb136ns6lfw4zs5hg4n85vdthaad7hq5m4gtkgf23</b> <br>
                    Make sure you use the <b>MEMO</b>: <b>102826610</b>
                    </div>
                    <div v-if="Number(_.find(products.items, {stratid:id})?.price)>0" class=" text-cyan-200 m-3">
                    <b>Once you made your deposit</b>, please click on the <b class="text-green-500">Activate</b> button.
                    </div>
                     <div class=" text-cyan-200 m-3">
                    The <b>{{ stratname }} strategy</b> is designed to trade <b class="text-green-500">{{ _.find(products.items, {stratid:id})?.base_asset }}</b> on the <b class="text-green-500">{{ _.find(products.items, {stratid:id})?.mode }}</b> market on Binance.
                    </div>
                    <button class="mx-3 p-3 red_button" type="button" @click="cancel()">Cancel</button>
                    <button class="mx-3 p-3 green_button" type="button" @click="confirm(_.find(products.items, {stratid:id}))">Activate</button>
                    <div class="text-xl text-cyan-200">
                        <div class="text-center p-5 m-6 flex flex-row items-center justify-center p-2 space-x-5 mb-5">
                            <div class="text-gray-300 font-bold">Feel free to contact us </div> &nbsp;
                            <a href="email:support@bitcoinvsalts.com" class="text-green-500 font-bold" target="_new"><img class="mx-auto" width=34 alt="GitHub" src="/email.png"/></a> &nbsp;
                            <a href="https://t.me/joinchat/lmQ_xPE0WBo5NzYx" class="text-green-500 font-bold" target="_new"><img class="mx-auto" width=32 alt="GitHub" src="/tg.png"/></a> &nbsp;
                            <a href="https://discordapp.com/invite/4EQrEgj" target="_new" class="text-purple-500 font-bold"><img class="mx-auto" width=40 alt="Discord" src="/discord.png"/></a> &nbsp;
                        </div>
                    </div>
                </div>
            </div>
                
            </vue-final-modal>

        </div>
    </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, computed, toRefs, defineComponent, watch, inject } from "vue"
import axios from "~/utils/axios"
import moment from "moment"
import { useRouter } from "vue-router"
import _ from "lodash"
import { useRequest } from 'vue-request'
import { usePriceStore } from '../../stores/prices'
import { useLoadMoreStore } from '../../stores/loadmore'
import { useProductStore } from '../../stores/products'
import { startStats, endStats } from '~/modules/stats'
import { useHead } from '@vueuse/head'
import BigNumber from 'bignumber.js'

export default defineComponent({
  name: "strategy",
  props: {
    id: String,
  },
  setup: (props) => {
    startStats(Date.now())

    const stratchart = ref(null)
    
    //const prods = useProductStore()
    const prices = usePriceStore()

    const loadMoreStore = useLoadMoreStore()
    loadMoreStore.resetProfile()

    const router = useRouter()

    const openSignal = (row) => {
        router.push("/signal/"+ row.id)
    }

    const auth0: any = inject("auth0")

    const state = reactive({
        ///////// ///////// ///////// /////////
        showModal: false,
        auth0, 
        stratname: '',
        max_concurrent: 0,
        open_count: 0,
        description: '',
        total_pnl: 0,
        avg_pnl: 0,
        strat_lifetime: "",
        total_signals: 0,
        win_rate: 0,
        products: [],
        loading: false,
        ///////// ///////// ///////// /////////
        series: [
            { name: "Bitcoin", data: [] },
            { name: "", data: [] }
        ],
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

    state.products = useProductStore()

    useHead({
        title: computed( () => state.stratname + " Strategy PnL Trading Track Record"),
        meta: [
            {
            name: `description`,
            content: computed(() => state.stratname + " " + state.description + " Trading Strategy PnL and Chart tracked by BVA. Crypto Trading Algo Ranking."),
            },
        ],
    })

    const myEl = ref(null)

    const getStratData = () => {
        console.log("getStratData...")
        return axios.get('/api/stratdata?id='+props.id)
    }

    const { data: signals } = useRequest( () =>  getStratData(), {
        cacheKey: 'signals',
        //cacheTime: 300000,
        pollingInterval: 10000,
        formatResult: res => {
            return res.data
        },
        onSuccess: (res) => {
            console.log("SIGNALS=>", res.length)
        }
    })
    
    watch(signals, (signals) => {

        console.log("watch signals...", signals[signals.length-1].sell_time)

        if (signals[signals.length-1].pair.slice(-4) === 'USDT') {
            state.chartOptions.chart.stacked = false
            stratchart.value?.updateOptions(state.chartOptions)
        }
    
        let tpnl_btc = []
        let tpnl_bva = []
        let pnl_btc = 0
        let pnl_bva = 0

        state.stratname = signals[0].stratname
        state.series[1].name = signals[0].stratname
        state.strat_lifetime = moment(Number(signals[signals.length-1].buy_time)).fromNow()
        const days = 10 + (signals[signals.length-1].sell_time ? parseInt((Date.now() - signals[signals.length-1].sell_time)/86400000) : 0)
        state.total_signals = signals.length
        
        console.log("========>", Date.now(), days )
        axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit='+days)
        .then( btcs => {

            for ( var btc of btcs.data ) {
                pnl_btc = 100 * (Number(btc[4]) - Number(btc[1])) / Number(btc[1]) + pnl_btc
                tpnl_btc.push([ btc[0], pnl_btc.toFixed(2) ])
                const sum = signals.filter( bva => { 
                    return Number(bva.updated_time) > btc[0] && Number(bva.updated_time) <= btc[6] 
                })
                pnl_bva = state.max_concurrent ? _.sumBy(sum, o => { return Number(o.pnl) }) / state.max_concurrent + pnl_bva : _.sumBy(sum, o => { return Number(o.pnl) }) + pnl_bva
                tpnl_bva.push([ btc[0], pnl_bva.toFixed(2) ])
            }

            if (state.series[0].data.length===0) state.series[0].data = tpnl_btc
            if (state.series[1].data.length===0) state.series[1].data = tpnl_bva

            state.total_pnl = tpnl_bva[tpnl_bva.length-1][1]
            state.avg_pnl = _.meanBy(signals, o => {return Number(o.pnl)}).toFixed(2)
            const positifs = signals.filter( bva => { return Number(bva.pnl) > 0 })
            state.win_rate = (100 * positifs.length / signals.length).toFixed(2)
        })
        .catch((err) => {
            console.log(err)
        })
        endStats(Date.now())
    })

    const loadMore = () => {
        loadMoreStore.moreStrat()
        console.log("loadMore...", loadMoreStore.strat)
    }

    const getCurrentPnL = (row) => {
        //console.log("getCurrentPnL...", JSON.stringify(row))
        const type = row.type
        const symbol = row.pair
        let pnl = 0
        if (prices.items.length) {
            const currentPrice = prices.items.find( (r) => { return r.symbol === symbol }).price
            const last_price = new BigNumber(currentPrice)
            if (currentPrice) {
                // LONG //
                if (type === 'LONG') {
                    const sum_trade_size = Number(row.buy_trade_size_4) + Number(row.buy_trade_size_3) + Number(row.buy_trade_size_2) + Number(row.buy_trade_size)
                    if ( Number(row.buy_price_4) > 0 ) {
                        const pnl_4 = last_price.minus(row.buy_price_4).times(row.buy_trade_size_4).times(100).dividedBy(row.buy_price_4).dividedBy(sum_trade_size)
                        const pnl_3 = last_price.minus(row.buy_price_3).times(row.buy_trade_size_3).times(100).dividedBy(row.buy_price_3).dividedBy(sum_trade_size)
                        const pnl_2 = last_price.minus(row.buy_price_2).times(row.buy_trade_size_2).times(100).dividedBy(row.buy_price_2).dividedBy(sum_trade_size)
                        const pnl_1 = last_price.minus(row.buy_price).times(row.buy_trade_size).times(100).dividedBy(row.buy_price).dividedBy(sum_trade_size)
                        pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).minus(0.2).toString())
                    }
                    else if ( Number(row.buy_price_3) > 0 ) {
                        const pnl_3 = last_price.minus(row.buy_price_3).times(row.buy_trade_size_3).times(100).dividedBy(row.buy_price_3).dividedBy(sum_trade_size)
                        const pnl_2 = last_price.minus(row.buy_price_2).times(row.buy_trade_size_2).times(100).dividedBy(row.buy_price_2).dividedBy(sum_trade_size)
                        const pnl_1 = last_price.minus(row.buy_price).times(row.buy_trade_size).times(100).dividedBy(row.buy_price).dividedBy(sum_trade_size)
                        pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).minus(0.2).toString())
                    }
                    else if ( Number(row.buy_price_2) > 0 ) {
                        const pnl_2 = last_price.minus(row.buy_price_2).times(row.buy_trade_size_2).times(100).dividedBy(row.buy_price_2).dividedBy(sum_trade_size)
                        const pnl_1 = last_price.minus(row.buy_price).times(row.buy_trade_size).times(100).dividedBy(row.buy_price).dividedBy(sum_trade_size)
                        pnl = Number(pnl_1.plus(pnl_2).minus(0.2).toString())
                    }
                    else {
                        const pnl_1 = last_price.minus(row.buy_price).times(100).dividedBy(row.buy_price)
                        pnl = Number(pnl_1.minus(0.2).toString())
                    }
                }
                // SHORT //
                else {
                    const sum_trade_size = Number(row.sell_trade_size_4) + Number(row.sell_trade_size_3) + Number(row.sell_trade_size_2) + Number(row.sell_trade_size)
                    //////// //////// //////// //////// ////////
                    if ( Number(row.sell_price_4) > 0 ) {
                        const sell_price_4 = new BigNumber(row.sell_price_4)
                        const sell_price_3 = new BigNumber(row.sell_price_3)
                        const sell_price_2 = new BigNumber(row.sell_price_2)
                        const sell_price = new BigNumber(row.sell_price)
                        const pnl_4 = sell_price_4.minus(last_price).times(row.sell_trade_size_4).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                        const pnl_3 = sell_price_3.minus(last_price).times(row.sell_trade_size_3).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                        const pnl_2 = sell_price_2.minus(last_price).times(row.sell_trade_size_2).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                        const pnl_1 = sell_price.minus(last_price).times(row.sell_trade_size).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                        pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).minus(0.2).toString())
                    }
                    else if ( Number(row.buy_price_3) > 0 ) {
                        const sell_price_3 = new BigNumber(row.sell_price_3)
                        const sell_price_2 = new BigNumber(row.sell_price_2)
                        const sell_price = new BigNumber(row.sell_price)
                        const pnl_3 = sell_price_3.minus(last_price).times(row.sell_trade_size_3).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                        const pnl_2 = sell_price_2.minus(last_price).times(row.sell_trade_size_2).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                        const pnl_1 = sell_price.minus(last_price).times(row.sell_trade_size).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                        pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).minus(0.2).toString())
                    }
                    else if ( Number(row.buy_price_2) > 0 ) {
                        const sell_price_2 = new BigNumber(row.sell_price_2)
                        const sell_price = new BigNumber(row.sell_price)
                        const pnl_2 = sell_price_2.minus(last_price).times(row.sell_trade_size_2).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                        const pnl_1 = sell_price.minus(last_price).times(row.sell_trade_size).times(100).dividedBy(last_price).dividedBy(sum_trade_size)
                        pnl = Number(pnl_1.plus(pnl_2).minus(0.2).toString())
                    }
                    else {
                        const sell_price = new BigNumber(row.sell_price)
                        const pnl_1 = sell_price.minus(last_price).times(100).dividedBy(last_price)
                        pnl = Number(pnl_1.minus(0.2).toString())
                    }
                }
            }
        }
        return pnl.toFixed(2)
    }

    async function login() {
        // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#loginwithredirect
        //console.log("-0-0-0-0-0-0-0-", 'http://localhost:3000/strat/'+props.id)
        //auth0.client.loginWithRedirect({ appState: { targetUrl: window.location.href } })
        await auth0.client.loginWithRedirect({ appState: { targetUrl: '/strat/' + props.id } })
        /*
        await auth0.client.loginWithPopup()
        console.log("-1-1-1-1-1-1-", await auth0.client.getUser() )
        auth0.state.user = await auth0.client.getUser()
        auth0.state.user.token = await auth0.client.getTokenSilently()
        const user_data = await signInUser(auth0.state.user.token, auth0.state.user.sub)
        if (!user_data) {
            auth0.state.user = null
            console.log("USER UNKNOWN")
        }
        else {
            auth0.state.user.data = user_data
            console.log("WELCOME USER", auth0.state.user.data.id )
        }
        */
    }

    onMounted(() => {
        axios.get('/api/strategy?id=' + props.id)
        .then( s => {
            state.max_concurrent = s.data.max_concurrent
            state.open_count = s.data.open_count
            state.description = s.data.description
            //console.log("onMounted...", auth0.state.user?.token, auth0.state.user?.data?.email)
            //console.log(prods.items.length)
            //console.log("===>", JSON.stringify(auth0.state.user?.data?.subs))
        })
        .catch((err) => {
            console.log(err)
        })
    })

    watch( () => stratchart.value, (value) => {
        setTimeout(function(){ 
            value?.toggleSeries('Bitcoin');
        }, 4000)
    })

    const subscribe = () => {
        state.showModal = true
    }

    const setup = () => {
        router.push("/subscriptions")
    }
    
    const cancel = (sub) => {
        console.log("cancel")
        state.showModal = false
    }

    const confirm = async (sub) => {
        //state.confirmed = false
        state.loading = true
        state.showModal = false
        console.log("confirm", JSON.stringify(sub.code))
        console.log("subscribe", JSON.stringify(sub.code))
        await axios.put('/api/subscribe?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
            { 
                code: sub.code,
                name: sub.name,
                stratid: sub.stratid,
                base_asset: sub.base_asset,
                price: sub.price,
                mode: sub.mode,
            },
            { headers: {Authorization:`Bearer ${auth0.state.user?.token}`} }
        )
        .then( async (response) => {
            console.log("subscribe.response.data:", response.data)
            state.loading = false
            router.go()
        })
        .catch( (error) => {
            state.loading = false
            console.log("ERROR subscribe", error)
        })
    }

    return {
      ...toRefs(state),
      moment,
      openSignal,
      getCurrentPnL,
      myEl,
      signals,
      loadMore,
      loadMoreStore,
      prices,
      login,
      stratchart,
      subscribe,
      confirm,
      setup,
      cancel,
      _
    }
  },
})
</script>

<style lang="postcss" scoped>
.blue_button {
  @apply text-blue-400 cursor-pointer border-2 border-blue-600 hover:bg-blue-600 hover:text-blue-200 px-3 py-2 my-2 rounded-lg;
}
.green_button {
  @apply border-2 border-green-600 rounded-lg px-3 py-2 my-2 text-green-400 cursor-pointer hover:bg-green-600 hover:text-green-200;
}
.orange_button {
  @apply border-2 border-yellow-600 rounded-lg px-3 py-2 my-2 text-yellow-400 cursor-pointer hover:bg-yellow-600 hover:text-yellow-200;
}
.red_button {
  @apply border-2 border-red-600 rounded-lg px-3 py-2 my-2 text-red-400 cursor-pointer hover:bg-red-600 hover:text-red-200;
}
.dark_button {
  @apply border-2 border-gray-800 rounded-lg px-3 py-2 my-2 text-gray-400 cursor-pointer hover:bg-gray-800 hover:text-gray-200;
}




::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  border-color: #2d3748;
  background-color: #1a202c;
}
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__content {
  flex-grow: 1;
  overflow-y: auto;
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>