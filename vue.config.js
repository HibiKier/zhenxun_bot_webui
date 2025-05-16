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

    // 清除默认的 svg 规则
    config.module.rule("svg").uses.clear()

    // 添加新的 svg 规则
    config.module
      .rule("svg")
      .exclude.add(path.join(__dirname, "src/assets/icons/svg"))
      .end()

    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(path.join(__dirname, "src/assets/icons/svg"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end()
      .use("svgo-loader")
      .loader("svgo-loader")
      .options({
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
          {
            name: "removeAttrs",
            params: {
              attrs: "(stroke|fill)",
            },
          },
        ],
      })
  },
}
