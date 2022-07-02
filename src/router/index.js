import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Render",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import("../views/D3/Renderer-view.vue"),
  },
  {
    path: "/graph",
    name: "Graph",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import("../views/D3/Graph-view.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
