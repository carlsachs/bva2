<template>
  <div v-if="auth0.state.isAuthenticated && auth0.state.user" class="text-center text-gray-300">

    <div class="mx-2 my-14 py-4 border-2 border-blue-900 rounded-lg text-white relative">

      <h1 class="mb-7 text-uppercase font-semibold">Your Trades</h1>

      <button class="dark_button" @click="myTest()">MY TEST</button>

      <apexchart ref="mychart" type="area" height="400" :options="chartOptions" :series="series"></apexchart>
      
      <div class="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-5 uppercase">
          <div class="flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
              <div class="flex-auto">Period PnL *</div>
              <div class="flex-auto text-justify text-blue-300 block">{{ total_pnl }}%</div>
          </div>

          <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
              <div class="flex-auto">Trades Count</div>
              <div class="flex-auto text-justify text-blue-300 block">{{ total_signals }}</div>
          </div>

          <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
              <div class="flex-auto">Avg. Profit per Trade</div>
              <div class="flex-auto text-justify text-blue-300 block">{{ avg_pnl }}%</div>
          </div>

          <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
              <div class="flex-auto">Win Rate</div>
              <div class="flex-auto text-justify text-blue-300 block">{{ win_rate }}%</div>
          </div>

          <div class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
              <div class="flex-auto">Verif. Trade History</div>
              <div class="flex-auto text-justify text-blue-300 block">{{ strat_lifetime }} days</div>
          </div>

          <router-link to="/profile" class="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
              <div class="flex-auto text-green-500 font-semibold">Subscribe</div>
          </router-link>
      </div>
      
      <div class="mt-5 italic">* PNL calculated using 1/15 of the whole BTC amount for each trade.</div>

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
                                          <div class="text-center">BUY PRICE</div>
                                      </th>
                                      <th class="px-6 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                          <div class="text-center">SELL PRICE</div>
                                      </th>
                                  </tr>
                              </thead>
                              <tbody class="divide-y divide-gray-200 cursor-pointer" v-for="(row, i) in rows" :key="row.id" v-on:click="openSignal(row)">
                                  <tr>
                                      <td v-if="row.type === 'LONG'" :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                          {{ row.pnl ? moment(Number(row.sell_time)).fromNow() : moment(Number(row.updated_time)).fromNow() }}
                                      </td>
                                      <td v-else :class="{ 'italic': !row.pnl }" class="text-gray-400 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                          {{ row.pnl ? moment(Number(row.buy_time)).fromNow() : moment(Number(row.updated_time)).fromNow() }}
                                      </td>
                                      <td class="px-6 py-4 text-gray-300 font-bold whitespace-no-wrap text-sm leading-5">
                                          {{ row.pair }}
                                      </td>
                                      <td v-if="row.pnl" :class="{ 'text-green-500': Number(row.pnl)>0, 'text-red-500': Number(row.pnl)<0 }" class="px-6 py-4 font-bold whitespace-no-wrap text-sm leading-5">
                                          {{ Number(row.pnl).toFixed(2) }}%
                                      </td>
                                      <td v-else class="italic px-6 py-4 text-gray-400 whitespace-no-wrap text-sm leading-5">
                                          {{ getCurrentPnL(row.pair, Number(row.sell_price), Number(row.buy_price)) }}%
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
                                          {{ row.type }}
                                      </td>
                                      <td v-else class="text-blue-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                          {{ row.type }}
                                      </td>
                                      <td class="text-green-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                          {{ row.buy_price ? row.buy_price : '---' }}
                                      </td>
                                      <td class="text-red-500 px-6 py-4 whitespace-no-wrap text-sm leading-5">
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

    <div v-for="(subscription, i) in subscriptions" :class="{ 'bg-indigo-900 bg-opacity-20': subscribed.includes(subscription.code) }" :key="subscription.code" class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative">
      <div class="text-xl">{{ subscription.name }} Strategy</div>
      <hr class="w-5 mx-auto border-blue-400 my-8">
      <button v-if="isLoading" class="blue_button" type="button">
        Loading <feather-loader class="ml-2" />
      </button>
      <div v-else>
        <div class="mt-9" v-if="subscribed.includes(subscription.code)">
          <div class="flex items-center justify-center">
            <label for="toogleA" class="flex items-center cursor-pointer">
              <div class="relative">
                <input id="toogleA" type="checkbox" class="sr-only" />
                <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
              </div>
              <div class="ml-3 text-gray-500 font-medium">
                Paused
              </div>
            </label>
          </div>
          <div class="mt-10 text-gray-200 text-center">BTC amount to trade: &nbsp;</div>
          <div>
            <input
              id="amount" size="50" v-model="subscription.qty" placeholder="" aria-label="btc qty" type="number" autocomplete="false"
              class="my-3 px-4 py-2 text-sm text-center bg-gray-900 border rounded outline-none active:outline-none border-blue-900"
            >&nbsp;
            <button class="dark_button" :disabled="!subscription.qty">Save</button>
          </div>
          <hr class="w-5 mx-auto border-blue-400 my-8">
          <button class="dark_button" @click="cancelSubs(subscription.code)">Cancel your {{ subscription.name }} subscription</button>
        </div>
        <div v-else>
          <Stripe
            :customerEmail="auth0.state.user.email" 
            :stripeId="subscription.stripe_id"
            :description="subscription.name"
            :price="subscription.price"
          />
        </div>
      </div>
      <div v-if="cancel_sub_result">{{ cancel_sub_result }}</div>
    </div>


    <section ref="myEl">
      <div :class="{ 'bg-indigo-900 bg-opacity-20': true }" class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative flex-auto">
        <div class="my-3">Your Binance API Key Information: &nbsp;</div>
        <input
          id="key"
          v-model="key"
          placeholder="your api key"
          aria-label="key"
          type="text"
          autocomplete="false"
          class="my-3 px-4 py-2 text-sm text-center bg-gray-900 border rounded outline-none active:outline-none border-gray-700"
        >&nbsp;
        <input
          id="secret"
          v-model="secret"
          placeholder="your api secret"
          aria-label="secret"
          type="text"
          autocomplete="false"
          class="my-3 px-4 py-2 text-sm text-center bg-gray-900 border rounded outline-none active:outline-none border-gray-700"
        >&nbsp;
        <button class="dark_button" :disabled="!secret&&!key" @click="saveUserKey">Save</button>
        &nbsp;
        <span>{{ key_result }}</span>
      </div>
    </section>


    <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative flex-auto">
      <div class="my-3">Change your username: &nbsp;</div>
      <input
        id="username"
        v-model="username"
        placeholder="your username"
        aria-label="username"
        type="text"
        autocomplete="false"
        class="my-3 px-4 py-2 text-sm text-center bg-transparent border rounded outline-none active:outline-none border-gray-700"
        @keydown.enter="saveUser"
      >&nbsp;
      <button class="dark_button" :disabled="!username" @click="saveUser">Save</button>
      &nbsp;
      <span>{{ user_result }}</span>
    </div>


    <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative flex-auto">
      <div class="my-3">Change your password: &nbsp;</div>
      <input
        id="password"
        v-model="password"
        placeholder="your new password"
        aria-label="password"
        type="text"
        autocomplete="false"
        class="my-3 px-4 py-2 text-sm text-center bg-transparent border rounded outline-none active:outline-none border-gray-700"
        @keydown.enter="savePass"
      >&nbsp;
      <button class="dark_button" :disabled="!password" @click="savePass">Save</button>
      &nbsp;
      <span>{{ pwd_result }}</span>
    </div>


    <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative">
      <span>{{ auth0.state.user.user_data }}</span>
      <br/><br/>
      <span>{{ subscribed }}</span>
      <br/><br/>
      <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
        <span class="modal__title">Hello, vue-final-modal</span>
      </vue-final-modal>
      <button @click="showModal = true">Open Modal</button><br/>
      <br/>
    </div>


  </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent, watch, inject } from 'vue'
