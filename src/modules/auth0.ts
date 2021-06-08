import _ from "lodash"
import { reactive, App, watchEffect } from 'vue'
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js'
import axios from "../utils/axios"
import { useKlineStore } from '../stores/klines'

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
    series: any
  }
}

export const $auth0 = reactive({
  client: null,
  state: {
    isLoading: true,
    isAuthenticated: false,
    error: null,
    user: null,
    series: [{ name: "Bitcoin", data: [] }, { name: "You", data: [] }]
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
  console.log("SETUP AUTH")
  $auth0.client = await setupClient()
  const search = window.location.search
  const comingFromRedirect = search.includes('code=') && search.includes('state=')
  console.log("LOGGED IN")
  try {
    if (comingFromRedirect) {
      const { appState } = await $auth0.client.handleRedirectCallback()
      onRedirectCallback(appState, router)
    }
  } catch (e) {
    $auth0.state.error = e
    router.replace("/")
  } finally {
    console.log("AUTHENTICATION")
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
        console.log("WELCOME USER", $auth0.state.user['user_data'].info.id, $auth0.state.user['user_data'].trades.length, $auth0.state.user['user_data'].subs.length )
        const klines = useKlineStore()
        console.log("KLINES :::", klines)
        if (user_data.trades?.length && klines?.items?.length) {
          let tpnl_btc = []
          let tpnl_bva = []
          let pnl_btc = 0
          let pnl_bva = 0
          const lifetime = parseInt((user_data.trades[0].updated_time - user_data.trades[user_data.trades.length-1].updated_time)/86400000)
          for ( var kline of klines.items.slice(klines.items.length-1-lifetime, klines.items.length-1) ) {
            pnl_btc = 100 * (Number(kline[4]) - Number(kline[1])) / Number(kline[1]) + pnl_btc
            tpnl_btc.push([ kline[0], pnl_btc.toFixed(2) ])
            const sum = user_data.trades.filter( trade => { 
              return Number(trade.updated_time) > kline[0] && Number(trade.updated_time) <= kline[6] 
            })
            pnl_bva = _.sumBy(sum, o => { return Number(o.pnl) }) / 15 + pnl_bva
            tpnl_bva.push([ kline[0], pnl_bva.toFixed(2) ])
          }
          $auth0.state.series = [{ name: "Bitcoin", data: tpnl_btc }, { name: "You", data: tpnl_bva }]
        }
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
