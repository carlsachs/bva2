<template>

  <div v-if="!auth0.state.isAuthenticated || !auth0.state.user" class="mx-2 my-4 py-4 border-2 border-blue-900 rounded-lg text-white relative">
    <div class="mt-10 text-sm"><i>Account Preview</i></div>
    <img class="mx-auto mb-5" alt="BvA Account" src="/bva-account.png" />
  </div>
  <div v-if="auth0.state.isAuthenticated && auth0.state.user" class="text-center text-gray-300">

    <div class="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
      <div v-for="subscription in subscriptions" >
        <div v-if="subscription.count>0"  :class="{ 'bg-indigo-900 bg-opacity-20': subscription.status!=='ZISABLED' }" :key="subscription.code" class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative"> 
          <div class="text-4xl font-extrabold text-blue-600"><b>{{ subscription.name }}</b></div>
          <hr class="w-5 mx-auto border-blue-400 my-8">
          <button v-if="!subs" class="blue_button" type="button">
            Loading <feather-loader class="ml-2" />
          </button>
          <div v-else>
            <div class="mt-9" v-if="subscription.status!=='ZISABLED'">
              <div class="flex items-center justify-center">
                <label :for="'toogle'+subscription.code" class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input :id="'toogle'+subscription.code" type="checkbox" class="sr-only" v-model="subscription.status" true-value="ACTIVE" false-value="PAUSED" 
                      @change="changeStatus(subscription)"/>
                    <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                  </div>
                  <div :class="{ 'text-green-200': subscription.status==='ACTIVE' }" class="text-3xl ml-3 text-gray-500 font-medium">
                    {{ subscription.status }}
                  </div>
                </label>
              </div>
              <div :class="{ 'bg-indigo-900 bg-opacity-20': subscription.qty===0 }" class="text-indigo-200 mx-4 my-4 p-4 rounded-lg relative flex-auto">
                <div v-if="subscription.code === 'bva_subs'">You need to have some BTC (<i>and some BNB to pay for the Binance trading fees</i>) on your <b>Spot</b> and <b>Margin</b> wallets. We recommend using 1/20th of your total BTC to safely cover up to 15 concurent signals. The minimum amout is around 0.0005 BTC.</div>
                <div v-if="subscription.code === 'bva_long_only_subs'">You need to have some BTC (<i>and some BNB to pay for the Binance trading fees</i>) on your <b>Spot</b> wallet. We recommend using 1/20th of your total BTC to safely cover up to 15 concurent signals. The minimum amout is around 0.0005 BTC.</div>
                <div class="mt-10 text-center font-bold text-xl">{{ subscription.base_asset }} amount to trade for each signal: &nbsp;</div>
                <input
                  size="50" v-model="subscription.qty" placeholder="" aria-label="btc qty" type="number" autocomplete="false"
                  class="my-3 px-4 py-2 text-sm text-center bg-gray-900 border rounded outline-none active:outline-none border-blue-900"
                  @input="resetInput"
                >
                <div>
                  <button class="dark_button" @click="saveQty(subscription)">Save</button>
                </div>
                <span :class="{'text-orange-500' : qty_result!=='success', 'text-indigo-500':qty_result==='success'}">{{ qty_result }}</span>
              </div>
              <hr class="w-5 mx-auto border-blue-400 my-8">
              <div :class="{ 'bg-indigo-900 bg-opacity-20': !subscription.key || !subscription.secret }" class="text-indigo-200 mx-4 my-4 p-4 rounded-lg relative flex-auto">
                <div class="my-3 text-xl font-bold"><a href="https://www.binance.com/en/my/settings/api-management?ref=W5BD94FW" target="_new"><u>Binance API Key Information</u></a>&nbsp;</div>
                <input
                  v-model="subscription.key"
                  placeholder="your api key"
                  aria-label="key"
                  type="text"
                  autocomplete="false"
                  class="my-3 px-4 py-2 text-sm text-center bg-gray-900 border rounded outline-none active:outline-none border-gray-700"
                  @input="resetInput"
                >
                <br>
                <input
                  v-model="subscription.secret"
                  placeholder="your api secret"
                  aria-label="secret"
                  type="text"
                  autocomplete="false"
                  class="my-3 px-4 py-2 text-sm text-center bg-gray-900 border rounded outline-none active:outline-none border-gray-700"
                  @input="resetInput"
                >
                <div class="my-3"><a href="https://www.binance.com/en/my/settings/api-management?ref=W5BD94FW" target="_new"><u>You can find your API key here.</u></a>&nbsp;</div>
                <div><button class="dark_button" @click="saveStratKey(subscription)">Save</button></div>
                <span :class="{'text-orange-500' : key_result!=='success', 'text-indigo-500':key_result==='success'}">{{ key_result }}</span>
                <div v-if="!subscription.key || !subscription.secret" class="mt-4 font-bold">Please enter your Binance API key information.</div>
              </div>
              <hr class="w-5 mx-auto border-blue-400 my-8">
              <div class="text-indigo-200 mx-4 p-4 rounded-lg relative flex-auto">
                <div class="my-3">Email notification:</div>
              </div>
              <div class="flex items-center justify-center">
                <label :for="'tooglen'+subscription.code" class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input :id="'tooglen'+subscription.code" type="checkbox" class="sr-only" v-model="subscription.email_notif" true-value="true" false-value="false" 
                      @change="changeNotif(subscription)"/>
                    <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                  </div>
                </label>
              </div>
              <hr class="w-5 mx-auto border-blue-400 my-8">
              <div v-if="!subscription.confirm">
                <button class="dark_button" @click="confirmCancelSubs(subscription)">
                  Cancel your {{ subscription.name }} subscription
                </button>
              </div>
              <div v-if="subscription.confirm">
                <button class="red_button" type="button" @click="cancelSubs(subscription)">
                  Confirm the cancelation of your subscription <feather-check class="ml-2" />
                </button>
              </div>
            </div>
            <div v-else>
              <div class="my-5 font-bold text-3xl text-blue-300">{{ subscription.count }} subscriptions left</div>
              <div class="my-5 font-bold text-green-500 text-3xl">{{ subscription.price }} {{ subscription.currency }} per month</div>
              <Stripe
                v-if="subscription.stripe_id" 
                :customerEmail="auth0.state.user?.email" 
                :clientReferenceId="auth0.state.user?.data?.id" 
                :stripeId="subscription.stripe_id"
                :description="subscription.name"
                :price="subscription.price"
              />
              <div v-if="!subscription.stripe_id"  class="m-5">
                <button class="green_button font-bold text-xl" @click="subscribe(subscription)">Subscribe to {{ subscription.name }}</button>
              </div>
              <div v-if="subscription.currency==='USD'" class="mt-9">If you want to pay with cryptos,</div>
              <div v-if="subscription.currency==='USD'" class="">please contact us at <a href="mailto:support@bitcoinvsalts.com">support@bitcoinvsalts.com</a></div>
            </div>
          </div>
          <div v-if="cancel_sub_result" :class="{'text-red-500' : cancel_sub_result!=='success', 'text-indigo-500':cancel_sub_result==='success'}">{{ cancel_sub_result }}</div>
        </div>
      </div>
    </div>


    <div class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">

      <h1 class="mb-7 text-5xl text-uppercase font-semibold">Your PNL</h1>

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
                        <div class="text-center">PAIR</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">PNL</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">TYPE</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">STRAT NAME</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">BUY PRICE</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">SELL PRICE</div>
                      </th>
                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <div class="text-center">STATUS</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody v-if="trades" v-for="(row, i) in trades.slice(0, 10 * loadMoreStore.profile)" :key="row.id" class="divide-y divide-gray-200 hover:bg-blue-900 hover:bg-opacity-40 visited:bg-blue-900 visited:bg-opacity-40">
                    <tr>
                      <td v-if="row.type === 'LONG'" :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ moment(Number(row.buy_time)).fromNow() }}</router-link>
                      </td>
                      <td v-else :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ moment(Number(row.sell_time)).fromNow() }}</router-link>
                      </td>
                      <td class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.pair }}</router-link>
                      </td>
                      <td v-if="row.pnl" :class="{ 'text-green-500': Number(row.pnl)>0, 'text-red-500': Number(row.pnl)<0 }" class="px-6 py-4 font-bold whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ Number(row.pnl).toFixed(2) }}%</router-link>
                      </td>
                      <td v-else class="italic px-6 py-4 text-gray-400 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id"> {{ getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%</router-link>
                      </td>
                      <td v-if="row.type==='SHORT'" class="text-orange-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.type }}</router-link>
                      </td>
                      <td v-else class="text-blue-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.type }}</router-link>
                      </td>
                      <td class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/strat/+row.stratid">{{ row.stratname }}</router-link>
                      </td>
                      <!--
                      <td v-if="Number(row.pnl)>0" :class="{ 'font-bold': row.pnl }" class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                          {{ row.pnl ? Number(row.pnl).toFixed(2) : getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%
                      </td>
                      <td v-else :class="{ 'font-bold': row.pnl }" class="text-red-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                          {{ row.pnl ? Number(row.pnl).toFixed(2) : getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%
                      </td>
                      -->
                      <td class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.buy_price ? row.buy_price : '---' }}</router-link>
                      </td>
                      <td class="text-red-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.sell_price ? row.sell_price : '---' }}</router-link>
                      </td>
                      <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <router-link :to="/trade/+row.id">{{ row.status }}</router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <button v-if="trades?.length>0" class="mx-auto my-3 dark_button" type="button" @click="loadMore">Load More</button>
      </div>
    </div>

    <div class="p-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-5">

      <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative flex-auto">
        <div class="my-3 text-indigo-200">Change your username: &nbsp;</div>
        <input
          id="username"
          v-model="username"
          placeholder="your username"
          aria-label="username"
          type="text"
          autocomplete="false"
          class="my-3 px-4 py-2 text-sm text-center bg-transparent border rounded outline-none active:outline-none border-gray-700"
          @keydown.enter="confirmUsername"
          @input="resetInput"
        >
        <div v-if="!confirmUser">
          <button class="dark_button" :disabled="!username" @click="confirmUsername">Save</button>
        </div>
        <div v-if="confirmUser">
          <button class="red_button" :disabled="!username" @click="saveUser">Confirm</button>
        </div>
        <span :class="{'text-red-500' : user_result!=='success', 'text-indigo-500':user_result==='success'}">{{ user_result }}</span>
      </div>

      <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative flex-auto">
        <div class="my-3 text-indigo-200">Change your password: &nbsp;</div>
        <input
          id="password"
          v-model="password"
          placeholder="your new password"
          aria-label="password"
          type="text"
          autocomplete="false"
          class="my-3 px-4 py-2 text-sm text-center bg-transparent border rounded outline-none active:outline-none border-gray-700"
          @keydown.enter="confirmPasswd"
          @input="resetInput"
        >
        <div v-if="!confirmPass">
          <button class="dark_button" :disabled="!password" @click="confirmPasswd">Save</button>
        </div>
        <div v-if="confirmPass">
          <button class="red_button" :disabled="!password" @click="savePass">Confirm</button>
        </div>
        <span :class="{'text-red-500' : pwd_result!=='success', 'text-indigo-500':pwd_result==='success'}">{{ pwd_result }}</span>
      </div>

    </div>


    <!--div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-gray-200 relative">
      <span>{{ auth0.state.user?.data }}</span>
      <br/><br/>
      <span>{{ subs }}</span>
      <br/><br/>
      <span>{{ auth0.state.user?.data?.email }} {{ auth0.state.user?.token }} {{ auth0.state.user?.data?.id }}</span>
      <br/><br/>
      <span>{{ subscriptions }}</span>
      <br/><br/>
      <span>{{ trades?.length }}</span>
      <br/><br/>
      <span>{{ series[1]?.data?.length }}</span>
      <br/><br/>
      <button @click="showModal = true">Open Modal</button>
      <br/>
      <br/>
    </div-->


    <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
      <div class="modal__title m-20">Hello, vue-final-modal</div>
    </vue-final-modal>

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


export default {
  methods: {    
    setDetailsForComponent(email, password) {    
      console.log("Calling from child component", email, password)
    }
  },
  setup() {

    startStats(Date.now())
    console.log("PROFILE")

    const smoothScroll = inject('smoothScroll')
    const loadMoreStore = useLoadMoreStore()
    loadMoreStore.resetStrat()

    const mychart = ref(null)
    //const myEl = ref(null)

    const prices = usePriceStore()
    const klines = useKlineStore()
    
    const auth0: any = inject("auth0")
    const stats: any = inject("stats")

    const router = useRouter()

    const openTradedSignal = (row) => {
      router.push("/trade/"+ row.id)
    }

    const openStrat = (id) => {
        router.push("/strat/"+ id)
    }

    const state = reactive({ 
      ///////// ///////// ///////// /////////
      auth0, 
      subscriptions: [],
      ///////// ///////// ///////// /////////
      id: auth0.state.user?.data?.id,
      username: auth0.state.user?.data?.nickname,
      token: auth0.state.user?.data?.token,
      email: auth0.state.user?.data?.email,
      subs: auth0.state.user?.subs,
      ///////// ///////// ///////// /////////
      cancel_sub_result: '',
      key_result: '',
      user_result: '',
      password: '',
      pwd_result: '',
      searchEnabled: true,
      showModal: false,
      confirmPass: false,
      confirmUser: false,
      qty_result: '',
      ///////// ///////// ///////// /////////
      strat_id: 466,
      stratname: 'Your PNL',
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
  
    const getProducts = async () => {
      const res = await axios.get('/api/products')
      let result = {}
      for (const yo of res.data) {
        state.subscriptions.push({
          name: yo.name,
          code: yo.code,
          price: Number(yo.price),
          count: Number(yo.count),
          currency: yo.currency,
          base_asset: yo.base_asset,
          stripe_id: yo.stripe_id,
          confirm: false,
          status: 'ZISABLED',
        })
      }
    }


    watch( () => auth0.state.user?.data, (user) => {
      //console.log("WATCH USER DATA", JSON.stringify(user.subs[0]))
      state.username = user.nickname
      state.id = user.id
      state.email = user.email
      state.token = auth0.state.user?.token
      state.subs = user.subs
      state.subscriptions.map( yo => {
        if (state.subs?.findIndex(sub => (sub.code == yo.code)) > -1) {
          yo.status = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].status
          yo.qty = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].qty
          yo.key = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].key
          yo.secret = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].secret
          yo.email_notif = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].email_notif
          yo.sid = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].sid
        }
        else {
          yo.status = 'ZISABLED'
          yo.qty = 0.005
          yo.key = ""
          yo.secret = ""
          yo.email_notif = false
          yo.sid = ""
        }
      })
      state.subscriptions = _.orderBy(state.subscriptions, 'status', 'ASC')
      run()
    })

    const getTrades = () => {
      console.log("getTrades", auth0.state?.user?.data?.email, auth0.state?.user?.data?.id)
      return axios.get('/api/trades?sub='+auth0.state?.user?.data?.sub+'&id='+ auth0.state?.user?.data?.id, { headers: {Authorization:`Bearer ${auth0.state?.user?.token}`} })
    }

    const { data: trades, run } = useRequest( () => getTrades(), {
      cacheKey: 'trades',
      manual: true,
      //cacheTime: 300000,
      pollingInterval: 8000,
      formatResult: res => {
        return res.data
      },
      onSuccess: (res) => {
        console.log("TRADES->", res.length)
      }
    })

    onMounted( async () => {
      await getProducts()
      console.log("onMounted...", auth0.state.user?.token, auth0.state.user?.data?.email)
      if (auth0.state.user?.token && auth0.state.user?.data?.email) {
        console.log("re run =======>", auth0.state.user?.token)
        state.subs = auth0.state.user?.data?.subs
        state.username = auth0.state.user?.data?.nickname
        state.id = auth0.state.user?.data?.id
        state.email = auth0.state.user?.data?.email
        state.subscriptions.map( yo => {
          if (state.subs?.findIndex(sub => (sub.code == yo.code)) > -1) {
            yo.status = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].status
            yo.qty = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].qty
            yo.key = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].key
            yo.secret = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].secret
            yo.email_notif = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].email_notif
            yo.sid = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].sid
          }
          else {
            yo.status = 'ZISABLED'
            yo.qty = 0.005
            yo.key = ""
            yo.secret = ""
            yo.email_notif = false
            yo.sid = ""
          }
        })
        state.subscriptions = _.orderBy(state.subscriptions, 'status', 'ASC')
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

    const confirmCancelSubs = async (subscription) => {
      console.log("confirmCancelSubs", subscription)
      subscription.confirm = true
    }

    const cancelSubs = async (subscription) => {
      console.log("cancelSubs", subscription.code, subscription.sid )
      await axios.put('/api/cancelsub?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
        { code: subscription.sid },
        { headers: {Authorization:`Bearer ${auth0.state.user?.token}`} }
      )
      .then( (response) => {
        console.log("cancelSubs result:", response.data)
        subscription.confirm = false
        if (response.data.msg == 'success') {
          state.cancel_sub_result = response.data.msg
        }
        else {
          state.cancel_sub_result = "error"
        }
        const index = state.subscriptions?.findIndex( sub => (sub.code === subscription.code) )
        if (index > -1) state.subscriptions?.splice(index, 1)
      })
      .catch( (error) => {
        subscription.confirm = false
        console.log("ERROR cancelSubs:", error)
        state.cancel_sub_result = "error"
        const index = state.subscriptions?.findIndex( sub => (sub.code === subscription.code) )
        if (index > -1) state.subscriptions?.splice(index, 1)
      })
    }

    const confirmPasswd = async () => {
      state.confirmPass = true
    }

    const changeStatus = async (sub) => {
      console.log("changeStatus", sub.status)
      if (sub.status === 'ACTIVE' && Number(sub.qty)<0.0005) {
        state.qty_result = "Please set an amount to trade >= 0.0005 BTC"
        sub.status = 'PAUSED'
      }
      else if (sub.status === 'ACTIVE' && (!sub.key || !sub.secret) ) {
        state.key_result = "Please enter your Binance API key information."
        sub.status = 'PAUSED'
      }
      else {
        console.log("setsubstatus setsubstatus setsubstatus")
        await axios.put('/api/setsubstatus?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
          { 
            status:sub.status, 
            sid:sub.sid, 
            qty:sub.qty, 
            key:sub.key, 
            secret:sub.secret, 
            email:auth0.state?.user?.email },
          { headers: {Authorization:`Bearer ${auth0.state.user.token}`} }
        )
        .then( (response) => {
          console.log("changeStatus.response.data:", response.data)
          if (response.data.msg == 'success') {
          }
          else {
            console.log("---->", response.data.err)
          }
        })
        .catch( (error) => {
          console.log("ERROR changeStatus", error)
        })
      }
    }


    const changeNotif = async (sub) => {
      console.log("changeNotif", sub.email_notif)
      await axios.put('/api/setsubnotif?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
        { 
          email_notif:sub.email_notif, 
          sid:sub.sid, 
        },
        { headers: {Authorization:`Bearer ${auth0.state.user.token}`} }
      )
      .then( (response) => {
        console.log("changeNotif.response.data:", response.data)
        if (response.data.msg == 'success') {
        }
        else {
          console.log("---->", response.data.err)
        }
      })
      .catch( (error) => {
        console.log("ERROR changeNotif", error)
      })
    }

    const resetInput = () => {
      console.log("resetInput")
      state.confirmPass = false
      state.confirmUser = false
      state.pwd_result = null
      state.user_result = null
      state.key_result = null
      state.qty_result = null
      state.cancel_sub_result = null
    }

    const saveStratKey = async (subscription) => {
      console.log("saveStratKey", subscription.code, subscription.key, subscription.secret )
      await axios.put('/api/setsubkey?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
        { key: subscription.key, secret: subscription.secret, code: subscription.code, email: auth0.state?.user?.email },
        { headers: {Authorization:`Bearer ${auth0.state.user.token}`} }
      )
      .then( (response) => {
        console.log("saveStratKey.response.data:", response.data)
        if (response.data.msg == 'success') {
          state.key_result = response.data.msg
        }
        else {
          state.key_result = "error"
        }
      })
      .catch( (error) => {
        console.log("ERROR saveStratKey", error)
        state.key_result = "error"
      })
    }

    const saveQty = async (subscription) => {
      console.log("saveQty", JSON.stringify(subscription))
      if (Number(subscription.qty) >= 0.0005) {
        await axios.put('/api/setsubsqty?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
          { qty: subscription.qty, code: subscription.sid, email: auth0.state?.user?.email },
          { headers: {Authorization:`Bearer ${auth0.state.user.token}`} }
        )
        .then( (response) => {
          console.log("saveQty.response.data:", response.data)
          if (response.data.msg == 'success') {
            state.qty_result = response.data.msg
          }
          else {
            console.log("---->", response.data.err)
            state.qty_result = response.data.err
          }
        })
        .catch( (error) => {
          console.log("ERROR saveQty", error)
          state.qty_result = "error"
        })
      }
      else {
        state.qty_result = "Please set an amount to trade >= 0.0005 BTC"
      }
    }

    const savePass = async () => {
      state.confirmPass = false
      await axios.put('/api/pwduser?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
        { password: state.password },
        { headers: {Authorization:`Bearer ${auth0.state.user.token}`} }
      )
      .then( (response) => {
        console.log("savePwd.response.data:", response.data)
        if (response.data.msg == 'success') {
          state.password = ''
          state.pwd_result = response.data.msg
        }
        else {
          state.pwd_result = "error"
        }
      })
      .catch( (error) => {
        console.log("ERROR pwduser", error)
        state.pwd_result = "error"
      })
    }

    const confirmUsername = async (code) => {
      state.confirmUser = true
    }

    const saveUser = async () => {
      state.confirmUser = false
      await axios.put('/api/setusername?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
        { username: state.username },
        { headers: {Authorization:`Bearer ${auth0.state.user.token}`} }
      )
      .then( (response) => {
        console.log("saveUser.response.data:", response.data)
        if (response.data.msg == 'success') {
          state.user_result = response.data.msg
          updateUsername(state.username)
        }
        else {
          console.log("---->", response.data.err)
          state.user_result = response.data.err
        }
      })
      .catch( (error) => {
        console.log("ERROR saveUser", error)
        state.user_result = "error"
      })
    }

    watch( () => mychart.value, (value) => {
      setTimeout(function(){ value?.toggleSeries('Bitcoin') }, 6000)
    })

    /*
    watch( () => myEl.value, (value) => {
      const myInterval = setInterval( function() { 
        if ( state?.subs?.length > 0 && (!state.key || !state.secret) ) {
          smoothScroll({
            scrollTo: myEl.value,
            hash: '#sampleHash',
            duration: 1000,
            //offset: -10, 
            updateHistory: false,
          })
        }
        else {
          clearInterval(myInterval)
        }
      }, 4000)
    })
    */

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

    const loadMore = () => {
      console.log("loadMore........")
      loadMoreStore.moreProfile()
      console.log("loadMore...", loadMoreStore.profile)
    }

    async function signInUser(token: String, sub: String) {
      //axios.defaults.timeout = 30000;
      console.log("signInUser", token, sub)
      return axios
        .get('/api/getusersignin?sub='+sub, { headers: {Authorization:`Bearer ${token}`} } )
        .then( (response) => {
          return response.data
        })
        .catch( (e) => {
          console.log("signInUser ERROR", e)
          return 0
        })
    }

    const subscribe = async (sub) => {
      console.log("subscribe", sub.code)
      await axios.put('/api/subscribe?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
        { 
          code: sub.code,
          name: sub.name 
        },
        { headers: {Authorization:`Bearer ${auth0.state.user?.token}`} }
      )
      .then( async (response) => {
        console.log("subscribe.response.data:", response.data)
        if (response.data.msg == 'success') {
          const user_data = await signInUser(auth0.state.user.token, auth0.state.user.sub)
          auth0.state.user.data = user_data
        }
        else {
          console.log("---->", response.data.err)
        }
      })
      .catch( (error) => {
        console.log("ERROR subscribe", error)
      })
    }
    
    return {
      ...toRefs(state),
      moment,
      openTradedSignal,
      getCurrentPnL,
      savePass,
      saveUser,
      saveStratKey,
      confirmCancelSubs,
      cancelSubs,
      mychart,
      //myEl,
      loadMoreStore,
      loadMore,
      confirmPasswd,
      confirmUsername,
      resetInput,
      saveQty,
      changeStatus,
      changeNotif,
      trades,
      openStrat,
      subscribe
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

::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  border-color: #2d3748;
  background-color: #1a202c;
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}

.modal {
  width: 300px;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 20px;
  text-align: center;
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