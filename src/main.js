import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import * as echarts from "echarts"
import "default-passive-events" //处理ele-ui警告
import "./assets/icons/index"
import "./assets/css/global.css"
import { message } from "@/utils/message"
import { loading } from "@/utils/loading"
import chatWebSocket from "./utils/websocket/chat-websocket"
import statusWebSocket from "./utils/websocket/status-websocket"
import logWebSocket from "./utils/websocket/log-websocket"
import {
  postRequest,
  putRequest,
  getRequest,
  deleteRequest,
  getBaseUrl,
} from "@/utils/api"

Vue.use(ElementUI)
Vue.config.productionTip = false
// 插件形式使用请求
Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.getBaseUrl = getBaseUrl
Vue.prototype.$echarts = echarts
Vue.prototype.$message = message
Vue.prototype.getLoading = loading
Vue.prototype.$chatWebSocket = chatWebSocket
Vue.prototype.$statusWebSocket = statusWebSocket
Vue.prototype.$logWebSocket = logWebSocket

const vue = new Vue({
  router,
  store,
  data: {
    prefix: "/zhenxun/api",
  },
  render: (h) => h(App),
}).$mount("#app")

export default vue
