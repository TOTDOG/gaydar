import { createApp } from "vue";
import "./style.css";
import { initBotId } from "botid/client/core";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { router } from "./router/index.js";
import { loadAdminPrivledges } from "./stores/adminState.js";

initBotId({
    protect: [{ path: "/api/respond", method: "POST" }],
});

const app = createApp(App);
loadAdminPrivledges();
app.use(PrimeVue, {
    theme: {
        preset: Aura, // or Lara, Nora, Material
    },
});
app.use(router);
app.mount("#app");
