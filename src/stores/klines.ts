import { defineStore } from 'pinia'
import axios from "../utils/axios"
import { useRequest } from 'vue-request'

export const useKlineStore = defineStore({
  id: 'klines',
  state: () => ({
    items: [],
  }),
  actions: {
    getItems() {
      console.log("get BTC Kline Candles...")
      const getBTCKlineData = () => {
        return axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000')
      }
      const { data: klines } = useRequest( () =>  getBTCKlineData(), {
        cacheKey: 'klines',
        cacheTime: 300000,
        pollingInterval: 8000,
        formatResult: res => {
          return res.data
        },
        onSuccess: (res) => {
          console.log("KLINES ->", res.length)
          this.items = res
        }
      })
    },
  },
})
