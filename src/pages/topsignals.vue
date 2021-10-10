
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
                                                <router-link :to="/signal/+row.id">{{ prices && getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%</router-link>
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