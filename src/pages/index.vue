
<template>
    <div>
        <div class="mx-2">
            <div class="my-2 overflow-x-auto">
                <div class="py-2 align-middle inline-block min-w-full">
                    <div class="mx-2 my-4 p-4 border-2 border-blue-900 brounded-lg text-white relative">
                        <div class="text-2xl text-cyan-200 mt-3">
                            Our goal was to democratize access to the best crypto trading algorithms. BVA is sunsetting.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="p-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-5">
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
                <a href="https://www.binance.com/?ref=W5BD94FW" target="_new">
                    <img width=200 class="mx-auto mb-5" alt="BvA Discord" src="/binance.svg" />
                    <div class="text-2xl text-white">Official Binance Broker</div>
                </a>
            </div>
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
                <a href="https://thesupertrades.com/" target="_new">
                    <img width=132 class="mx-auto mb-5" alt="Strategy Incubator" src="/super_trades_logo.png" />
                    <div class="text-2xl text-white">The Super Trades</div>
                </a>
            </div>
        </div>
        <div class="p-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-5">
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
                <a href="https://discordapp.com/invite/4EQrEgj" target="_new">
                    <img width=132 class="mx-auto mb-5" alt="BvA Discord" src="/discord.png" />
                    <div class="text-2xl text-white">1200+ Discord Members</div>
                </a>
            </div>
            <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
                <a href="https://github.com/bitcoinvsalts/node-binance-trader" target="_new">
                    <img width=102 class="mx-auto mt-3 mb-10" alt="BvA GitHub" src="/github.png" />
                    <div class="text-2xl text-white">900+ GitHub Stars</div>
                </a>
            </div>
        </div>

    </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, computed, toRefs, defineComponent, watch, inject } from "vue"
import axios from "~/utils/axios"
import _ from "lodash"
import moment from "moment"
import { useRouter } from "vue-router"
import { useRequest } from 'vue-request'
import { usePriceStore } from '../stores/prices'
import { useProductStore } from '../stores/products'
import { startStats, endStats } from '~/modules/stats'
import { useHead } from '@vueuse/head'
import { useProductStore } from '~/stores/products'
import BigNumber from 'bignumber.js'

export default defineComponent({
  name: "strats",
  setup: () => {
    startStats(Date.now())

    useHead({
        title: computed( () => "Bitcoin vs. Alts : Top Crypto Auto Trading Algorithms"),
        meta: [
            {
            name: `description`,
            content: computed( () => "Our goal is to democratize access to the best crypto auto trading algorithms. We track, compare and sell subscriptions to the best crypto auto trading strategies in the world."),
            },
        ],
    })

    /////////// /////////// ///////////

    const stratchart = ref(null)

    const openSignal = (row) => {
        router.push("/signal/"+ row.id)
    }

    /////////// /////////// ///////////
    
    const prices = usePriceStore()

    const router = useRouter()

    const openStrat = (id) => {
        router.push("/strat/"+ id)
    }

    const auth0: any = inject("auth0")

    const state = reactive({
        days: 31,
        stratcount: 0,
        auth0,
        products: [],
        baseAsset: null,
        subOnly: true,
        ///////// ///////// ///////// /////////
        stratname: '',
        total_pnl: 0,
        ///////// ///////// ///////// /////////
        series: [
            { name: "Bitcoin", data: [] },
            { name: "", data: [] }
        ],
        chartOptions: {
            chart: { width: "100%", type: 'area', stacked: false },
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

    ///////// ///////// ///////// /////////

    const myEl = ref(null);

     const getStratData = () => {
        console.log("getStratData...")
        return axios.get('/api/stratdata?id=2680')
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
    
        let tpnl_btc = []
        let tpnl_bva = []
        let pnl_btc = 0
        let pnl_bva = 0

        state.stratname = signals[0].stratname
        state.series[1].name = signals[0].stratname
        const days = 10 + (signals[signals.length-1].sell_time ? parseInt((Date.now() - signals[signals.length-1].sell_time)/86400000) : 0)
        
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
        })
        .catch((err) => {
            console.log(err)
        })
        endStats(Date.now())
    })

    ///////// ///////// ///////// /////////

    async function setDays() {
        console.log("setDays")
        run()
    }

    async function setBaseBTC() {
        console.log("setBaseBTC")
        state.baseAsset = 'BTC'
        run()
    }

    async function setSubOnly() {
        console.log("setSubOnly")
        state.subOnly = !state.subOnly
        run()
    }

    async function setBaseUSDT() {
        console.log("setBaseUSDT")
        state.baseAsset = 'USDT'
        run()
    }

    const getStratCount = async () => {
      const res = await axios.get('/api/stratcount')
      state.stratcount = parseInt(res.data.max)
      console.log("getStratCount:", state.stratcount)
    }

    onMounted( async () => {
        axios.get('/api/strategy?id=2680')
        .then( s => {
            state.max_concurrent = s.data.max_concurrent
        })
        .catch((err) => {
            console.log(err)
        })
        await getStratCount()
        run()
    })

    async function gotostrat(row) {
        router.push("/strat/"+ row.id)
        /*
        console.log("subscribe", !auth0.state.isAuthenticated)
        if (!auth0.state.isAuthenticated) {
            console.log("-0-0-0-0-0-0-0-", window.location.href)
            //auth0.client.loginWithRedirect({ appState: { targetUrl: window.location.href } })
            await auth0.client.loginWithRedirect({ appState: { targetUrl: '/subscriptions' } })  
            // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#loginwithredirect   
            //await auth0.client.loginWithPopup()
        }
        else {
            router.push("/subscriptions")
        }
        */
    }

    const getStrats = () => {
        console.log("getStrats...", router.currentRoute.value.query.d)
        return axios.get('/api/topstrats?days='+(router.currentRoute.value.query.d?router.currentRoute.value.query.d:31)+'&base='+state.baseAsset+'&so='+state.subOnly)
    } 

    const { data: strats, run } = useRequest( () =>  getStrats(), {
        cacheKey: 'strats',
        manual: true,
        //cacheTime: 300000,
        pollingInterval: 20000,
        formatResult: res => {
            //console.log(res)
            return res.data
        },
        onSuccess: (res) => {
            console.log("34411--1-1>", res.length)
        }
    })
    
    watch(strats, (strats) => {
        endStats(Date.now())
    })

    return {
      ...toRefs(state),
      moment,
      gotostrat,
      strats,
      setDays,
      _,
      setBaseBTC,
      setBaseUSDT,
      setSubOnly,
      myEl,
      stratchart,
    }
  },
})
</script>


<style lang="postcss" scoped>
</style>