<template>
  <div v-if="auth0.state.isAuthenticated && auth0.state.user" class="text-center text-gray-300">

    <h2>Your BVA Key: <b class="text-green-200">{{ auth0.state.user?.data?.sub?.replace("auth0|","") }}</b></h2>
    <div class="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
      <div v-for="subscription in products" >
        <div v-if="subscription.count>0"  :class="{ 'bg-indigo-900 bg-opacity-20': subscription.status!=='ZISABLED' }" :key="subscription.code" class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative"> 
          <div class="text-2xl font-extrabold text-blue-600">
            <router-link :to="'/strat/'+subscription.stratid" class=""><b>{{ subscription.name }}</b></router-link>
          </div>
          <hr class="w-5 mx-auto border-blue-400 my-4">
          <div class="text-center font-bold text-xl">Trading Mode: <b class="text-green-200">{{subscription.mode}}</b></div>
          <hr class="w-5 mx-auto border-blue-400 my-4">
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
                  <div :class="{ 'text-green-200': subscription.status==='ACTIVE' }" class="text-2xl ml-3 text-gray-500 font-medium">
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
              <hr class="w-5 mx-auto border-blue-400 my-4">

              <div class="text-indigo-200 mx-4 p-4 rounded-lg relative flex-auto" v-if="subscription.mode==='FUTURE'">
                <div class="my-3">Automatically Set <b>Leverage to 4x</b> and <b>Isolated Mode</b>:</div>
              </div>
              <div class="flex items-center justify-center">
                <label :for="'toogles'+subscription.code" class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input :id="'toogles'+subscription.code" type="checkbox" class="sr-only" v-model="subscription.autoset" true-value="true" false-value="false" 
                      @change="changeAutoSet(subscription)"/>
                    <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                  </div>
                </label>
              </div>
              <hr v-if="subscription.mode==='FUTURE'" class="w-5 mx-auto border-blue-400 my-4">
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
              <div class="my-5 font-bold text-2xl text-blue-300">{{ subscription.count }} subscriptions left</div>
              <div class="my-5 font-bold text-green-500 text-2xl">{{ subscription.price }} {{ subscription.currency }} per month</div>
              <Stripe
                v-if="subscription.stripe_id" 
                :customerEmail="auth0.state.user?.email" 
                :clientReferenceId="auth0.state.user?.data?.id" 
                :stripeId="subscription.stripe_id"
                :description="subscription.name"
                :price="Number(subscription.price)"
              />
              <div v-if="!subscription.stripe_id && !subscription.confirm"  class="m-5">
                <button class="green_button font-bold text-xl" @click="confirmSubscribe(subscription)">Subscribe to {{ subscription.name }}</button>
              </div>
              <div v-if="!subscription.stripe_id && subscription.confirm"  class="m-5">
                <button class="red_button font-bold text-xl" @click="subscribe(subscription)">Please confirm</button>
              </div>
              <div v-if="subscription.currency==='USD'" class="mt-9">If you want to pay with cryptos,</div>
              <div v-if="subscription.currency==='USD'" class="">please contact us at <a href="mailto:support@bitcoinvsalts.com">support@bitcoinvsalts.com</a></div>
            </div>
          </div>
          <div v-if="cancel_sub_result" :class="{'text-red-500' : cancel_sub_result!=='success', 'text-indigo-500':cancel_sub_result==='success'}">{{ cancel_sub_result }}</div>
        </div>
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
  </div>
</template>

<script lang="ts">

