import Vue from "vue"
import VueRouter from "vue-router"
import Login from "@/views/Login"
import Home from "@/views/Home"
import MyApi from "@/views/MyApi"
import PluginManage from "@/views/plugin/PluginManage"
import MainCommand from "@/views/command/MainCommand"
import GroupManage from "@/views/group/GroupManage"
import RequestManage from "@/views/request/RequestManage"
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
    redirect: "/command",
    children: [
      { path: "/command", name: "控制台", component: MainCommand },
      { path: "/plugin", name: "插件列表", component: PluginManage },
      { path: "/group", name: "群组管理", component: GroupManage },
      { path: "/request", name: "请求管理", component: RequestManage },
      { path: "/system", name: "系统信息", component: SystemInfo },
    ],
  },
  // {
  //   path: '/home',
  //   name: 'Home',
  //   component: Home,
  // }
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

export default router
