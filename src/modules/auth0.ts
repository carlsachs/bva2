import { reactive, App, watchEffect } from 'vue'
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js'
import axios from "axios"

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string
const client_id = import.meta.env.VITE_AUTH0_CLIENT_ID as string
const api_url = import.meta.env.VITE_API_URL as String

console.log("client_id", client_id)
console.log("domain", domain)

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
    //next()
  }

  if (!$auth0.state.loading) {
    return verify()
  }

  watchEffect( () => {
    console.log("watchEffect...")
    if (!$auth0.state.loading) {
      console.log("watchEffect verify")
      return verify()
    }
  })
  /*
  watchEffect(() => {
    if (!$auth0.state.loading) {
      console.log("STATE :: ", $auth0.state)
      if ($auth0.state.isAuthenticated) {
        console.log("isAuthenticated", $auth0.state.isAuthenticated)
        next()
      }
      else {
        if ($auth0.client) {
          console.log("909090909090909090909")
          //$auth0.client.loginWithRedirect({ appState: { targetUrl: to.fullPath } })
        }
      }
    }
    else {
      console.log("121212123121211")
      next()
    }
  })
  */
}

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
      console.log("XXXXXXXXXXXX", JSON.stringify(appState))
      onRedirectCallback(appState, router)
    }
  } catch (e) {
    $auth0.state.error = e
  } finally {
    // Initialize authentication state
    $auth0.state.isAuthenticated = await $auth0.client.isAuthenticated()
    $auth0.state.user = await $auth0.client.getUser()
    $auth0.state.isLoading = false
    //console.log("this.user :: ", $auth0.state.user)
    if ($auth0.state.user) {
      //console.log(JSON.stringify($auth0.state.user))
      /*
      const userid = await signInUser($auth0.state.user.sub, $auth0.state.user.nickname)
      console.log("USER ID", userid)
      if (!userid) { console.log("USER UNKNOWN") }
      else { console.log("WELCOME USER") }
      */
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

/**
 * Vue 3.0 plugin to expose the wrapper object throughout the application.
 * The Auth0 client is available as $auth0.client.
 */
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

async function signInUser(sub, nickname) {
  console.log("signInUser", sub, nickname)
  return axios
    .get(api_url + '/api/getusersignin?sub=' + sub + '&nickname=' + nickname)
    .then( (response) => {
      console.log("USERID", response.data.id)
      return response.data.id
    })
    .catch( (e) => {
      console.log("signInUser ERROR", e)
      return 0
    })
}

///////// ///////// ///////// ///////// ///////// /////////