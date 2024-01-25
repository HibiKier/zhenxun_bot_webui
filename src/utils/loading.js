export function loading(target) {
  const loading = this.$loading({
    // 声明一个loading对象
    target: target,
    lock: true, // 是否锁屏
    text: "嘟嘟嘟，连线中...", // 加载动画的文字
    spinner: "el-icon-loading", // 引入的loading图标
    background: "rgba(0, 0, 0, 0.7)", // 背景颜色
  })
  setTimeout(function () {
    // 设定定时器，超时2S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    loading.close() // 关闭遮罩层
  }, 5000)
  return loading
}
