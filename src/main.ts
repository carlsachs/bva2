import 'windi.css'
import { setupAuth0 } from '~/modules/auth0'
import { createApp, App as AppType } from 'vue'
import { pinia } from './stores'
import { router } from './routes'
import App from './App.vue'
import VueApexChart from 'vue3-apexcharts'
import VueFinalModal from 'vue-final-modal'
import VueSmoothScroll from 'vue3-smooth-scroll'
import { createHead } from '@vueuse/head'

setupAuth0(router)

const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)
app.use(pinia)
app.use(VueApexChart)
app.use(VueFinalModal())
app.use(VueSmoothScroll)

Object.values(import.meta.globEager('./modules/*.ts')).map(i =>
  i.install?.({ app, isClient: true, router }),
)

app.mount('#app')
