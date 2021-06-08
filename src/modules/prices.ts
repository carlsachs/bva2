import { reactive, App, watchEffect } from 'vue'
import { useRequest } from 'vue-request'
import axios from "../utils/axios"


export const $prices = reactive({
  items: [],
} as $PricesDefaults)

const getPrices = () => {
  return axios.get('https://api.binance.com/api/v3/ticker/price')
}

const { data: prices } = useRequest( getPrices, {
  cacheKey: 'prices',
  cacheTime: 300000,
  pollingInterval: 10000,
  formatResult: res => {
    return res.data
  },
  onSuccess: (res) => {
    console.log("PRICESSS --->", res.length)
    $prices.items = res
  }
})

export const install = ({ app }: { app: App }) => {
  app.use({
    install(app: App, options: any) {
      app.config.globalProperties.$prices = $prices
      app.provide('prices', $prices)
    }
  })
}

interface $PricesDefaults {
  items: [],
}
