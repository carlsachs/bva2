import 'windi.css'
import { setupAuth0 } from '~/modules/auth0'
import { createApp, App as AppType } from 'vue'
//import store from "./store";
import { router } from './routes'
import App from './App.vue'
import VueApexChart from 'vue3-apexcharts'
import VueFinalModal from 'vue-final-modal'
import VueSmoothScroll from 'vue3-smooth-scroll'

setupAuth0(router)

const app = createApp(App)
app.use(router)
//app.use(store)
app.use(VueApexChart)
app.use(VueFinalModal())
app.use(VueSmoothScroll)

Object.values(import.meta.globEager('./modules/*.ts')).map(i =>
  i.install?.({ app, isClient: true, router }),
)

app.mount('#app')
