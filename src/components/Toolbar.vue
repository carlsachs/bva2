<template>
  <div class="flex flex-row items-center justify-center p-2 space-x-5">
    <!--DarkModeToggle /-->
    <!--router-link to="/">
      <button class="border-2 border-yellow-600 rounded-lg px-3 py-2 text-yellow-400 cursor-pointer hover:bg-yellow-600 hover:text-yellow-200" type="button">
        HOME
      </button>
    </router-link>
    <router-link to="/profile">
      <button class="button" type="button">
        PROFILE
      </button>
    </router-link-->
    <button v-if="auth0.state.isLoading" class="button" type="button">
      Loading
      <feather-loader class="ml-2" />
    </button>
    <div v-else>
      <button
        v-if="auth0.state.isAuthenticated"
        class="button"
        type="button"
        @click="logout"
      >
        Sign Out
        <feather-log-out class="ml-2" />
      </button>
      <button v-else class="button" type="button" @click="login">
        Sign In <feather-log-in class="ml-2" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { inject, reactive } from "vue"

const auth0: any = inject("auth0")
const state = reactive({ auth0 })

function login() {
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#loginwithredirect
  console.log("-0-0-0-0-0-0-0-", window.location.href)
  auth0.client.loginWithRedirect({ appState: { targetUrl: window.location.href } })
}
function logout() {
  // https://auth0.github.io/auth0-spa-js/interfaces/logoutoptions.html
  auth0.client.logout({ returnTo: window.location.origin })
}

</script>

<style lang="postcss" scoped>
.button {
  @apply text-blue-400 cursor-pointer border-2 border-blue-600 hover:bg-blue-600 hover:text-blue-200 px-4 py-2 rounded-lg flex flex-row items-center;
}
</style>