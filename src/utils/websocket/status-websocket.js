// import router from "@/router/routers" //引入router, 作页面跳转
// import store from "@/store" //引入store, 作聊天消息存储
import { getPort } from "@/utils/api"
import vue from "@/main"

async function getImageSize(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    // 设置加载完成后的处理函数
    img.onload = function () {
      resolve({ width: this.width, height: this.height })
    }
    // 设置加载失败时的错误处理函数
    img.onerror = function () {
      reject("Failed to load image")
    }
    // 开始加载图像
    img.src = imageUrl
  })
}

var ws = null
var heartbeatInterval = null

function startHeartbeat() {
  heartbeatInterval = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send("ping") // 发送心跳消息
    }
  }, 5000)
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval) // 停止心跳检测定时器
  }
}

async function websocketOnmessage(event) {
  const data = JSON.parse(event.data)
  console.log("收到消息：", data)
}

export default {
  ws: null,
  //初始化ws
  initWebSocket: function () {
    if (!ws) {
      const host = location.host.split(":")[0] || ""
      const port = getPort() || window.location.port
      const CHAT_WS_URL = `ws://${host}:${port}/zhenxun/socket/chat` // 日志ws
      const websocket = new WebSocket(CHAT_WS_URL)
      startHeartbeat()
      websocket.onopen = () => {
        console.log("chat WebSocket 已连接...")
      }
      websocket.onmessage = websocketOnmessage
      websocket.onclose = () => {
        vue.$message.warning("chat WebSocket 已断开...")
        stopHeartbeat()
        setTimeout(() => {
          this.initWebSocket()
        }, 3000)
      }
      ws = websocket
    }
  },
  //断开socked方法
  closeWebSocket: function () {
    console.log("关闭ws")
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close()
    }
  },
}
