import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const Login = () => import("../components/Login.vue");
const Home = () => import("../components/Home.vue");
const Index = () => import("../views/Index.vue");
const Profile = () => import("../views/Profile.vue");
const BusRoute = () => import("../views/BusRoute.vue");

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  routes: [
    { path: "/login", component: Login },
    { path: "/", redirect: "/home" },
    {
      path: "/home",
      component: Home,
      redirect: "/index",
      children: [
        {
          path: "/index",
          component: Index,
          children: [
            {
              path: "/busroute/:routeId",
              component: BusRoute,
            },
          ],
        },
        {
          path: "/profile",
          component: Profile,
        },
      ],
    },
  ],
});

// 挂载路由前置守卫
router.beforeEach((to, from, next) => {
  //首先判断用户是否已经登录
  const token = JSON.parse(window.sessionStorage.getItem("token"));
  if (to.path !== "/login") {
    if (token) {
      //已经登录
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
