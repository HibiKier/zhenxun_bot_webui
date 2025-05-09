<template>
  <div
    class="chat-window bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col"
  >
    <!-- 空状态 -->
    <div
      v-if="!isStartChat"
      class="flex-1 flex flex-col items-center justify-center p-6"
    >
      <img
        src="@/assets/image/empty1.png"
        class="w-64 h-64 object-contain mb-4"
        alt="等待聊天开始"
      />
      <p class="text-pink-500 text-lg font-medium">
        选择一个好友或群组开始聊天吧~
      </p>
    </div>

    <!-- 聊天界面 -->
    <div v-else class="flex-1 flex flex-col h-full p-4">
      <!-- 顶部标题栏 -->
      <div
        class="flex items-center justify-between mb-4 p-3 bg-white rounded-t-xl shadow-sm"
        ref="header"
      >
        <div class="flex items-center min-w-0">
          <el-avatar
            :src="chatInfo.ava_url"
            :size="40"
            class="flex-shrink-0 border-2 border-pink-200 transform hover:scale-110 transition-transform"
          ></el-avatar>
          <h2
            class="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 truncate min-w-0"
            :title="chatInfo.name"
          >
            {{ chatInfo.name }}
          </h2>
        </div>

        <MyButton
          text="清空记录"
          @click="clearMessage"
          type="pink"
          :rounded="'lg'"
          :shadow="'sm'"
          :height="35"
          :width="100"
          :fontSize="12"
        />
      </div>
      <!-- 消息区域 -->
      <div class="message-container" :style="{ height: chatHeight + 'px' }">
        <div
          class="flex-1 overflow-y-auto p-3 bg-white rounded-lg shadow-inner mb-3"
          id="chat"
        >
          <div
            v-for="(data, index) in $store.state.chatObj[chatId].msgList || []"
            :key="index"
            class="flex mb-4 last:mb-0"
            :class="{ 'justify-end': data.isSelf }"
          >
            <!-- 头像 -->
            <el-avatar
              v-if="!data.isSelf"
              :src="data.ava_url"
              :size="45"
              :class="{ 'mt-5': data.name }"
              class="avatar flex-shrink-0 border-2 border-pink-200 shadow-sm transform hover:scale-110 transition-transform"
            />

            <!-- 消息内容 -->
            <div class="message-wrapper" :class="{ 'items-end': data.isSelf }">
              <p class="message-sender">{{ data.name }}</p>
              <div
                v-for="(msg, msgIndex) in data.message"
                :key="msgIndex"
                class="message-item"
              >
                <div
                  class="message-bubble"
                  style="max-width: 320px"
                  :class="{ 'message-bubble-self': data.isSelf }"
                >
                  <img
                    v-if="msg.type == 'img'"
                    :src="msg.msg"
                    referrerpolicy="no-referrer"
                    class="message-image"
                    style="max-width: 280px; max-height: 280px"
                  />
                  <span v-else class="message-text">{{ msg.msg }}</span>
                </div>
                <span class="message-time">{{ msg.time }}</span>
              </div>
            </div>

            <!-- 自己头像 -->
            <el-avatar
              v-if="data.isSelf"
              :src="data.ava_url"
              :size="45"
              class="avatar flex-shrink-0 border-2 border-blue-200 shadow-sm transform hover:scale-110 transition-transform"
            />
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div ref="inputArea" class="bg-white rounded-b-xl p-3 shadow-sm">
        <el-input
          v-model="message"
          :rows="3"
          type="textarea"
          resize="none"
          placeholder="输入消息..."
          class="mb-3"
          @keyup.enter.native="sendMessage"
        ></el-input>

        <div class="flex justify-end space-x-2">
          <MyButton
            text="清空"
            @click="message = ''"
            type="default"
            :rounded="'lg'"
            :shadow="'sm'"
            :height="35"
            :width="70"
            :fontSize="14"
          />
          <MyButton
            text="发送"
            @click="sendMessage"
            type="purple"
            :rounded="'lg'"
            :shadow="'md'"
            :glow="true"
            :height="35"
            :width="70"
            :fontSize="14"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash"
import MyButton from "../ui/MyButton.vue"

