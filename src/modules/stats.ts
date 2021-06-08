import { reactive, App, watchEffect } from 'vue'
import moment from 'moment'

export const $stats = reactive({
  startTS: 0,
  endTS: 0,
  timing: 0,
} as $StatsDefaults)

export async function startStats(startTS: number) {
  $stats.startTS = startTS
  console.log("Stats starts...", moment(startTS).format() )
}

export async function endStats(endTS: number) {
  $stats.endTS = endTS
  $stats.timing = (endTS - $stats.startTS)/1000
  console.log("End starts...", moment(endTS).format() )
}

export const install = ({ app }: { app: App }) => {
  app.use({
    install(app: App, options: any) {
      app.config.globalProperties.$stats = $stats
      app.provide('stats', $stats)
    }
  })
}

interface $StatsDefaults {
  startTS: number,
  endTS: number,
  timing: number,
}
