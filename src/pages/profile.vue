<template>
  <div v-if="auth0.state.isAuthenticated && auth0.state.user" class="text-center bg-black text-gray-300 p-4">
    <h1 class="text-green-500 text-3xl mt-3">Account</h1>
    <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative">
      <span>{{ auth0.state.user.user_data }}</span>
    </div>
    <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative">
      <Stripe 
        :customerEmail="auth0.state.user.email" 
        lineItems="[{ price: 'price_1IqheJ4v5ia3fxwPKEJMLptX', quantity: 1 }]" 
        description="BVA"
        price="49.90"
      />
      <Stripe 
        :customerEmail="auth0.state.user.email" 
        lineItems="[{ price: 'price_1IqheJ4v5ia3fxwPKEJMLptX', quantity: 1 }]" 
        description="BVA LONG ONLY"
        price="29.90"
      />
    </div>
    <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative flex-auto">
      <div class="my-3">Your Binance API Key Information: &nbsp;</div>
      <input
        id="key"
        v-model="form.key"
        placeholder="your api key"
        aria-label="key"
        type="text"
        autocomplete="false"
        class="my-3 px-4 py-2 text-sm text-center bg-transparent border rounded outline-none active:outline-none border-gray-700"
      >&nbsp;
      <input
        id="secret"
        v-model="form.secret"
        placeholder="your api secret"
        aria-label="secret"
        type="text"
        autocomplete="false"
        class="my-3 px-4 py-2 text-sm text-center bg-transparent border rounded outline-none active:outline-none border-gray-700"
      >&nbsp;
      <button class="dark_button" :disabled="!form.secret&&!form.key" @click="saveUserKey">Submit</button>
      &nbsp;
      <span>{{ form.key_result }}</span>
    </div>
    <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative flex-auto">
      <div class="my-3">Change your username: &nbsp;</div>
      <input
        id="username"
        v-model="form.username"
        placeholder="your username"
        aria-label="username"
        type="text"
        autocomplete="false"
        class="my-3 px-4 py-2 text-sm text-center bg-transparent border rounded outline-none active:outline-none border-gray-700"
        @keydown.enter="saveUser"
      >&nbsp;
      <button class="dark_button" :disabled="!form.username" @click="saveUser">Submit</button>
      &nbsp;
      <span>{{ form.user_result }}</span>
    </div>
    <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative flex-auto">
      <div class="my-3">Change your password: &nbsp;</div>
      <input
        id="password"
        v-model="form.password"
        placeholder="your new password"
        aria-label="password"
        type="text"
        autocomplete="false"
        class="my-3 px-4 py-2 text-sm text-center bg-transparent border rounded outline-none active:outline-none border-gray-700"
        @keydown.enter="savePass"
      >&nbsp;
      <button class="dark_button" :disabled="!form.password" @click="savePass">Submit</button>
      &nbsp;
      <span>{{ form.pwd_result }}</span>
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
    const state = reactive({ auth0 })

    const form = reactive({
      key: auth0.state.user?.user_data?.cle,
      secret: auth0.state.user?.user_data?.cles,
      key_result: '',
      username: auth0.state.user?.user_data?.nickname,
      user_result: '',
      password: '',
      pwd_result: '',
    })

    watch( () =>  auth0.state.user?.user_data, (user) => {
      form.username = user.nickname
      form.key = user.cle
      form.secret = user.cles
    })

    const api_url = import.meta.env.VITE_API_URL

    const savePass = async () => {
      console.log("PASSWORD", form.password)
      console.log(JSON.stringify(auth0.state.user) )
      console.log("USERID!!!!!!", JSON.stringify(auth0.state.user.userid) )
      console.log("Authorization!!!!!!", JSON.stringify(auth0.state.user.token) )
      console.log("api_url", api_url)
      await axios.put(
        api_url + '/api/pwduser?sub=' + auth0.state.user.sub + '&cid=' + auth0.state.user.user_data.id,
        { password: form.password },
        { headers: { Authorization: `${auth0.state.user.token}` } }
      )
      .then( (response) => {
        console.log("savePwd.response.data:", response.data)
        if (response.data.msg == 'success') {
          form.password = ''
          form.pwd_result = response.data.msg
        }
        else {
          form.pwd_result = "error"
        }
      })
      .catch( (error) => {
        console.log("ERROR pwduser", error)
        form.pwd_result = "error"
      })
    }

    const saveUser = async () => {
      console.log("USERNAME", form.username)
      await axios.put(
        api_url + '/api/setusername?sub=' + auth0.state.user.sub + '&cid=' + auth0.state.user.user_data.id,
        { username: form.username },
        { headers: { Authorization: `${auth0.state.user.token}` } }
      )
      .then( (response) => {
        console.log("saveUser.response.data:", response.data)
        if (response.data.msg == 'success') {
          form.user_result = response.data.msg
          updateUsername(form.username)
        }
        else {
          form.user_result = "error"
        }
      })
      .catch( (error) => {
        console.log("ERROR pwduser", error)
        form.user_result = "error"
      })
    }

    const saveUserKey = async () => {
      console.log("saveUserKey", form.key, form.secret )
      await axios.put(
        api_url + '/api/setuserkey?sub=' + auth0.state.user.sub + '&cid=' + auth0.state.user.user_data.id,
        { key: form.key, secret: form.secret },
        { headers: { Authorization: `${auth0.state.user.token}` } }
      )
      .then( (response) => {
        console.log("saveUserKey.response.data:", response.data)
        if (response.data.msg == 'success') {
          form.key_result = response.data.msg
        }
        else {
          form.key_result = "error"
        }
      })
      .catch( (error) => {
        console.log("ERROR pwduser", error)
        form.key_result = "error"
      })
    }
    
    return {
      ...toRefs(state),
      savePass,
      saveUser,
      saveUserKey,
      form
    }

  },
}
</script>

<style scoped>
.red_button {
  @apply my-3 border-1 border-red-600 rounded-lg py-1 px-3 text-red-400 cursor-pointer hover:bg-red-600 hover:text-red-200;
}
.dark_button {
  @apply my-3 border-1 border-gray-800 rounded-lg py-1 px-3 text-gray-400 cursor-pointer hover:bg-gray-800 hover:text-gray-200;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>