import axios from 'axios'
import { updateUsername } from '~/modules/auth0'
import { useRouter } from "vue-router"
import _ from "lodash"
import moment from "moment"

export default {
  setup() {

    const mychart = ref(null)
    const myEl = ref(null)

    const smoothScroll = inject('smoothScroll')

    const router = useRouter()

    const openSignal = (row) => {
        router.push("/signal/"+ row.id)
    }

    const auth0: any = inject("auth0")

    const subscriptions = [
      { 
        name: 'BVA',
        code: 'bva_subs',
        stripe_id: 'price_1IqheJ4v5ia3fxwPKEJMLptX',
        price: 4.90,
      },
      { 
        name: 'BVA Long Only',
        code: 'bva_long_only_subs',
        stripe_id: 'price_1IsYQc4v5ia3fxwPD4j8g01f',
        price: 5.55,
      }
    ]

    const state = reactive({ 
      auth0, 
      isLoading: true,
      subscriptions,
      subscribed: [],
      key: auth0.state.user?.user_data?.cle,
      secret: auth0.state.user?.user_data?.cles,
      cancel_sub_result: '',
      key_result: '',
      username: auth0.state.user?.user_data?.nickname,
      user_result: '',
      password: '',
      pwd_result: '',
      searchEnabled: true,
      showModal: false,
      ///////// ///////// ///////// /////////
      strat_id: 466,
      stratname: 'Your Trades',
      total_pnl: 0,
      avg_pnl: 0,
      strat_lifetime: 0,
      total_signals: 0,
      win_rate: 0,
      user: null,
      rows: [],
      prices: [],
      ///////// ///////// ///////// /////////
      series: [
          {
              name: "Bitcoin",
              data: [],
          },
          {
              name: "You",
              data: [],
          }
      ],
      chartOptions: {
          chart: {
            id: "vuechart-example",
          },
          chart: {
              width: "100%",
              type: 'area',
              stacked: true,
          },
          colors: ['#00E396','#0080FB'],
          dataLabels: {
              enabled: false,
              enabledOnSeries: false,
          },
          legend: {
              show: true,
              showForSingleSeries: true,
              offsetY: 20,
              itemMargin: {
                  horizontal: 10,
                  vertical: 20
              },
              labels: {
                  colors: '#ffffff',
              },
          },
          fill: {
              type: 'gradient',
              gradient: {
                  opacityFrom: 0.6,
                  opacityTo: 0.8,
              }
          },
          stroke: { 
              curve: 'smooth',
              width: 2,
          },
          tooltip: {
              enabled: true,
              theme: 'dark',
          },
          xaxis: {
              type: "datetime",
              labels: {
                  show: true,
                  style: {
                      colors: '#FFFFFF',
                      fontSize: '12px',
                  },
              }
          },
          yaxis: {
              min: 0,
              forceNiceScale: true,
              labels: {
                  show: true,
                  style: {
                      colors: '#FFFFFF',
                      fontSize: '10px',
                  },
                  formatter: (value) => { return value+'%' },
              },
          }
      },
      ///////// ///////// ///////// /////////
    })

    watch( () =>  auth0.state.user?.user_data, (user) => {
      state.username = user.nickname
      state.key = user.cle
      state.secret = user.cles
    })

    watch( () =>  auth0.state.user?.user_subs, (subs) => {
      state.subscribed = subs
      state.isLoading = false
    })

    const api_url = import.meta.env.VITE_API_URL

    const savePass = async () => {
      console.log("PASSWORD", state.password)
      console.log(JSON.stringify(auth0.state.user) )
      //console.log("USERID!!!!!!", JSON.stringify(auth0.state.user.userid) )
      console.log("Authorization!!!!!!", JSON.stringify(auth0.state.user.token) )
      console.log("api_url", api_url)
      await axios.put(
        api_url + '/api/pwduser?sub=' + auth0.state.user.sub + '&cid=' + auth0.state.user.user_data.id,
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

    const saveUser = async () => {
      console.log("USERNAME", state.username)
      await axios.put(
        api_url + '/api/setusername?sub=' + auth0.state.user.sub + '&cid=' + auth0.state.user.user_data.id,
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
          state.user_result = "error"
        }
      })
      .catch( (error) => {
        console.log("ERROR pwduser", error)
        state.user_result = "error"
      })
    }

    const saveUserKey = async () => {
      console.log("saveUserKey", state.key, state.secret )
      await axios.put(
        api_url + '/api/setuserkey?sub=' + auth0.state.user.sub + '&cid=' + auth0.state.user.user_data.id,
        { key: state.key, secret: state.secret },
        { headers: {Authorization:`Bearer ${auth0.state.user.token}`} }
      )
      .then( (response) => {
        console.log("saveUserKey.response.data:", response.data)
        if (response.data.msg == 'success') {
          state.key_result = response.data.msg
        }
        else {
          state.key_result = "error"
        }
      })
      .catch( (error) => {
        console.log("ERROR pwduser", error)
        state.key_result = "error"
      })
    }

    const cancelSubs = async (code) => {
      console.log("cancelSubs", code )
      await axios.put(
        api_url + '/api/cancelsub?sub=' + auth0.state.user.sub + '&cid=' + auth0.state.user.user_data.id,
        { code: code },
        { headers: {Authorization:`Bearer ${auth0.state.user.token}`} }
      )
      .then( (response) => {
        console.log("cancelSubs result:", response.data)
        if (response.data.msg == 'success') {
          state.cancel_sub_result = response.data.msg
          //console.log("remove subs code", code)
          const index = state.subscribed.indexOf(code);
          if (index > -1) state.subscribed.splice(index, 1)
          //console.log(JSON.stringify(state.subscribed))
        }
        else {
          state.cancel_sub_result = "error"
        }
      })
      .catch( (error) => {
        console.log("ERROR cancelSubs:", error)
        state.cancel_sub_result = "error"
      })
    }

    const getCurrentPnL = (symbol, sell_price, buy_price) => {
        let pnl = 0
        if (state.prices.length) {
            const currentPrice = state.prices.find( (r) => { return r.symbol === symbol }).price
            if (currentPrice) {
                if (sell_price > 0) {
                    pnl = 100 * (sell_price - currentPrice) / currentPrice
                }
                else if (buy_price > 0) {
                    pnl = 100 * (currentPrice - buy_price) / buy_price
                }
            }
        }
        //console.log(symbol, pnl)
        return pnl.toFixed(2)
    }

    onMounted(() => {
        ////// ////// ////// ////// //////
        axios.get('https://api.binance.com/api/v3/ticker/price')
        .then( prices => {
          state.prices = prices.data
        })
        .catch((err) => {
          console.log(err)
        })
        ////// ////// ////// ////// //////
        axios.get(api_url + '/api/strategy?id='+state.strat_id)
        .then( rows => {

            let tpnl_btc = []
            let tpnl_bva = []
            let pnl_btc = 0
            let pnl_bva = 0

            //state.stratname = rows.data[0].stratname
            //state.series[1].name = rows.data[0].stratname
            state.strat_lifetime = parseInt((rows.data[0].updated_time - rows.data[rows.data.length-1].updated_time)/86400000)
            const days = 10 + state.strat_lifetime
            state.total_signals = rows.data.length
            
            state.rows = rows.data.slice(0, 10)

            axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit='+days)
            .then( btcs => {

                for ( var btc of btcs.data ) {
                    pnl_btc = 100 * (Number(btc[4]) - Number(btc[1])) / Number(btc[1]) + pnl_btc
                    tpnl_btc.push([ btc[0], pnl_btc.toFixed(2) ])
                    const sum = rows.data.filter( bva => { 
                        return Number(bva.updated_time) > btc[0] && Number(bva.updated_time) <= btc[6] 
                    })
                    pnl_bva = _.sumBy(sum, o => { return Number(o.pnl) }) / 15 + pnl_bva
                    tpnl_bva.push([ btc[0], pnl_bva.toFixed(2) ])
                }

                state.series[0].data = tpnl_btc
                state.series[1].data = tpnl_bva

                //console.log("TPNL:", tpnl_bva[tpnl_bva.length-1][1])
                state.total_pnl = tpnl_bva[tpnl_bva.length-1][1]
                //console.log("TOTAL:", rows.data.length)
                //console.log("TRADE MEAN:", _.meanBy(rows.data, o => {return Number(o.pnl)}).toFixed(2))
                state.avg_pnl = _.meanBy(rows.data, o => {return Number(o.pnl)}).toFixed(2)
                const positifs = rows.data.filter( bva => { return Number(bva.pnl) > 0 })
                //console.log("POS COUNT:", positifs.length)
                //console.log("WIN RATE:", (100 * positifs.length / rows.data.length).toFixed(2) )
                state.win_rate = (100 * positifs.length / rows.data.length).toFixed(2)

            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
        })
        ////// ////// ////// ////// //////
    })

    const myTest = () => {
      console.log("MMMMYYY TESSSTT")
      /*
      smoothScroll({
        scrollTo: myEl.value,
        hash: '#sampleHash',
        duration: 1000,
        offset: -30, 
        updateHistory: false,
      })
      */
    }

    watch( () => mychart.value, (value) => {
      setTimeout(function(){ value.toggleSeries('Bitcoin') }, 1000)
    })

    watch( () => myEl.value, (value) => {
      /*
      setTimeout(function(){ 
        smoothScroll({
          scrollTo: myEl.value,
          hash: '#sampleHash',
          duration: 1000,
          offset: -10, 
          updateHistory: false,
        })
      }, 1000)
      */
    })
    
    return {
      ...toRefs(state),
      moment,
      openSignal,
      getCurrentPnL,
      savePass,
      saveUser,
      saveUserKey,
      cancelSubs,
      myTest,
      mychart,
      myEl
    }

  },
}
</script>

<style scoped>

.dark_button {
  @apply border-2 px-3 py-2 border-blue-900 rounded-lg text-gray-400 cursor-pointer hover:bg-gray-800 hover:text-gray-200;
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