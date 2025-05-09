// import router from "@/router/routers" //引入router, 作页面跳转
// import store from "@/store" //引入store, 作聊天消息存储
import { getBaseUrl, getPort } from "@/utils/api"
import vue from "@/main"

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

async function chatWebsocketOnmessage(event) {
  const data = JSON.parse(event.data)
  console.log("收到消息:", data)

  for (let i = 0; i < data.message.length; i++) {
    const e = data.message[i]
    e.msg = e.msg.replace("&#91;", "[").replace("&#93;", "]")
  }
  const bot_id = vue.$store.state.botInfo.self_id
  if (data.user_id != bot_id) {
    vue.$store.commit("ADD_CHAT_MSG", { chatId: data.object_id, obj: data })
    const type = data.group_id ? "group" : "private"

    window.sortFriendGroupList(type)
    vue.$nextTick(() => {
      var divElement = document.getElementById("chat")
      if (divElement) {
        divElement.scrollTop = divElement.scrollHeight
      }
    })
  }
}

export default {
  ws: null,
  //发送ws方法
  sendMessage: function (botInfo, groupId, userId, msg) {
    return new Promise((resolve, reject) => {
      if (!msg) {
        return resolve()
      }

      vue
        .postRequest(`${vue.$root.prefix}/manage/send_message`, {
          bot_id: botInfo.self_id,
          group_id: groupId,
          user_id: userId,
          message: msg,
        })
        .then((resp) => {
          if (resp.suc) {
            if (resp.warning) {
              vue.$message.warning(resp.warning)
            } else {
              vue.$message.success(resp.info)

              const msgObj = {
                user_id: botInfo.self_id,
                message: [{ type: "text", msg: msg }],
                name: botInfo.name,
                ava_url: `http://q1.qlogo.cn/g?b=qq&nk=${botInfo.self_id}&s=160`,
              }
              vue.$store.commit("ADD_CHAT_MSG", {
                chatId: groupId || userId,
                obj: msgObj,
              })
              vue.$nextTick(() => {
                var divElement = document.getElementById("chat")
                if (divElement) {
                  divElement.scrollTop = divElement.scrollHeight
                }
              })
            }
          } else {
            vue.$message.error(resp.info)
          }
          return resolve(resp)
        })
      resolve()
    })
  },
  //初始化ws
  initWebSocket: function () {
    if (!ws) {
      const baseUrlSplit = getBaseUrl().split("//")
      const baseUrl = baseUrlSplit[1]
      const CHAT_WS_URL = `ws://${baseUrl}/zhenxun/socket/chat` // 日志ws
      const websocket = new WebSocket(CHAT_WS_URL)
      startHeartbeat()
      websocket.onopen = () => {
        console.log("CHAT WebSocket 已连接...")
      }
      websocket.onmessage = chatWebsocketOnmessage
      websocket.onclose = () => {
        vue.$message.warning("CHAT WebSocket 已断开...")
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
