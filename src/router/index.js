import Vue from "vue"
import VueRouter from "vue-router"
import Login from "@/views/Login"
import Home from "@/views/Home"
import MyApi from "@/views/MyApi"
import PluginManage from "@/views/plugin/PluginManage"
import StoreManage from "@/views/store/StoreManage"
import MainCommand from "@/views/command/MainCommand"
import FriendGroupManage from "@/views/manage/FriendGroupManage"
import DatabaseManage from "@/views/database/DatabaseManage"
import MainDashboard from "@/views/dashboard/MainDashboard"
import SystemInfo from "@/views/system/SystemInfo"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/myapi",
    name: "MyApi",
    component: MyApi,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    redirect: "/dashboard",
    children: [
      { path: "/dashboard", name: "仪表盘", component: MainDashboard },
      { path: "/command", name: "BOT控制台", component: MainCommand },
      { path: "/plugin", name: "插件列表", component: PluginManage },
      { path: "/store", name: "插件商店", component: StoreManage },
      { path: "/manage", name: "好友/群组", component: FriendGroupManage },
      { path: "/database", name: "数据库管理", component: DatabaseManage },
      { path: "/system", name: "系统信息", component: SystemInfo },
    ],
  },
]

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = window.sessionStorage.getItem("isAuthenticated")
  console.log("to", to.path)

  if (!["/", "/myapi"].includes(to.path) && !isAuthenticated) {
    next("/") // 重定向到登录页面
  } else {
    next()
  }
})

export default router
