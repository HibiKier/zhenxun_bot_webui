<template>
  <div class="chat-window">
    <meta name="referrer" content="never" />
    <div class="inner-chat-box" v-if="isStartChat">
      <div class="top-box">
        <p class="title">{{ chatInfo.name }}</p>
        <div class="btn-group">
          <my-button text="清空记录" @click="clearMessage" :width="110" />
        </div>
      </div>
      <el-divider />
      <div class="chat-area" id="chat" :key="reloadKey">
        <div
          v-for="(data, index) in $store.state.chatObj[chatId]"
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
    </div>
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
import { getPort } from "@/utils/api"

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
    this.$chatWebSocket.initWebSocket()
  },
  beforeDestroy() {
    // this.$chatWebSocket.destroyWebsocket()
  },
  methods: {
    async sendMessage() {
      if (!this.message) {
        return
      }
      const loading = this.getLoading(".el-textarea")

      this.$chatWebSocket
        .sendMessage(
          this.botInfo,
          this.chatInfo.group_id,
          this.chatInfo.user_id,
          this.message
        )
        .then((resp) => {
          this.message = ""
          this.reloadKey++
          this.$nextTick(() => {
            var divElement = document.getElementById("chat")
            divElement.scrollTop = divElement.scrollHeight
          })
          loading.close()
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
      this.$nextTick(() => {
        var divElement = document.getElementById("chat")
        divElement.scrollTop = divElement.scrollHeight
      })
    },
    clearMessage() {
      this.$confirm("确认清空聊天记录?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: true,
        type: "warning",
      }).then(() => {
        this.$store.commit("CLEAR_CHAT", this.chatId)
        this.$message.success("清空记录成功!")
      })
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

  .inner-chat-box {
    height: 100%;
    width: 100%;
  }
  .top-box {
    height: 25px;
  }

  .title {
    color: #939395;
    font-size: 20px;
    margin-left: 30px;
    float: left;
  }

  .btn-group {
    float: right;
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
