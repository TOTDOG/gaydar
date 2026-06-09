import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: Home,
    },
    {
        path: "/form",
        name: "form",
        // Lazy load this component for optimized initial bundle sizes
        component: () => import("../views/Form.vue"),
    },
    {
        path: "/about",
        name: "about",
        component: () => import("../views/About.vue"),
    },
    {
        path: "/propose-attribute",
        name: "propose-attribute",
        // Lazy load this component for optimized initial bundle sizes
        component: () => import("../views/ProposeAttribute.vue"),
    },
    {
        path: "/admin-login",
        name: "admin-login",
        // Lazy load this component for optimized initial bundle sizes
        component: () => import("../views/AdminLogin.vue"),
    },
    {
        path: "/stats",
        name: "stats",
        // Lazy load this component for optimized initial bundle sizes
        component: () => import("../views/Stats.vue"),
    },
    {
        path: "/vote-on-attributes",
        name: "vote-on-attributes",
        // Lazy load this component for optimized initial bundle sizes
        component: () => import("../views/VoteOnAttributes.vue"),
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(_to, _from, _savedPosition) {
        // always scroll to top
        return { top: 0 };
    },
});
