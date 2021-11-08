<template>
  <div v-if="auth0.state.isAuthenticated && auth0.state.user" class="text-center text-gray-300">

    <div class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">

      <h1 class="my-7 text-3xl text-uppercase font-semibold">Your Subscription Sales</h1>
      
      <div v-if="true" class="mt-4 p-4">
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto">
            <div class="py-2 align-middle inline-block min-w-full">
              <div class=" overflow-hidden border-1 border-blue-900 rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">NAME</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">STATUS</div>
                      </th>
                       <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">DATE</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">AMOUNT</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">EMAIL</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">PAID OUT</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody v-if="sales" v-for="(row, i) in sales" :key="row.id" class="divide-y divide-gray-200 hover:bg-blue-900 hover:bg-opacity-40 visited:bg-blue-900 visited:bg-opacity-40">
                    <tr>
                      <td class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/strat/+row.stratid">{{ row.name }}</router-link>
                      </td>
                      <td :class="{ 'text-green-500':row.status=='ACTIVE', 'text-red-500':row.status=='PAUSED', 'text-gray-300':row.status=='CANCELED' }" class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        {{ row.status }}
                      </td>
                      <td class="px-6 py-4 text-gray-300 whitespace-no-wrap text-sm leading-5">
                        {{ row.paiddate }}
                      </td>
                      <td class="px-6 py-4 text-green-500 font-bold whitespace-no-wrap text-sm leading-5">
                        {{ row.paid_amount }} {{ row.paid_currency }}
                      </td>
                      <td class="px-6 py-4 text-gray-300 whitespace-no-wrap text-sm leading-5">
                        {{ row.email }}
                      </td>
                      <td class="px-6 py-4 text-gray-300 whitespace-no-wrap text-sm leading-5">
                        {{ row.paid_out?'YES':'NO' }}
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

import { provide, reactive, ref, toRefs, watch, inject, computed, onMounted } from 'vue'
import { useRouter } from "vue-router"
import _ from "lodash"
import moment from "moment"
import { useRequest } from 'vue-request'
import { startStats, endStats } from '~/modules/stats'
import axios from "~/utils/axios"
import { useHead } from '@vueuse/head'

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
        title: computed( () => "Your Sales"),
    })
    
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
      loading: true,
      total_pnl: 0,
      avg_pnl: 0,
      strat_lifetime: 0,
      total_signals: 0,
      win_rate: 0,
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

    const getSales = () => {
      console.log("getSales")
      return axios.get('/api/sales?sub='+auth0.state?.user?.data?.sub+'&id='+ auth0.state?.user?.data?.id, { headers: {Authorization:`Bearer ${auth0.state?.user?.token}`} })
    }

    const { data: sales, run } = useRequest( () => getSales(), {
      cacheKey: 'sales',
      manual: true,
      //cacheTime: 300000,
      pollingInterval: 8000,
      formatResult: res => {
        state.loading = false
        return res.data
      },
      onSuccess: (res) => {
        console.log("SALES->", res.length)
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

    watch( sales, (sales) => {
      console.log("sales...", sales.length)

      endStats(Date.now())
    })
    
    return {
      ...toRefs(state),
      moment,
      sales,
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