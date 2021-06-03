import { defineStore } from 'pinia'

export const useLoadMoreStore = defineStore({
  id: 'current',
  state: () => ({
    current: 1,
  }),
  actions: {
    more() {
      this.current++
    },
    reset() {
      this.current = 1
    },
  },
})
