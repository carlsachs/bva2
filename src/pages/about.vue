<template>
    <div>

        <div class="text-xl text-cyan-200 mt-10">
            We are a team passionated in algo crypto trading. 
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            We use the latest Machine Learning practices to train our prediction models.
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            Feel free to send us an email at <a href="mailto:support@bitcoinvsalts.com" target="_new">support@bitcoinvsalts.com</a>.
        </div>

    </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent, inject } from "vue"
import axios from "~/utils/axios"
import _ from "lodash"
import { useRouter } from "vue-router"
import { useLoadMoreStore } from '../stores/loadmore'
import { startStats, endStats } from '~/modules/stats'


export default defineComponent({
  name: "Dashboard",
  setup: () => {
    startStats(Date.now())
    console.log("INDEX")

    const router = useRouter()

    const loadMoreStore = useLoadMoreStore()
    loadMoreStore.resetProfile()
    loadMoreStore.resetStrat()

    const state = reactive({
        strategies: [
            {
                id: 466,
                name: "BVA Strategy",
                series: [{ name: "BVA", data: [] }],
                description: "The BVA strategy is the result of a prediction model trained using the latest Machine Learning practices. We use specific data sets made of crypto market data, social sentiments, TAs, traditional financial market data and some secret sauce.",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
            },
            {
                id: 595,
                name: "BVA LONG ONLY Strategy",
                series: [{ name: "BVA LONG ONLY", data: [] }],
                description: "The BVA LONG ONLY strategy is the same than the BVA strategy but only trades LONG signals (no need of margin wallet)",
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
            },
            /*
            {
                id: 670,
                name: "Woltiks Strategy",
                series: [{ name: "Woltiks", data: [] }],
                total_pnl: 0,
                total_signals: 0,
                avg_pnl: 0,
                strat_lifetime: 0,
                win_rate: 0,
            }
            */
        ],
        user: null,
        //rows: [],
        ///////// ///////// ///////// /////////
        chartOptions: {
            chart: { width: "100%", type: 'area' },
            colors: ['#0080FB', '#00E396'],
            dataLabels: { enabled: false, enabledOnSeries: false, },
            legend: { show: true, offsetY: 20, itemMargin: { horizontal: 10, vertical: 20 }, labels: { colors: '#ffffff' }, },
            fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.8, } },
            stroke: {  curve: 'smooth', width: 2, },
            tooltip: { enabled: true, theme: 'dark', },
            xaxis: { type: "datetime", labels: { show: true, style: { colors: '#FFFFFF', fontSize: '12px' }} },
            yaxis: { forceNiceScale: true, labels: { show: true, style: { colors: '#FFFFFF', fontSize: '10px'},
                    formatter: (value) => { return value+'%' },
                },
            }
        },
        ///////// ///////// ///////// /////////
    })

    onMounted(() => {
        for ( const i in state.strategies ) {
            axios.get('/api/strategy?id=' + state.strategies[i].id)
            .then( rows => {
                let tpnl_bva = []
                let pnl_bva = 0
                for ( var row of rows.data.reverse() ) {
                    pnl_bva = pnl_bva + Number(row.pnl) / 15
                    tpnl_bva.push([ Number(row.updated_time), Number(pnl_bva).toFixed(2) ])
                }
                state.strategies[i].strat_lifetime = parseInt((rows.data[rows.data.length-1].updated_time - rows.data[0].updated_time)/86400000)
                state.strategies[i].series[0].data = tpnl_bva
                state.strategies[i].total_pnl = pnl_bva.toFixed(2)
                state.strategies[i].total_signals = rows.data.length
                state.strategies[i].avg_pnl = _.meanBy(rows.data, o => {return Number(o.pnl)}).toFixed(2)
                const positifs = rows.data.filter( bva => { return Number(bva.pnl) > 0 })
                state.strategies[i].win_rate = (100 * positifs.length / rows.data.length).toFixed(2)
            })
            .catch((err) => {
                console.log(err)
            })
        }
        endStats(Date.now())
    })

    const auth0: any = inject("auth0")

    async function login() {
        // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#loginwithredirect
        console.log("-0-0-0-0-0-0-0-", window.location.href)
        //auth0.client.loginWithRedirect({ appState: { targetUrl: window.location.href } })
        await auth0.client.loginWithRedirect({ appState: { targetUrl: '/profile' } })
        //await auth0.client.loginWithPopup()
        //console.log("-1-1-1-1-1-1-", await auth0.client.getUser() )
    }
    
    return {
      ...toRefs(state),
      auth0,
      login
    }
  },
})
</script>

<style>
</style>
