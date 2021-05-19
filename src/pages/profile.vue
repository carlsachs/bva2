<template>
  <div v-if="auth0.state.isAuthenticated && auth0.state.user" class="text-center bg-black text-gray-300 p-4">
    <h1 class="text-green-500 text-3xl mt-3">Account</h1>
    <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative">
      <span>{{ auth0.state.user.user_data }}</span>
      <br/><br/>
      <button @click="showModal = true">Open Modal</button><br/>
    </div>
    <div class="mx-4 my-4 p-4 border-2 border-blue-900 rounded-lg text-white relative">

      <h1 class="text-xl mb-2">Your subscriptions</h1>

        <div v-if="form.bva_subs">
          <button class="dark_button" @click="cancelSubs('bva_subs')">Cancel your BVA subscription</button>
        </div>
        <Stripe v-else
            :customerEmail="auth0.state.user.email" 
            :lineItems="[{ 'price': 'price_1IqheJ4v5ia3fxwPKEJMLptX', 'quantity': 1 }]" 
            description="BVA"
            price="4.90"
        />

        <div v-if="form.bva_long_only_subs">
          <button class="dark_button" @click="cancelSubs('bva_long_only_subs')">Cancel your BVA LONG ONLY subscription</button>
        </div>
        <Stripe v-else
            :customerEmail="auth0.state.user.email" 
            :lineItems="[{ 'price': 'price_1IsYQc4v5ia3fxwPD4j8g01f', 'quantity': 1 }]"
            description="BVA LONG ONLY"
            price="5.90"
        />

        <span>{{ form.cancel_sub_result }}</span>

        <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
            <span class="modal__title">Hello, vue-final-modal</span>
        </vue-final-modal>

    </div>

    <section id="apikey" ref="apikey">
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
        <button class="dark_button" :disabled="!form.secret&&!form.key" @click="saveUserKey">Save</button>
        &nbsp;
        <span>{{ form.key_result }}</span>
      </div>
    </section>

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
      <button class="dark_button" :disabled="!form.username" @click="saveUser">Save</button>
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
      <button class="dark_button" :disabled="!form.password" @click="savePass">Save</button>
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

    const state = reactive({ 
      auth0, 
      showModal:false,
      apikey: null,
    })

    const form = reactive({
      key: auth0.state.user?.user_data?.cle,
      secret: auth0.state.user?.user_data?.cles,
      bva_subs: auth0.state.user?.user_data?.bva_subs,
      bva_long_only_subs: auth0.state.user?.user_data?.bva_long_only_subs,
      woltiks_subs: auth0.state.user?.user_data?.woltiks_subs,
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
      form.username = user.nickname
      form.key = user.cle
      form.secret = user.cles
      form.bva_subs = user.bva_subs
      form.bva_long_only_subs = user.bva_long_only_subs
      form.woltiks_subs = user.woltiks_subs
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

    const cancelSubs = async (subscription) => {
      console.log("cancelSubs", subscription, auth0.state.user.user_data[subscription] )
      await axios.put(
        api_url + '/api/cancelsub?sub=' + auth0.state.user.sub + '&cid=' + auth0.state.user.user_data.id,
        { subs: subscription, subs_id: auth0.state.user.user_data[subscription] },
        { headers: { Authorization: `${auth0.state.user.token}` } }
      )
      .then( (response) => {
        console.log("cancelSubs result:", response.data)
        if (response.data.msg == 'success') {
          form.cancel_sub_result = response.data.msg
          form[subscription] = null
        }
        else {
          form.cancel_sub_result = "error"
        }
      })
      .catch( (error) => {
        console.log("ERROR cancelSubs:", error)
        form.cancel_sub_result = "error"
      })
    }
    
    return {
      ...toRefs(state),
      savePass,
      saveUser,
      saveUserKey,
      cancelSubs,
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
  @apply my-1 border-2 px-3 py-2 border-gray-800 rounded-lg text-gray-400 cursor-pointer hover:bg-gray-800 hover:text-gray-200;
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
</style>

<route lang="yaml">
meta:
  layout: default
</route>