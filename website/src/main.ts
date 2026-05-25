import { createApp } from 'vue'
import './style.css'
import { initBotId } from 'botid/client/core'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura' 
import { router } from './router/index.js'

initBotId({
  protect: [
    { path: "/api/respond", method: "POST"}
  ],
})

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura  // or Lara, Nora, Material
  }
})
app.use(router)
app.mount('#app')