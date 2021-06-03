import { defineStore } from 'pinia'

export const useCurrentStore = defineStore({
  id: 'current',
  state: () => ({
    current: 1,
  }),
  actions: {
    setCurrent(value) {
      this.current = value
    },
  },
})