import { provide, reactive, ref, toRefs, watch, inject, computed, onMounted } from 'vue'
import { useRouter } from "vue-router"
import _ from "lodash"
import { useProductStore } from '../stores/products'
import { startStats, endStats } from '~/modules/stats'
import { updateUsername } from '~/modules/auth0'
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
    
    const prods = useProductStore()
    const auth0: any = inject("auth0")

    const state = reactive({ 
      ///////// ///////// ///////// /////////
      auth0, 
      products: [],
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
      confirmPass: false,
      confirmUser: false,
      qty_result: '',
      ///////// ///////// ///////// /////////
      total_pnl: 0,
      avg_pnl: 0,
      strat_lifetime: 0,
      total_signals: 0,
      win_rate: 0,
      ///////// ///////// ///////// /////////
    })

    useHead({
        title: computed( () => "Your Subscriptions"),
    })
  
    const getProducts = async () => {
      const res = await axios.get('/api/products')
      let result = {}
      for (const yo of res.data) {
        state.products.push({
          name: yo.name,
          code: yo.code,
          mode: yo.mode,
          stratid: yo.stratid,
          price: Number(yo.price),
          count: Number(yo.count),
          currency: yo.currency,
          base_asset: yo.base_asset,
          stripe_id: yo.stripe_id,
          confirm: false,
          status: 'ZISABLED',
        })
      }
      console.log(JSON.stringify(state.products[0]))
    }

    watch( () => auth0.state.user?.data, (user) => {
      console.log("WATCH USER DATA", JSON.stringify(user.subs[0]))
      console.log(prods.items.length)
      console.log("======-=-=-=-=-=-=-======")
      state.username = user.nickname
      state.id = user.id
      state.email = user.email
      state.token = auth0.state.user?.token
      state.subs = user.subs
      prods.items.map( yo => {
        if (state.subs?.findIndex(sub => (sub.code == yo.code)) > -1) {
          yo.status = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].status
          yo.qty = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].qty
          yo.key = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].key
          yo.secret = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].secret
          yo.email_notif = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].email_notif
          yo.autoset = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].autoset
          yo.sid = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].sid
        }
        else {
          yo.status = 'ZISABLED'
          yo.qty = 0.005
          yo.key = ""
          yo.secret = ""
          yo.email_notif = false
          yo.autoset = true
          yo.sid = ""
        }
      })
      state.products = _.orderBy(prods.items, 'status', 'ASC')
      endStats(Date.now())
    })

    onMounted( async () => {
      //await getProducts()
      console.log("onMounted...", auth0.state.user?.token, auth0.state.user?.data?.email)
      if (auth0.state.user?.token && auth0.state.user?.data?.email) {
        console.log("re run =======>", auth0.state.user?.token)
        state.subs = auth0.state.user?.data?.subs
        state.username = auth0.state.user?.data?.nickname
        state.id = auth0.state.user?.data?.id
        state.email = auth0.state.user?.data?.email
        prods.items.map( yo => {
          if (state.subs?.findIndex(sub => (sub.code == yo.code)) > -1) {
            yo.status = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].status
            yo.qty = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].qty
            yo.key = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].key
            yo.secret = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].secret
            yo.email_notif = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].email_notif
            yo.autoset = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].autoset
            yo.sid = state.subs[state.subs?.findIndex(sub => (sub.code == yo.code))].sid
          }
          else {
            yo.status = 'ZISABLED'
            yo.qty = 0.005
            yo.key = ""
            yo.secret = ""
            yo.email_notif = false
            yo.autoset = true
            yo.sid = ""
          }
        })
        state.products = _.orderBy(prods.items, 'status', 'ASC')
        endStats(Date.now())
      }
    })

    const confirmCancelSubs = async (subscription) => {
      console.log("confirmCancelSubs", subscription)
      subscription.confirm = true
    }

    const confirmSubscribe = async (subscription) => {
      console.log("confirmSubscribe", subscription)
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
        const index = state.products?.findIndex( sub => (sub.code === subscription.code) )
        if (index > -1) state.products?.splice(index, 1)
      })
      .catch( (error) => {
        subscription.confirm = false
        console.log("ERROR cancelSubs:", error)
        state.cancel_sub_result = "error"
        const index = state.products?.findIndex( sub => (sub.code === subscription.code) )
        if (index > -1) state.products?.splice(index, 1)
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

    const changeAutoSet = async (sub) => {
      console.log("changeAutoSet", sub.autoset)
      await axios.put('/api/setautoset?sub=' + auth0.state.user?.sub + '&cid=' + auth0.state.user?.data?.id,
        { 
          autoset:sub.autoset, 
          sid:sub.sid, 
        },
        { headers: {Authorization:`Bearer ${auth0.state.user.token}`} }
      )
      .then( (response) => {
        console.log("changeAutoSet.response.data:", response.data)
        if (response.data.msg == 'success') {
        }
        else {
          console.log("---->", response.data.err)
        }
      })
      .catch( (error) => {
        console.log("ERROR changeAutoSet", error)
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
        { key: subscription.key, secret: subscription.secret, code: subscription.sid, email: auth0.state?.user?.email },
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
      //console.log("saveQty", JSON.stringify(subscription))
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
      sub.confirm = false
      sub.status = 'PAUSED'
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
      savePass,
      saveUser,
      saveStratKey,
      confirmCancelSubs,
      cancelSubs,
      confirmPasswd,
      confirmUsername,
      resetInput,
      saveQty,
      changeStatus,
      changeNotif,
      changeAutoSet,
      subscribe,
      confirmSubscribe
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