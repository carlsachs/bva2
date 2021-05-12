<template>
  <div class="flex flex-row items-center justify-center p-2 space-x-5 mb-5">
    <!--DarkModeToggle /-->
    <router-link v-if="!isHomePage" to="/">
      <button class="orange_button" type="button">
        Home
      </button>
    </router-link>
    <!--p class="text-white">{{ router.currentRoute._rawValue.path }}</p-->
    <router-link v-if="auth0.state.isAuthenticated" to="/profile">
      <button class="green_button" type="button">
        Profile
      </button>
    </router-link>
    <button v-if="auth0.state.isLoading" class="blue_button" type="button">
      Loading <feather-loader class="ml-2" />
    </button>
    <div v-else>
      <button v-if="auth0.state.isAuthenticated" class="blue_button" type="button" @click="logout">
        Sign out <feather-log-out class="ml-2" />
      </button>
      <button v-else class="blue_button" type="button" @click="login">
        Sign in <feather-log-in class="ml-2" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router'
import { inject, reactive, toRef } from "vue"

const auth0: any = inject("auth0")

const router = useRouter()

const state = reactive({ auth0, isHomePage:(router.currentRoute._rawValue.path==='/') })

const isHomePage = toRef(state, "isHomePage");

router.beforeEach( (to, from) => {
  if (to.name == 'index') { isHomePage.value = true }
  else { isHomePage.value = false }
})

function login() {
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#loginwithredirect
  console.log("-0-0-0-0-0-0-0-", window.location.href)
  //auth0.client.loginWithRedirect({ appState: { targetUrl: window.location.href } })
  auth0.client.loginWithRedirect({ appState: { targetUrl: '/profile' } })
}

function logout() {
  // https://auth0.github.io/auth0-spa-js/interfaces/logoutoptions.html
  auth0.client.logout({ returnTo: window.location.origin })
}

</script>

<style lang="postcss" scoped>
.blue_button {
  @apply text-blue-400 cursor-pointer border-2 border-blue-600 hover:bg-blue-600 hover:text-blue-200 px-3 py-2 rounded-lg flex flex-row items-center;
}
.green_button {
  @apply border-2 border-green-600 rounded-lg px-3 py-2 text-green-400 cursor-pointer hover:bg-green-600 hover:text-green-200 flex flex-row items-center;
}
.orange_button {
  @apply border-2 border-yellow-600 rounded-lg px-3 py-2 text-yellow-400 cursor-pointer hover:bg-yellow-600 hover:text-yellow-200 flex flex-row items-center;
}
</style>