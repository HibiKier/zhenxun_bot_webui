export function loading(target) {
  const loading = this.$loading({
    target: target,
    lock: true,
    text: '(>ω<) 正在努力加载中喵~',
    spinner: 'el-icon-star-on', // 使用星星图标更可爱
    background: 'rgba(255, 182, 193, 0.8)', // 粉红色半透明背景
    customClass: 'kawaii-loading', // 添加自定义类名
    textColor: '#ff69b4', // 粉色文字
    spinnerColor: '#ff69b4', // 粉色旋转图标
  })
  setTimeout(function () {
    // 设定定时器，超时2S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    loading.close() // 关闭遮罩层
  }, 5000)
  return loading
}
