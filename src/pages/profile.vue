<template>
  <div v-if="auth0.state.isAuthenticated" class="text-center bg-black text-gray-300 p-4">
    <h1 class="text-green-500 text-3xl mt-3">Account</h1>
    <br><br>
    <Stripe />
    <br><br>
    <span>{{ auth0.state.user }}</span>
    <div class="py-4">
      <input
        id="input"
        v-model="form.password"
        placeholder="password"
        aria-label="password"
        type="text"
        autocomplete="false"
        class="px-4 py-2 text-sm text-center bg-transparent border rounded outline-none active:outline-none border-gray-700"
        style="width: 250px"
        @keydown.enter="savePass"
      >
      <button class="m-3 text-sm btn" :disabled="!form.password" @click="savePass">Submit</button>
      <span>{{ form.result }}</span>
    </div>
  </div>
</template>

<script lang="ts">

import { inject, reactive, ref, toRefs } from 'vue'
import axios from 'axios'

export default {
  setup() {

    const auth0: any = inject("auth0")
    const state = reactive({ auth0 })

    const form = reactive({
      password: '',
      result: '',
    })

    const api_url = import.meta.env.VITE_API_URL

    const savePass = async () => {
      console.log("PASSWORD", form.password)
      console.log(JSON.stringify(auth0.state.user) )
      console.log("USERID!!!!!!", JSON.stringify(auth0.state.user.userid) )
      console.log("Authorization!!!!!!", JSON.stringify(auth0.state.user.token) )
      console.log("api_url", api_url)
      await axios.put(
        api_url + '/api/pwduser?uid=' + auth0.state.user.sub + '&cid=' + auth0.state.user.userid,
        { password: form.password },
        { headers: { Authorization: `${auth0.state.user.token}` } }
      )
      .then( (response) => {
        console.log("saveInfo.response.data:", response.data)
        if (response.data.msg == 'success') {
          form.password = ''
          form.result = response.data.msg
        }
        else {
          form.result = "Error 2"
        }
      })
      .catch( (error) => {
        console.log("ERROR pwduser", error)
        form.result = "Error 1"
      })
    }
    
    return {
      ...toRefs(state),
      savePass,
      form
    }

  },
}
</script>

<style scoped>
</style>

<route lang="yaml">
meta:
  layout: default
</route>