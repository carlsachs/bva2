import { defineStore } from 'pinia'
import _ from "lodash"
import axios from "../utils/axios"
import { useRequest } from 'vue-request'

export const useStratStore = defineStore({
  id: 'strategy',
  state: () => ({
    name: "",
    items: [],
    series: [],
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
      console.log("getItems...")
      ///////// ///////// ///////// /////////
      const getSeriesData = () => {
        let tpnl_btc = []
        let tpnl_bva = []
        let pnl_btc = 0
        let pnl_bva = 0
        const days = 10 + parseInt((this.items[0].updated_time - this.items[this.items.length-1].updated_time)/86400000)
        return axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit='+days)
        .then( btcs => {
          for ( var btc of btcs.data ) {
            pnl_btc = 100 * (Number(btc[4]) - Number(btc[1])) / Number(btc[1]) + pnl_btc
            tpnl_btc.push([ btc[0], pnl_btc.toFixed(2) ])
            const sum = this.items.filter( bva => { 
              return Number(bva.updated_time) > btc[0] && Number(bva.updated_time) <= btc[6] 
            })
            pnl_bva = _.sumBy(sum, o => { return Number(o.pnl) }) / 15 + pnl_bva
            tpnl_bva.push([ btc[0], pnl_bva.toFixed(2) ])
          }
          return [
            { name: 'BTC', data: tpnl_btc }, 
            { name: 'BVA', data: tpnl_bva }
          ]
        })
        .catch((err) => {
          console.log(err)
          return []
        })
      }
      const { data: candles, run } = useRequest( () => getSeriesData(), {
        cacheKey: 'candles',
        cacheTime: 300000,
        pollingInterval: 5000,
        manual: true,
        /*
        formatResult: res => {
          return res.data
        },
        */
        onSuccess: (res) => {
          console.log("KLINES ->", res)
          this.series = res
        }
      })
      ///////// ///////// ///////// /////////
      const getStratData = () => {
        return axios.get('/api/strategy?id=466')
      }
      const { data: signals } = useRequest( () =>  getStratData(), {
        cacheKey: 'signals',
        cacheTime: 300000,
        pollingInterval: 5000,
        formatResult: res => {
          return res.data
        },
        onSuccess: (res) => {
          console.log("STRAT ->", res.length)
          this.items = res
          this.name = res[0].stratname
          run()
        }
      })
      ///////// ///////// ///////// /////////
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
