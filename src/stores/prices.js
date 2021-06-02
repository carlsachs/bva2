// @ts-check
import { defineStore } from 'pinia'
//import { useUserStore } from './user'
import axios from "../utils/axios"
import { useRequest } from 'vue-request'

export const usePriceStore = defineStore({
  id: 'prices',
  state: () => ({
    //rawItems: [],
    items: [],
  }),
  /*
  getters: {
    items: (state) =>
      state.rawItems.reduce((items, item) => {
        const existingItem = items.find((it) => it.name === item)
        if (!existingItem) {
          items.push({ name: item, amount: 1 })
        } else {
          existingItem.amount++
        }
        return items
      }, []),
  },
  */
  actions: {
    getItems() {
      console.log("getPriceItems...")
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
              console.log("PRICES ->", res.length)
              this.items = res
          }
      })
    },
    /*
    addItem(name) {
      this.rawItems.push(name)
    },
    removeItem(name) {
      const i = this.rawItems.lastIndexOf(name)
      if (i > -1) this.rawItems.splice(i, 1)
    },
    async purchaseItems() {
      const user = useUserStore()
      if (!user.name) return
      console.log('Purchasing', this.items)
      const n = this.items.length
      this.rawItems = []
      return n
    },
    */
  },
})