export default {
  name: "ChatWindow",
  components: { MyButton },
  data() {
    return {
      message: "",
      isStartChat: false,
      chatInfo: {},
      chatId: "default",
      reloadKey: 0,
      chatHeight: 400,
      windowHeight: window.innerHeight,
    }
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    this.$store.dispatch("initChatSocket")
    this.calculateChatHeight()
    this.debouncedResize = debounce(this.handleResize, 100)
    window.addEventListener("resize", this.debouncedResize)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.debouncedResize)
  },
  methods: {
    calculateChatHeight() {
      const chatWindow = this.$el
      const header = this.$refs.header
      const inputArea = this.$refs.inputArea

      if (!header || !inputArea) return

      // 获取各元素高度
      const headerHeight = header.offsetHeight
      const inputHeight = inputArea.offsetHeight

      // 计算可用高度
      const windowHeight = this.windowHeight
      const chatWindowTop = chatWindow.getBoundingClientRect().top
      const padding = 24 // 上下边距总和

      // 计算消息容器高度
      this.chatHeight = Math.max(
        200, // 最小高度
        windowHeight - chatWindowTop - headerHeight - inputHeight - padding - 60 // 额外20px缓冲
      )

      // 强制重新渲染以确保高度生效
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },

    handleResize() {
      this.windowHeight = window.innerHeight
      this.calculateChatHeight()
    },
    async sendMessage() {
      if (!this.message.trim()) return

      const loading = this.getLoading(".el-textarea")

      try {
        await this.$chatWebSocket.sendMessage(
          this.botInfo,
          this.chatInfo.group_id,
          this.chatInfo.user_id,
          this.message
        )
        this.message = ""
        this.reloadKey++
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } finally {
        loading.close()
      }
    },

    scrollToBottom() {
      const chatElement = document.getElementById("chat")
      if (chatElement) {
        chatElement.scrollTop = chatElement.scrollHeight
      }
    },

    startChat(data) {
      this.chatInfo = data
      const chatId = data.group_id || data.user_id
      this.chatId = chatId
      this.$store.commit("SET_CHAT_ID", chatId)
      this.$store.commit("ADD_CHAT_MSG", { chatId })
      this.isStartChat = true
      this.$nextTick(this.scrollToBottom)
      this.$nextTick(this.calculateChatHeight)
    },

    async clearMessage() {
      const result = await this.$cuteConfirm({
        title: "清空确认",
        message: `确认清空聊天记录?`,
        cancelButtonText: "我再想想",
        confirmButtonText: "清空内容",
      })
      if (result) {
        this.$store.commit("CLEAR_CHAT", this.chatId)
        this.$message.success({
          message: "清空记录成功!",
          iconClass: "el-icon-success",
          customClass: "cute-message",
        })
      }
    },
  },
}
</script>

<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
  min-height: 200px; /* 最小高度保证 */
}

#chat {
  flex: 1;
  overflow-y: auto;
  /* 移除之前的高度设置 */
}

/* 二次元风格弹窗 */
.confirm-box {
  border-radius: 16px !important;
  border: 2px solid #f9a8d4 !important;
  background-color: #fdf2f8 !important;
  font-family: '"Comic Sans MS", cursive' !important;
}

/* 美化滚动条 */
#chat::-webkit-scrollbar {
  width: 6px;
}

#chat::-webkit-scrollbar-track {
  background: rgba(251, 207, 232, 0.3);
  border-radius: 3px;
}

#chat::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.5);
  border-radius: 3px;
}

#chat::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.7);
}

/* 输入框样式 */
:deep(.el-textarea__inner) {
  border-radius: 12px !important;
  border: 1px solid #f3a3c3 !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.3s;
  font-family: '"Comic Sans MS", cursive' !important;
}

:deep(.el-textarea__inner:focus) {
  border-color: #ec4899 !important;
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2) !important;
}

/* 消息气泡动画 */
.message-bubble {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.message-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .chat-window {
    border-radius: 0;
  }

  #chat {
    max-height: 60vh;
  }

  :deep(.el-textarea__inner) {
    font-size: 14px;
  }
}

/* 消息包装器 */
.message-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin: 0 12px;
}

.message-wrapper.items-end {
  align-items: flex-end;
}

/* 发送者名称 */
.message-sender {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

/* 消息气泡 */
.message-bubble {
  padding: 8px 16px;
  border-radius: 16px;
  word-break: break-word;
  transition: all 0.2s;
  background-color: #fce7f3;
  color: #1f2937;
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: normal;
}

/* 自己的消息气泡 */
.message-bubble-self {
  background: linear-gradient(to right, #a78bfa, #f472b6);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 消息图片 */
.message-image {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.message-image:hover {
  transform: scale(1.05);
}

/* 消息文本 */
.message-text {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
}

/* 消息项容器 */
.message-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.message-item:last-child {
  margin-bottom: 0;
}

/* 消息时间 */
.message-time {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
  display: block;
}

/* 头像样式 */
.avatar {
  align-self: flex-start;
}
</style>

<style>
/* 可爱的消息提示框 */
.cute-message {
  border-radius: 12px !important;
  border: 1px solid #e9d5ff !important;
  background-color: #fff !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  font-family: '"Comic Sans MS", cursive' !important;
}

.cute-message .el-message__content {
  color: #7c3aed !important;
}

.cute-message.el-message--success {
  border-color: #a7f3d0 !important;
}

.cute-message.el-message--info {
  border-color: #bfdbfe !important;
}

.cute-message.el-message--warning {
  border-color: #fde68a !important;
}

.cute-message.el-message--error {
  border-color: #fecaca !important;
}
</style>
