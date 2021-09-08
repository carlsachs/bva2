<template>
  <div class="flex-auto items-center justify-center p-2 space-x-5 mb-5">
    <!--DarkModeToggle /-->
    <button v-if="!isHomePage" class="dark_button" type="button" @click="$router.go(-1)">
      <feather-chevron-left class="" />
    </button>
    <router-link to="/signals">
      <button class="blue_button" type="button">
        Signal Firehose
      </button>
    </router-link>
    <router-link v-if="!isSubPage && auth0.state.isAuthenticated" to="/subscriptions">
      <button class="green_button" type="button">
        Your Subscriptions
      </button>
    </router-link>
    <router-link v-if="!isTradePage && auth0.state.isAuthenticated" to="/trades">
      <button class="green_button" type="button">
        Your Trades
      </button>
    </router-link>
    <router-link to="/topstrats">
      <button class="blue_button" type="button">
        Top Strats
      </button>
    </router-link>
    <button v-if="auth0.state.isLoading" class="blue_button" type="button">
      Loading <feather-loader class="ml-2" />
    </button>
    <button v-if="!auth0.state.isLoading && auth0.state.isAuthenticated" class="dark_button" type="button" @click="logout">
      <feather-log-out class="" />
    </button>
    <button v-if="!auth0.state.isLoading && !auth0.state.isAuthenticated" class="blue_button" type="button" @click="login">
      Sign In<feather-log-in class="pt-2" />
    </button>
  </div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router'
import { inject, reactive, toRef } from "vue"

const auth0: any = inject("auth0")

const router = useRouter()

const state = reactive({ 
  auth0, 
  isHomePage:(router.currentRoute._rawValue.path==='/'),
  isSubPage:(router.currentRoute._rawValue.path==='/subscriptions'),
  isTradePage:(router.currentRoute._rawValue.path==='/trades'),
})

const isHomePage = toRef(state, "isHomePage");
const isSubPage = toRef(state, "isSubPage");
const isTradePage = toRef(state, "isTradePage");

router.beforeEach( (to, from) => {
  if (to.name == 'index') { isHomePage.value = true }
  else { isHomePage.value = false }
  if (to.name == 'subscriptions') { isSubPage.value = true }
  else { isSubPage.value = false }
  if (to.name == 'trades') { isTradePage.value = true }
  else { isTradePage.value = false }
})

async function login() {
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#loginwithredirect
  console.log("-0-0-0-0-0-0-", window.location.href)
  //auth0.client.loginWithRedirect({ appState: { targetUrl: window.location.href } })
  await auth0.client.loginWithRedirect({ appState: { targetUrl: '/subscriptions' }, screen_hint: 'signup' })
  //await auth0.client.loginWithPopup()
  //console.log("-1-1-1-1-1-1-", await auth0.client.getUser() )
}

function logout() {
  // https://auth0.github.io/auth0-spa-js/interfaces/logoutoptions.html
  auth0.client.logout({ returnTo: window.location.origin })
}

</script>

<style lang="postcss" scoped>
.blue_button {
  @apply text-blue-400 cursor-pointer border-2 border-blue-600 hover:bg-blue-600 hover:text-blue-200 px-3 py-2 my-2 rounded-lg;
}
.green_button {
  @apply border-2 border-green-600 rounded-lg px-3 py-2 my-2 text-green-400 cursor-pointer hover:bg-green-600 hover:text-green-200;
}
.orange_button {
  @apply border-2 border-yellow-600 rounded-lg px-3 py-2 my-2 text-yellow-400 cursor-pointer hover:bg-yellow-600 hover:text-yellow-200;
}
.red_button {
  @apply border-2 border-red-600 rounded-lg px-3 py-2 my-2 text-red-400 cursor-pointer hover:bg-red-600 hover:text-red-200;
}
.dark_button {
  @apply border-2 border-gray-800 rounded-lg px-3 py-2 my-2 text-gray-400 cursor-pointer hover:bg-gray-800 hover:text-gray-200;
}
</style>