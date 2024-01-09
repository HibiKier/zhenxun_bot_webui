<template>
  <div class="chat-window">
    <template v-if="isStartChat">
      <p class="title">{{ chatInfo.name }}</p>
      <el-divider />
      <div class="chat-area" id="chat" :key="reloadKey">
        <div
          v-for="(data, index) in msgObj[chatId]"
          :key="index"
          class="msg-item"
        >
          <el-avatar :src="data.ava_url" class="ava"></el-avatar>
          <div class="msg-box">
            <p class="user-name">{{ data.name }}</p>
            <p class="msg-text">{{ data.message }}</p>
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
      msgObj: { default: [] },
      botInfo: null,
      chatId: "default",
      reloadKey: 0,
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
    sendMessage() {
      this.postRequest("send_message", {
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
            if (!this.chatInfo.group_id && this.chatInfo.user_id) {
              this.msgObj[this.chatId].push({
                user_id: this.chatInfo.user_id,
                message: this.message,
                name: this.botInfo.name,
                ava_url: `http://q1.qlogo.cn/g?b=qq&nk=${this.botInfo.self_id}&s=160`,
              })
            }
            this.message = ""
            this.reloadKey++
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    startChat(data) {
      this.chatInfo = data
      const chatId = data.group_id || data.user_id
      if (!this.msgObj[chatId]) {
        this.msgObj[chatId] = []
      }
      this.chatId = chatId
      this.isStartChat = true
      this.initChatWebSocket()
    },
    initChatWebSocket() {
      if (!this.chatWs) {
        let param = ""
        if (this.chatInfo.user_id) {
          param = "?user_id=" + this.chatInfo.user_id
        } else {
          param = "?group_id=" + this.chatInfo.group_id
        }
        this.chatWs = new WebSocket(this.CHAT_WS_URL + param)
        this.chatWs.onopen = () => {
          console.log("chat WebSocket 已连接...")
        }
        this.chatWs.onmessage = this.chatWsOnmessage
        this.chatWs.onclose = () => {
          this.$message.warning("chat WebSocket 已断开...")
        }
      }
    },
    chatWsOnmessage(event) {
      console.log("this.chatId", this.chatId, event)

      const data = JSON.parse(event.data)
      this.msgObj[this.chatId].push(data)
      this.reloadKey++
      this.$nextTick(() => {
        var divElement = document.getElementById("chat")
        divElement.scrollTop = divElement.scrollHeight
      })
      console.log("this", this.msgObj)
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
