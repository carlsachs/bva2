import { defineStore } from 'pinia'

export const useLoadMoreStore = defineStore({
  id: 'current',
  state: () => ({
    strat: 1,
    profile: 1,
  }),
  actions: {
    moreStrat() {
      this.strat++
    },
    resetStrat() {
      this.strat = 1
    },
    moreProfile() {
      this.profile++
    },
    resetProfile() {
      this.profile = 1
    },
  },
})
