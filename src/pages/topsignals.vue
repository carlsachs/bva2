
<template>
    <div>
        <div class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">
            <h1 class="text-2xl text-white text-uppercase font-semibold mt-6">
            Top Crypto Trading Signals
            <button @click="setDays"  :class="{ 'bg-indigo-900 bg-opacity-100':(this.$route.query.d==1 || !this.$route.query.d), 'bg-indigo-900 bg-opacity-10':(this.$route.query.d!=1 && this.$route.query.d) }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <router-link class="text-green-500 text-xl font-semibold" to="?d=1">24H</router-link>
            </button>
            <button @click="setDays" :class="{ 'bg-indigo-900 bg-opacity-100':this.$route.query.d==7, 'bg-indigo-900 bg-opacity-10':this.$route.query.d!=7 }" class="mx-1 my-2 font-bold text-sm items-center shadow-xl px-2 py-2 rounded-lg cursor-pointer">
                <router-link class="text-green-500 text-xl font-semibold" to="?d=7">One Week</router-link>
            </button>
        </h1>
            <div v-if="!signals" class="my-0 text-gray-300">Loading... <img class="mx-auto mb-5" src="/spinner.svg" /></div>
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
                                                <div class="text-center">NAME</div>
                                            </th>
                                            <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div class="text-center">PAIR</div>
                                            </th>
                                            <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div class="text-center">PNL</div>
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
                                    <tbody v-if="signals" class="divide-y divide-gray-200 hover:bg-blue-900 hover:bg-opacity-40 visited:bg-blue-900 visited:bg-opacity-40" v-for="(row, i) in signals" :key="row.id">
                                        <tr>
                                            <td v-if="row.type === 'LONG'" :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/signal/+row.id">{{ moment(Number(row.buy_time)).fromNow() }}</router-link>
                                            </td>
                                            <td v-else :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/signal/+row.id">{{ moment(Number(row.sell_time)).fromNow() }}</router-link>
                                            </td>
                                            <td class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                                                <router-link :to="/strat/+row.stratid">{{ row.stratname }}</router-link>
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
        </div>
    </div>
</template>

<script lang="ts">

import { reactive, computed, toRefs, defineComponent, watch, inject, onMounted } from "vue"
import axios from "~/utils/axios"
import moment from "moment"
import { useRouter } from "vue-router"
import { useRequest } from 'vue-request'
import { usePriceStore } from '../stores/prices'
import { startStats, endStats } from '~/modules/stats'
import { useHead } from '@vueuse/head'
import BigNumber from 'bignumber.js'

