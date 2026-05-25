import { createMemoryHistory, createRouter } from 'vue-router'

import Home from '../components/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/form',
    name: 'form',
    // Lazy load this component for optimized initial bundle sizes
    component: () => import('../components/Form.vue')
  },
]


export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})