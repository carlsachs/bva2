import { reactive, App, watchEffect } from 'vue'
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js'
import axios from "../utils/axios"

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string
const client_id = import.meta.env.VITE_AUTH0_CLIENT_ID as string

let clientInit: null|Promise<Auth0Client> = null

export const $auth0 = reactive({
  client: null,
  state: {
    isLoading: true,
    isAuthenticated: false,
    error: null,
    user: null
  }
} as $Auth0Defaults)

export async function setupAuth0(router) {
  $auth0.client = await setupClient()
  const search = window.location.search
  const comingFromRedirect = search.includes('code=') && search.includes('state=')
  console.log("Logged In")
  try {
    // If the user is returning to the app after auth success with Auth0.
    if (comingFromRedirect) {
      // handle the redirect and retrieve tokens
      const { appState } = await $auth0.client.handleRedirectCallback()
      //console.log("XXXXXXXXXXXX", JSON.stringify(appState))
      onRedirectCallback(appState, router)
    }
    //console.log("======-...======")
  } catch (e) {
    //console.log("======---======")
    $auth0.state.error = e
    router.replace("/")
  } finally {
    //console.log("======+++======1")
    $auth0.state.isAuthenticated = await $auth0.client.isAuthenticated()
    //console.log("======+++======2", $auth0.state.isAuthenticated)
    $auth0.state.user = await $auth0.client.getUser()
    //console.log("======+++======3", JSON.stringify($auth0.state.user))
    $auth0.state.isLoading = false
    //console.log("this.user :: ", $auth0.state.user)
    //console.log("======000======")
    if ($auth0.state.user) {
      $auth0.state.user.token = await $auth0.client.getTokenSilently()
      //console.log("======+++======4", $auth0.state.user.token)
      //console.log(JSON.stringify($auth0.state.user))
      const user_data = await signInUser($auth0.state.user.token, $auth0.state.user.email)
      //console.log("USER DATA", user_data)
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
          //============================================//
          console.log("GET USER TRADES")
          axios.get('/api/traded?id='+$auth0.state.user['user_data'].id)
          .then( (response) => {
            $auth0.state.user['trades'] = response.data
          })
          .catch( (e) => {
            console.log("Get User Trades ERROR", e)
            $auth0.state.user['trades'] = []
          })
          //============================================//
        })
        .catch( (e) => {
          console.log("getusersubs ERROR", e)
          $auth0.state.user['user_subs'] = []
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

export const install = ({ app }: { app: App }) => {
  app.use({
    install(app: App, options: any) {
      app.config.globalProperties.$auth0 = $auth0
      app.provide('auth0', $auth0)
    }
  })
}

interface $Auth0Defaults {
  client: Auth0Client | null
  state: {
    isLoading: boolean
    isAuthenticated: boolean
    error: Error | null
    user: any | null
  }
}

///////// ///////// ///////// ///////// ///////// /////////

async function signInUser(token: String, email: String) {
  //console.log("signInUser", token, email)
  return axios
    .get('/api/getusersignin?email=' + email, { headers: {Authorization:`Bearer ${token}`} })
    .then( (response) => {
      //console.log("signInUser ID result ::: ", response.data.id)
      return response.data
    })
    .catch( (e) => {
      console.log("signInUser ERROR", e)
      return 0
    })
}

///////// ///////// ///////// ///////// ///////// /////////

export function updateUsername(nickname: String) {
  console.log("updateUsername", nickname)
  $auth0.state.user['user_data']['nickname'] = nickname
}

///////// ///////// ///////// ///////// ///////// /////////
/*
export const authGuard = (to, from, next) => {
  console.log("authGuard")
  const verify = () => {
    if ($auth0.state.isAuthenticated) {
      console.log("isAuthenticated!!")
      return next()
    }
    console.log("...")
    if ($auth0.client) {
      console.log("loginWithRedirect")
      $auth0.client.loginWithRedirect({ appState: { targetUrl: to.fullPath } })
    }
    else {
      console.log("auth0.client not set")
      return next()
    }
  }
  if (!$auth0.state.loading) {
    console.log("Verify...")
    return verify()
  }
  watchEffect( () => {
    console.log("watchEffect...")
    if (!$auth0.state.loading) {
      console.log("watchEffect verify...")
      return verify()
    }
  })
}
*/