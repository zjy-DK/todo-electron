// src/router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import Todo from "../views/todo/index.vue";
import Login from "../views/login/index.vue";
import Setting from "../views/setting/index.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Login,
  },
  {
    path: "/todo",
    name: "Todo",
    component: Todo,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/setting",
    name: "Setting",
    component: Setting,
  },
  // 其他路由...
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
