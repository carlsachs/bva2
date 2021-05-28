<template>
  <div v-if="auth0.state.isAuthenticated && auth0.state.user" class="text-center text-gray-300">

    <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative">
      <div v-for="(subscription, i) in subscriptions" :class="{ 'bg-indigo-900': subscribed.includes(subscription.code) }" :key="subscription.code" class="mx-4 my-4 p-4 bg-opacity-90 border-2 border-blue-900 rounded-lg text-white relative">
        <div class="text-xl">{{ subscription.name }} Strategy</div>
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
          <div class="mt-3 text-gray-400 text-center">BTC amount to trade: &nbsp;</div>
          <div>
            <input
              id="amount" size="50" v-model="subscription.qty" placeholder="" aria-label="btc qty" type="number" autocomplete="false"
              class="my-3 px-4 py-2 text-sm text-center bg-gray-900 border rounded outline-none active:outline-none border-blue-900"
            >&nbsp;
            <button class="dark_button" :disabled="!subscription.qty">Save</button>
          </div>
          <button class="mt-7 dark_button" @click="cancelSubs(subscription.code)">Cancel your {{ subscription.name }} subscription</button>
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
    

    <section id="apikey" ref="apikey">
      <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative flex-auto">
        <div class="my-3">Your Binance API Key Information: &nbsp;</div>
        <input
          id="key"
          v-model="key"
          placeholder="your api key"
          aria-label="key"
          type="text"
          autocomplete="false"
          class="my-3 px-4 py-2 text-sm text-center bg-transparent border rounded outline-none active:outline-none border-gray-700"
        >&nbsp;
        <input
          id="secret"
          v-model="secret"
          placeholder="your api secret"
          aria-label="secret"
          type="text"
          autocomplete="false"
          class="my-3 px-4 py-2 text-sm text-center bg-transparent border rounded outline-none active:outline-none border-gray-700"
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
      <a href="#apikey">GOTOTO</a>
    </div>


  </div>
</template>

<script lang="ts">

import { inject, reactive, ref, toRefs, watch } from 'vue'
import axios from 'axios'
import { updateUsername } from '~/modules/auth0'

export default {
  setup() {

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
    })

    watch( () =>  auth0.state.user?.user_data, (user) => {
      state.username = user.nickname
      state.key = user.cle
      state.secret = user.cles
    })

    watch( () =>  auth0.state.user?.user_subs, (subs) => {
      state.subscribed = subs
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
          const index = state.subscribed.indexOf(code);
          if (index > -1) state.subscribed.splice(index, 1)
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
    
    return {
      ...toRefs(state),
      savePass,
      saveUser,
      saveUserKey,
      cancelSubs,
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