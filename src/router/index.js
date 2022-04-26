import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Home from "@/views/Home";
import PluginManage from "@/views/plugin/PluginManage";
import GroupManage from "@/views/group/GroupManage";
import RequestManage from "@/views/request/RequestManage";
import SystemInfo from "@/views/system/SystemInfo";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    children: [
      { path: '/plugin', name: '插件列表', component: PluginManage, },
      { path: '/group', name: '群组管理', component: GroupManage, },
      { path: '/request', name: '请求管理', component: RequestManage, },
      { path: '/system', name: '系统信息', component: SystemInfo, },
    ]
  },
  // {
  //   path: '/home',
  //   name: 'Home',
  //   component: Home,
  // }
]

const router = new VueRouter({
  routes
})

export default router