export default defineComponent({
  name: "topsignals",
  setup: () => {
    startStats(Date.now())

    useHead({
        title: computed( () => "Top Crypto Auto Trading Signals"),
        meta: [
            {
            name: `description`,
            content: computed(() => "See the top crypto algo trading signals tracked by the BVA platform"),
            },
        ],
    })
    
    const prices = usePriceStore()

    const router = useRouter()

    const openSignal = (row) => {
        router.push("/signal/"+ row.id)
    }

    const openStrat = (id) => {
        router.push("/strat/"+ id)
    }

    const auth0: any = inject("auth0")

    onMounted(() => {
        run()
    })

    async function setDays() {
        console.log("setDays")
        run()
    }

    const state = reactive({
        ///////// ///////// ///////// /////////
        auth0,
        days: 1,
        ///////// ///////// ///////// /////////
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

                        console.log("dca_buy_price_1", dca_buy_price_1, row?.buy_price||0, buy_price_1, sum_buy_trade_size)

                        if (sum_sell_trade_size) {
                            if (row?.sell_trade_size_4) {
                                const sell_price_4 = new BigNumber(row.sell_price_4)
                                const sell_price_3 = new BigNumber(row.sell_price_3)
                                const sell_price_2 = new BigNumber(row.sell_price_2)
                                const sell_price_1 = new BigNumber(row.sell_price)
                                const pnl_1 = sell_price_1.minus(dca_buy_price).times(row.sell_trade_size).dividedBy(dca_buy_price)
                                const pnl_2 = sell_price_2.minus(dca_buy_price).times(row.sell_trade_size_2).dividedBy(dca_buy_price)
                                const pnl_3 = sell_price_3.minus(dca_buy_price).times(row.sell_trade_size_3).dividedBy(dca_buy_price)
                                const pnl_4 = sell_price_4.minus(dca_buy_price).times(row.sell_trade_size_4).dividedBy(dca_buy_price) 
                                const pnl_5 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).plus(pnl_5).times(100).minus(0.2).toFixed(2))
                                console.log("PNL", pnl)
                            }
                            else if (row?.sell_trade_size_3) {
                                const sell_price_3 = new BigNumber(row.sell_price_3)
                                const sell_price_2 = new BigNumber(row.sell_price_2)
                                const sell_price_1 = new BigNumber(row.sell_price)
                                const pnl_1 = sell_price_1.minus(dca_buy_price).times(row.sell_trade_size).dividedBy(dca_buy_price)
                                const pnl_2 = sell_price_2.minus(dca_buy_price).times(row.sell_trade_size_2).dividedBy(dca_buy_price)
                                const pnl_3 = sell_price_3.minus(dca_buy_price).times(row.sell_trade_size_3).dividedBy(dca_buy_price)
                                const pnl_4 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).times(100).minus(0.2).toFixed(2))
                                console.log("PNL", pnl)
                            }
                            else if (row?.sell_trade_size_2) {
                                const sell_price_2 = new BigNumber(row.sell_price_2)
                                const sell_price_1 = new BigNumber(row.sell_price)
                                const pnl_1 = sell_price_1.minus(dca_buy_price).times(row.sell_trade_size).dividedBy(dca_buy_price)
                                const pnl_2 = sell_price_2.minus(dca_buy_price).times(row.sell_trade_size_2).dividedBy(dca_buy_price)
                                const pnl_3 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).times(100).minus(0.2).toFixed(2))
                                console.log("PNL", pnl)
                            }
                            else if (row?.sell_trade_size) {
                                const sell_price_1 = new BigNumber(row.sell_price)
                                const pnl_1 = sell_price_1.minus(dca_buy_price).times(row.sell_trade_size).dividedBy(dca_buy_price)
                                const pnl_2 = last_price.minus(dca_buy_price).times(100 - sum_sell_trade_size).dividedBy(dca_buy_price)
                                pnl = Number(pnl_1.plus(pnl_2).times(100).minus(0.2).toFixed(2))
                            }
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
                                const pnl_1 = dca_sell_price.minus(buy_price_1).times(row.buy_trade_size).dividedBy(buy_price_1)
                                const pnl_2 = dca_sell_price.minus(buy_price_2).times(row.buy_trade_size_2).dividedBy(buy_price_2)
                                const pnl_3 = dca_sell_price.minus(buy_price_3).times(row.buy_trade_size_3).dividedBy(buy_price_3)
                                const pnl_4 = dca_sell_price.minus(buy_price_4).times(row.buy_trade_size_4).dividedBy(buy_price_4) 
                                const pnl_5 = dca_sell_price.minus(last_price).times(100 - sum_buy_trade_size).dividedBy(last_price)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).plus(pnl_5).times(100).minus(0.2).toFixed(2))
                            }
                            else if (row?.buy_trade_size_3) {
                                const buy_price_3 = new BigNumber(row.buy_price_3)
                                const buy_price_2 = new BigNumber(row.buy_price_2)
                                const buy_price_1 = new BigNumber(row.buy_price)
                                const pnl_1 = dca_sell_price.minus(buy_price_1).times(row.buy_trade_size).dividedBy(buy_price_1)
                                const pnl_2 = dca_sell_price.minus(buy_price_2).times(row.buy_trade_size_2).dividedBy(buy_price_2)
                                const pnl_3 = dca_sell_price.minus(buy_price_3).times(row.buy_trade_size_3).dividedBy(buy_price_3)
                                const pnl_4 = dca_sell_price.minus(last_price).times(100 - sum_buy_trade_size).dividedBy(last_price)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).plus(pnl_4).times(100).minus(0.2).toFixed(2))
                            }
                            else if (row?.buy_trade_size_2) {
                                const buy_price_2 = new BigNumber(row.buy_price_2)
                                const buy_price_1 = new BigNumber(row.buy_price)
                                const pnl_1 = dca_sell_price.minus(buy_price_1).times(row.buy_trade_size).dividedBy(buy_price_1)
                                const pnl_2 = dca_sell_price.minus(buy_price_2).times(row.buy_trade_size_2).dividedBy(buy_price_2)
                                const pnl_3 = dca_sell_price.minus(last_price).times(100 - sum_buy_trade_size).dividedBy(last_price)
                                pnl = Number(pnl_1.plus(pnl_2).plus(pnl_3).times(100).minus(0.2).toFixed(2))
                            }
                            else if (row?.buy_trade_size) {
                                const buy_price_1 = new BigNumber(row.buy_price)
                                const pnl_1 = dca_sell_price.minus(buy_price_1).times(row.buy_trade_size).dividedBy(buy_price_1)
                                const pnl_2 = dca_sell_price.minus(last_price).times(100 - sum_buy_trade_size).dividedBy(last_price)
                                pnl = Number(pnl_1.plus(pnl_2).times(100).minus(0.2).toFixed(2))
                            }
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

    async function login() {
        // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#loginwithredirect
        console.log("-0-0-0-0-0-0-0-", window.location.href)
        //auth0.client.loginWithRedirect({ appState: { targetUrl: window.location.href } })
        await auth0.client.loginWithRedirect({ appState: { targetUrl: '/subscriptions' } })
        //await auth0.client.loginWithPopup()
        //console.log("-1-1-1-1-1-1-", await auth0.client.getUser() )
    }

    const getTopSignals = () => {
        console.log("getTopSignals...", router.currentRoute.value.query.d)
        return axios.get('/api/topsignals?days='+(router.currentRoute.value.query.d?router.currentRoute.value.query.d:1))
    }

    const { data: signals, run } = useRequest( () =>  getTopSignals(), {
        cacheKey: 'signals',
        //cacheTime: 300000,
        pollingInterval: 20000,
        formatResult: res => {
            return res.data
        },
        onSuccess: (res) => {
            console.log("34411--1-1>", res.length)
        }
    })
    
    watch(signals, (signals) => {
        console.log("signals...", signals.length)
        endStats(Date.now())
    })

    return {
      ...toRefs(state),
      moment,
      openSignal,
      openStrat,
      getCurrentPnL,
      prices,
      login,
      signals,
      setDays
    }
  },
})
</script>

<style lang="postcss" scoped>
.dark_button {
  @apply border-2 px-3 py-2 border-blue-900 rounded-lg text-gray-400 cursor-pointer hover:bg-gray-800 hover:text-gray-200;
}
</style>