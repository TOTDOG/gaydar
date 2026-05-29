import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'

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
    component: () => import('../views/Form.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/propose-attribute',
    name: 'propose-attribute',
    // Lazy load this component for optimized initial bundle sizes
    component: () => import('../views/ProposeAttribute.vue')
  },
]


export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
})