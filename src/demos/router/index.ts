import Home from "../views/Home.vue";
import About from "../views/About.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
