<template>
    <div>
        <div class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">

            <h1 class="text-xl mb-7 text-uppercase font-semibold">Top Strategies for the past 7 days</h1>
            <div v-if="!strats" class="my-0 text-gray-300">Loading... <img class="mx-auto mb-5" src="/spinner.svg" /></div>
            <div v-if="true" class="mt-4 p-4">
                <div class="flex flex-col">
                    <div class="-my-2 overflow-x-auto">
                        <div class="py-2 align-middle inline-block min-w-full">
                            <div class=" overflow-hidden border-1 border-blue-900 rounded-lg">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <tbody v-if="strats" class="divide-y divide-gray-200 hover:bg-blue-900 hover:bg-opacity-40 visited:bg-blue-900 visited:bg-opacity-40" v-for="(row, i) in strats" :key="row.id">
                                        <tr>
                                            <td class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                                                <h1 class="text-xl text-white"><router-link :to="/strat/+row.id">{{ row.stratname }}</router-link></h1>
                                                {{ row.max_concurrent }}
                                                {{ row.description }}
                                                <div :class="{ 'text-green-500': Number(row.sumpnl)>0, 'text-red-500': Number(row.sumpnl)<0 }">{{ Number(row.sumpnl).toFixed(2) }}%</div>
                                                <button v-if="row.description" @click="login" class="font-bold mx-auto text-xl items-center bg-indigo-900 bg-opacity-10 shadow-xl px-6 py-5 rounded-lg cursor-pointer hover:bg-opacity-100 transition">
                                                    <div class="text-green-500 text-xl font-semibold">Subscribe and Auto Trade It Now</div>
                                                </button>
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

import { reactive, computed, toRefs, defineComponent, watch, inject } from "vue"
import axios from "~/utils/axios"
import moment from "moment"
import { useRouter } from "vue-router"
import { useRequest } from 'vue-request'
import { usePriceStore } from '../stores/prices'
import { startStats, endStats } from '~/modules/stats'
import { useHead } from '@vueuse/head'

export default defineComponent({
  name: "strats",
  setup: () => {
    startStats(Date.now())

    useHead({
        title: computed( () => "Top Strategies"),
        meta: [
            {
            name: `description`,
            content: computed(() => "Check out the best performing crypto trading strategies of the past 7 days on BVA."),
            },
        ],
    })
    
    const prices = usePriceStore()

    const router = useRouter()

    const openStrat = (id) => {
        router.push("/strat/"+ id)
    }

    const auth0: any = inject("auth0")

    const state = reactive({
        ///////// ///////// ///////// /////////
        auth0,
        ///////// ///////// ///////// /////////
    })

    async function login() {
        // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#loginwithredirect
        console.log("-0-0-0-0-0-0-0-", window.location.href)
        //auth0.client.loginWithRedirect({ appState: { targetUrl: window.location.href } })
        await auth0.client.loginWithRedirect({ appState: { targetUrl: '/subscriptions' } })
        //await auth0.client.loginWithPopup()
        //console.log("-1-1-1-1-1-1-", await auth0.client.getUser() )
    }

    const getStrats = () => {
        console.log("getStrats...")
        return axios.get('/api/topstrats')
    }

    const { data: strats } = useRequest( () =>  getStrats(), {
        cacheKey: 'strats',
        //cacheTime: 300000,
        pollingInterval: 20000,
        formatResult: res => {
            console.log(res)
            return res.data
        },
        onSuccess: (res) => {
            console.log("34411--1-1>", res.length)
        }
    })
    
    watch(strats, (strats) => {
        console.log("strats...", strats.length)
        endStats(Date.now())
    })

    return {
      ...toRefs(state),
      moment,
      login,
      strats
    }
  },
})
</script>

<style lang="postcss" scoped>
.dark_button {
  @apply border-2 px-3 py-2 border-blue-900 rounded-lg text-gray-400 cursor-pointer hover:bg-gray-800 hover:text-gray-200;
}
</style>