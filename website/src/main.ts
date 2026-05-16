import { createApp } from 'vue'
import './style.css'
import { initBotId } from 'botid/client/core'
import App from './App.vue'

initBotId({
  protect: [
    { path: "/api/respond", method: "POST"}
  ],
})

createApp(App).mount('#app')
