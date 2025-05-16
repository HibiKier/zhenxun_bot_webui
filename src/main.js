import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import * as echarts from "echarts"
import "default-passive-events"
import "./assets/icons/index"
import "./assets/css/global.css"
import "@/styles/theme.scss"
import "@/assets/tailwind.css" // 引入 Tailwind
import "@/utils/components"
import { message, notify } from "@/utils/message"
import { loading } from "@/utils/loading"
import chatWebSocket from "./utils/websocket/chat-websocket"
import statusWebSocket from "./utils/websocket/status-websocket"
import logWebSocket from "./utils/websocket/log-websocket"
import { isMobile } from "@/utils/validate"
import {
  postRequest,
  putRequest,
  getRequest,
  deleteRequest,
  getBaseUrl,
} from "@/utils/api"

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.getBaseUrl = getBaseUrl
Vue.prototype.$echarts = echarts
Vue.prototype.$message = message
Vue.prototype.$notify = notify
Vue.prototype.getLoading = loading
Vue.prototype.$chatWebSocket = chatWebSocket
Vue.prototype.$statusWebSocket = statusWebSocket
Vue.prototype.$logWebSocket = logWebSocket
Vue.prototype.$isMobile = isMobile

const vue = new Vue({
  router,
  store,
  data: {
    prefix: "/zhenxun/api",
  },
  render: (h) => h(App),
}).$mount("#app")

export default vue
