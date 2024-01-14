<template>
  <div class="chat-window">
    <meta name="referrer" content="never" />
    <template v-if="isStartChat">
      <p class="title">{{ chatInfo.name }}</p>
      <el-divider />
      <div class="chat-area" id="chat" :key="reloadKey">
        <div
          v-for="(data, index) in chatObj[chatId]"
          :key="index"
          class="msg-item"
        >
          <el-avatar :src="data.ava_url" class="ava"></el-avatar>
          <div class="msg-box">
            <p class="user-name">{{ data.name }}</p>
            <p class="msg-text">
              <span v-for="(msg, index) in data.message" :key="index">
                <img
                  v-if="msg.type == 'img'"
                  :src="msg.msg"
                  :style="{
                    width: msg.width + 'px',
                    height: msg.height + 'px',
                  }"
                />
                <span v-else>{{ msg.msg }}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
      <el-divider />
      <div class="input-area">
        <el-input
          v-model="message"
          :rows="4"
          type="textarea"
          resize="none"
        ></el-input>
        <div style="margin-top: 10px">
          <span style="float: right; display: flex">
            <MyButton :width="80" text="清空" @click="message = ''" />
            <MyButton
              :width="80"
              text="发送"
              @click="sendMessage"
              style="margin-left: 10px"
            />
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="empty">
        <el-empty
          :image-size="350"
          :image="require('../../assets/image/empty1.png')"
          description=" "
        ></el-empty>
      </div>
    </template>
  </div>
</template>

<script>
import MyButton from "../ui/MyButton.vue"

export default {
  name: "ChatWindow",
  components: { MyButton },
  data() {
    return {
      message: "",
      isStartChat: false,
      chatInfo: {},
      chatWs: null,
      botInfo: null,
      chatId: "default",
      reloadKey: 0,
      chatObj: { default: [] },
    }
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    const host = location.host.split(":")[0] || ""
    this.CHAT_WS_URL = `ws://${host}:8080/zhenxun/socket/chat` // 日志ws
  },
  beforeDestroy() {
    this.destroyWebsocket()
  },
  methods: {
    getImageSize(imageUrl) {
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
    },
    sendMessage() {
      if (!this.message) {
        return
      }
      this.postRequest("manage/send_message", {
        bot_id: this.botInfo.self_id,
        group_id: this.chatInfo.group_id,
        user_id: this.chatInfo.user_id,
        message: this.message,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            // if (!this.chatInfo.group_id && this.chatInfo.user_id) {
            this.chatObj[this.chatId].push({
              user_id: this.chatInfo.user_id,
              message: [{ type: "text", msg: this.message }],
              name: this.botInfo.name,
              ava_url: `http://q1.qlogo.cn/g?b=qq&nk=${this.botInfo.self_id}&s=160`,
            })
            // }
            this.message = ""
            this.reloadKey++
            this.$nextTick(() => {
              var divElement = document.getElementById("chat")
              divElement.scrollTop = divElement.scrollHeight
            })
            console.log("this.chatObj", this.chatObj)
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    startChat(data) {
      this.chatInfo = data
      const chatId = data.group_id || data.user_id
      if (!this.chatObj[chatId]) {
        this.chatObj[chatId] = []
      }
      this.chatId = chatId
      this.isStartChat = true
      this.initChatWebSocket()
    },
    initChatWebSocket() {
      if (!this.chatWs) {
        this.chatWs = new WebSocket(this.CHAT_WS_URL)
        this.chatWs.onopen = () => {
          console.log("chat WebSocket 已连接...")
        }
        this.chatWs.onmessage = this.chatWsOnmessage
        this.chatWs.onclose = () => {
          this.$message.warning("chat WebSocket 已断开...")
        }
      }
    },
    async chatWsOnmessage(event) {
      const data = JSON.parse(event.data)
      for (let i = 0; i < data.message.length; i++) {
        const e = data.message[i]
        if (e.type == "img") {
          const img = await this.getImageSize(e.msg)
          if (img.width > 280) {
            const n = img.width / 280 - 0.01
            img.width = Math.floor(img.width / n)
            img.height = Math.floor(img.height / n)
          }
          e.width = img.width
          e.height = img.height
        }
      }
      if (Object.keys(this.chatObj).includes(data.object_id)) {
        this.chatObj[data.object_id].push(data)
        if (this.chatObj[data.object_id].length > 50) {
          this.chatObj[data.object_id].splice(0, 1)
        }
        this.reloadKey++
      }
      this.$nextTick(() => {
        var divElement = document.getElementById("chat")
        divElement.scrollTop = divElement.scrollHeight
      })
    },
    destroyWebsocket() {
      if (this.chatWs && this.chatWs.readyState === WebSocket.OPEN) {
        this.chatWs.close()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.chat-window {
  height: calc(100% - 60px);
  width: calc(100% - 40px);
  background-color: #fff;
  padding: 30px 20px;

  .title {
    color: #939395;
    font-size: 20px;
    margin-left: 30px;
  }

  .chat-area {
    height: 70%;
    overflow: auto;

    .ava {
      width: 55px;
      height: 55px;
    }

    .msg-item {
      display: flex;
      margin-bottom: 30px;

      .msg-box-self {
        float: right;
      }
      .user-name {
        color: #888a8e;
        font-size: 15px;
      }
      .msg-text {
        margin-top: 5px;
        font-size: 20px;
        // border: #e5e5e4 solid 1px;
        background-color: #e5e5e4;
        padding: 10px;
        border-radius: 10px;
        word-wrap: break-word;
        word-break: break-all;
        max-width: 300px;
      }

      .msg-box {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }

  .input-area {
    height: calc(30% - 95px);
  }

  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
