import { reactive, App } from 'vue'
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

export async function setupAuth0() {
  $auth0.client = await setupClient()
  const search = window.location.search
  const comingFromRedirect =
    search.includes('code=') && search.includes('state=')
  try {
    // If the user is returning to the app after auth success with Auth0.
    if (comingFromRedirect) {
      // handle the redirect and retrieve tokens
      const { appState } = await $auth0.client.handleRedirectCallback()
    }
  } catch (e) {
    $auth0.state.error = e
  } finally {
    // Initialize authentication state
    $auth0.state.isAuthenticated = await $auth0.client.isAuthenticated()
    $auth0.state.user = await $auth0.client.getUser()
    $auth0.state.isLoading = false
    console.log("this.user 4")
    console.log(JSON.stringify($auth0.state.user))
    const userid = await signInUser($auth0.state.user.sub, $auth0.state.user.nickname)
    console.log("USER ID", userid)
    if (!userid) {
      console.log("USER UNKNOWN")
    }
    else {
      console.log("WELCOME USER")
    }
  }
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

/**
 * Vue 2.0 plugin to expose the wrapper object throughout the application.
 * The Auth0 client is available as $auth0.client.
 */
// export const Auth0Plugin = {
//   install(Vue, options) {
//     Vue.prototype.$auth0 = $auth0
//   }
// }

/**
 * Storage provider for the FeathersJS Authentication Client.
 * The getItem and setItem are not needed, but have to be stubbed out to prevent errors.
 */
export const storage = {
  async getItem() {
    let token

    try {
      $auth0.client = await setupClient()
      token = await $auth0.client?.getTokenSilently()
    } catch (error) {
      console.error('feathers auth0 storage error', error)
      token = ''
    }
    return token
  },
  setItem() {},
  removeItem() {}
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