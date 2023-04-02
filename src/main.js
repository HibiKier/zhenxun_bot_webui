import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import * as echarts from "echarts";
import "default-passive-events"; //处理ele-ui警告
import "./assets/icons/index";
import { message } from "@/utils/message";

import {
  postRequest,
  putRequest,
  getRequest,
  deleteRequest,
} from "@/utils/api";

Vue.use(ElementUI);
Vue.config.productionTip = false;
// 插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.$echarts = echarts;
Vue.prototype.$message = message;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
