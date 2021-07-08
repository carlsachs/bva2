<template>
    <div>
        <div class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">

            <h1 class="text-5xl mb-7 text-uppercase font-semibold">Our Strategy Incubator</h1>

            <div class="m-7 text-3xl">Latest signals tracked by our <a href='https://bitcoinvsaltcoins.com' target="_new" class="underline">open forward testing platform</a>.</div>

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
                                    <tbody v-if="signals" class="divide-y divide-gray-200 cursor-pointer hover:bg-blue-900 hover:bg-opacity-40 visited:bg-blue-900 visited:bg-opacity-40" v-for="(row, i) in signals" :key="row.id">
                                        <tr>
                                            <td @click="openSignal(row)" v-if="row.type === 'LONG'" :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ moment(Number(row.buy_time)).fromNow() }}
                                            </td>
                                            <td @click="openSignal(row)" v-else :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ moment(Number(row.sell_time)).fromNow() }}
                                            </td>
                                            <td @click="openStrat(row.stratid)" class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                                                {{ row.stratname }}
                                            </td>
                                            <td @click="openSignal(row)" class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                                                {{ row.pair }}
                                            </td>
                                            <td @click="openSignal(row)" v-if="row.pnl" :class="{ 'text-green-500': Number(row.pnl)>0, 'text-red-500': Number(row.pnl)<0 }" class="px-6 py-4 font-bold whitespace-no-wrap text-sm leading-5">
                                                {{ Number(row.pnl).toFixed(2) }}%
                                            </td>
                                            <td @click="openSignal(row)" v-else class="italic px-6 py-4 text-gray-400 whitespace-no-wrap text-sm leading-5">
                                                {{ prices && getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%
                                            </td>
                                            <!--
                                            <td v-if="Number(row.pnl)>0" :class="{ 'font-bold': row.pnl }" class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.pnl ? Number(row.pnl).toFixed(2) : getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%
                                            </td>
                                            <td v-else :class="{ 'font-bold': row.pnl }" class="text-red-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.pnl ? Number(row.pnl).toFixed(2) : getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%
                                            </td>
                                            -->
                                            <td @click="openSignal(row)" v-if="row.type==='SHORT'" class="text-orange-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.type }}
                                            </td>
                                            <td @click="openSignal(row)" v-else class="text-blue-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.type }}
                                            </td>
                                            <td @click="openSignal(row)" class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.buy_price ? row.buy_price : '---' }}
                                            </td>
                                            <td @click="openSignal(row)" class="text-red-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                                {{ row.sell_price ? row.sell_price : '---' }}
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
import { useRouter } from "vue-router"
import _ from "lodash"
import { useRequest } from 'vue-request'
import { usePriceStore } from '../stores/prices'
import { startStats, endStats } from '~/modules/stats'


export default defineComponent({
  name: "signals",
  setup: () => {
    startStats(Date.now())
    
    const prices = usePriceStore()

    const router = useRouter()

    const openSignal = (row) => {
        router.push("/signal/"+ row.id)
    }

    const openStrat = (id) => {
        router.push("/strat/"+ id)
    }

    const auth0: any = inject("auth0")

    const state = reactive({
        ///////// ///////// ///////// /////////
        auth0,
        ///////// ///////// ///////// /////////
    })

    const getCurrentPnL = (symbol, sell_price, buy_price) => {
        let pnl = 0
        if (prices.items.length) {
            const currentPrice = prices.items.find( (r) => { return r.symbol === symbol }).price
            if (currentPrice) {
                if (sell_price > 0) {
                    pnl = 100 * (sell_price - currentPrice) / currentPrice
                }
                else if (buy_price > 0) {
                    pnl = 100 * (currentPrice - buy_price) / buy_price
                }
            }
        }
        return pnl.toFixed(2)
    }

    async function login() {
        // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#loginwithredirect
        console.log("-0-0-0-0-0-0-0-", window.location.href)
        //auth0.client.loginWithRedirect({ appState: { targetUrl: window.location.href } })
        await auth0.client.loginWithRedirect({ appState: { targetUrl: '/profile' } })
        //await auth0.client.loginWithPopup()
        //console.log("-1-1-1-1-1-1-", await auth0.client.getUser() )
    }

    const getSignals = () => {
        console.log("getSignals...")
        return axios.get('/api/signals')
    }

    const { data: signals } = useRequest( () =>  getSignals(), {
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
      signals
    }
  },
})
</script>

<style lang="postcss" scoped>
.dark_button {
  @apply border-2 px-3 py-2 border-blue-900 rounded-lg text-gray-400 cursor-pointer hover:bg-gray-800 hover:text-gray-200;
}
</style>