const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

let proxyObj = {};

proxyObj["/"] = {
  target: "http://localhost:8080",//真寻酱的端口捏
  changeOrigin: true,
  pathReWrite: {
    "^/": "/",
  },
  ws: false
};

module.exports = {
  productionSourceMap: false,
  devServer: {
    host: "0.0.0.0",
    port: 8081,
    proxy: proxyObj,
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
        args[0].title = '真寻酱的后台捏'
        return args
    })},
};