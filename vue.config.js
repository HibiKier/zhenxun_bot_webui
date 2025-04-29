const { defineConfig } = require("@vue/cli-service")
const path = require("path")
module.exports = defineConfig({
  transpileDependencies: true,
})

let proxyObj = {}

proxyObj["/"] = {
  target: "http://localhost:8080", //真寻酱的端口捏
  changeOrigin: true,
  pathReWrite: {
    "^/": "/",
  },
  ws: false,
}

module.exports = {
  productionSourceMap: false,
  devServer: {
    host: "0.0.0.0",
    port: 8081,
    proxy: proxyObj,
  },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [require("tailwindcss"), require("autoprefixer")],
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "真寻酱的后台捏"
      return args
    })
    config.module
      .rule("svg")
      .exclude.add(path.join(__dirname, "src/assets/icons/svg"))
      .end()

    config.module
      .rule("icons") // 定义一个名叫 icons 的规则
      .test(/\.svg$/) // 设置 icons 的匹配正则
      .include.add(path.join(__dirname, "src/assets/icons/svg")) // 设置当前规则的作用目录，只在当前目录下才执行当前规则
      .end()
      .use("svg-sprite") // 指定一个名叫 svg-sprite 的 loader 配置
      .loader("svg-sprite-loader") // 该配置使用 svg-sprite-loader 作为处理 loader
      .options({
        // 该 svg-sprite-loader 的配置
        symbolId: "icon-[name]",
      })
      .end()
  },
}
