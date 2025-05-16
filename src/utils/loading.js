export function loading(target) {
  const loading = this.$loading({
    target: target,
    lock: true,
    text: "(>ω<) 正在努力加载中喵~",
    spinner: "el-icon-star-on",
    background: "var(--el-bg-color-overlay)",
    customClass: "kawaii-loading",
    textColor: "var(--el-color-primary-light-3)",
    spinnerColor: "var(--el-color-primary-light-3)",
  })
  setTimeout(function () {
    // 设定定时器，超时2S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    loading.close() // 关闭遮罩层
  }, 5000)
  return loading
}

// 添加自定义样式
const style = document.createElement("style")
style.textContent = `
  .kawaii-loading {
    .el-loading-spinner {
      .el-loading-text {
        color: var(--el-color-primary-light-3) !important;
      }
      .circular {
        color: var(--el-color-primary-light-3) !important;
      }
    }
  }
`
document.head.appendChild(style)
