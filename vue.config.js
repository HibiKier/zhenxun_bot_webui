const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

let proxyObj = {};

proxyObj["/"] = {
  ws: false,
  target: "http://localhost:8080",
  // 发送请求头会被设置target
  changeOrigin: true,
  // 不重写请求地址
  pathReWrite: {
    "^/": "/",
  },
};

module.exports = {
  devServer: {
    host: "0.0.0.0",
    port: 8081,
    proxy: proxyObj,
  },
};