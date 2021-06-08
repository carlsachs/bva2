import { reactive, App, watchEffect } from 'vue'
import { useRequest } from 'vue-request'
import axios from "../utils/axios"


export const $klines = reactive({
  items: [],
} as $KlinesDefaults)

const getBTCKlineData = () => {
  return axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000')
}
const { data: klines } = useRequest( () =>  getBTCKlineData(), {
  cacheKey: 'klines',
  cacheTime: 300000,
  //pollingInterval: 8000,
  formatResult: res => {
    return res.data
  },
  onSuccess: (res) => {
    console.log("KLINESSSS ---->", res.length)
    $klines.items = res
  }
})

export const install = ({ app }: { app: App }) => {
  app.use({
    install(app: App, options: any) {
      app.config.globalProperties.$klines = $klines
      app.provide('klines', $klines)
    }
  })
}

interface $KlinesDefaults {
  items: [],
}
