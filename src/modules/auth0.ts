import { reactive, App, watchEffect } from 'vue'
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js'
import axios from "../utils/axios"

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string
const client_id = import.meta.env.VITE_AUTH0_CLIENT_ID as string

let clientInit: null|Promise<Auth0Client> = null

///////// ///////// ///////// ///////// ///////// /////////

interface $Auth0Defaults {
  client: Auth0Client | null
  state: {
    isLoading: boolean
    isAuthenticated: boolean
    error: Error | null
    user: any | null
  }
}

export const $auth0 = reactive({
  client: null,
  state: {
    isLoading: true,
    isAuthenticated: false,
    error: null,
    user: null
  }
} as $Auth0Defaults)

export const install = ({ app }: { app: App }) => {
  app.use({
    install(app: App, options: any) {
      app.config.globalProperties.$auth0 = $auth0
      app.provide('auth0', $auth0)
    }
  })
}

///////// ///////// ///////// ///////// ///////// /////////

export async function setupAuth0(router: any) {
  $auth0.client = await setupClient()
  const search = window.location.search
  const comingFromRedirect = search.includes('code=') && search.includes('state=')
  console.log("Logged In")
  try {
    if (comingFromRedirect) {
      const { appState } = await $auth0.client.handleRedirectCallback()
      onRedirectCallback(appState, router)
    }
  } catch (e) {
    $auth0.state.error = e
    router.replace("/")
  } finally {
    $auth0.state.isAuthenticated = await $auth0.client.isAuthenticated()
    $auth0.state.user = await $auth0.client.getUser()
    $auth0.state.isLoading = false
    if ($auth0.state.user) {
      $auth0.state.user.token = await $auth0.client.getTokenSilently()
      const user_data = await signInUser($auth0.state.user.token, $auth0.state.user.email)
      if (!user_data) {
        $auth0.state.user = null
        console.log("USER UNKNOWN")
      }
      else {
        $auth0.state.user['user_data'] = user_data
        console.log("WELCOME USER", $auth0.state.user['user_data'].id )
        ////// ///// ///// ////// //////
        console.log("GET USER SUBS")
        axios.get('/api/getusersubs?email=' + $auth0.state.user.email, { headers: {Authorization:`Bearer ${$auth0.state.user.token}`} })
        .then( (response) => {
          $auth0.state.user['user_subs'] = response.data
        })
        .catch( (e) => {
          console.log("getusersubs ERROR", e)
          $auth0.state.user['user_subs'] = []
        })
        ////// ///// ///// ////// //////
        console.log("GET USER TRADES")
        axios.get('/api/trades?email=' + $auth0.state.user.email + '&id='+$auth0.state.user['user_data'].id, { headers: {Authorization:`Bearer ${$auth0.state.user.token}`} })
        .then( (response) => {
          $auth0.state.user['trades'] = response.data
        })
        .catch( (e) => {
          console.log("Get User Trades ERROR", e)
          $auth0.state.user['trades'] = []
        })
        ////// ///// ///// ////// //////
      }
    }
  }
}

function onRedirectCallback(appState, router) {
  router.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  )
}

function setupClient(): Promise<Auth0Client> {
  if (!clientInit) {
    clientInit = createAuth0Client({
      domain,
      client_id,
      redirect_uri: window.location.origin
      // audience: options.audience
    })
  }
  return clientInit
}

async function signInUser(token: String, email: String) {
  return axios
    .get('/api/getusersignin?email=' + email, { headers: {Authorization:`Bearer ${token}`} })
    .then( (response) => {
      return response.data
    })
    .catch( (e) => {
      console.log("signInUser ERROR", e)
      return 0
    })
}

export function updateUsername(nickname: String) {
  console.log("updateUsername", nickname)
  $auth0.state.user['user_data']['nickname'] = nickname
}

///////// ///////// ///////// ///////// ///////// /////////
