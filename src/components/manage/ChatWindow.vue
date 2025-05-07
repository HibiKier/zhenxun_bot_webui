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
          text="清空"
          @click="clearMessage"
          type="pink"
          :rounded="'lg'"
          :shadow="'sm'"
          :height="30"
          :width="60"
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
              class="flex-shrink-0 border-2 border-pink-200 shadow-sm transform hover:scale-110 transition-transform"
            />

            <!-- 消息内容 -->
            <div
              class="flex flex-col max-w-[80%] mx-3"
              :class="{ 'items-end': data.isSelf }"
            >
              <p class="text-sm text-gray-500 mb-1">{{ data.name }}</p>
              <div
                class="px-4 py-2 rounded-2xl break-words transition-all duration-200"
                :class="{
                  'bg-pink-100 text-gray-800': !data.isSelf,
                  'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md':
                    data.isSelf,
                }"
              >
                <div v-for="(msg, msgIndex) in data.message" :key="msgIndex">
                  <img
                    v-if="msg.type == 'img'"
                    :src="msg.msg"
                    class="max-w-full rounded-lg shadow-sm transform hover:scale-105 transition-transform"
                    :style="{
                      width: msg.width + 'px',
                      height: msg.height + 'px',
                    }"
                  />
                  <span v-else class="whitespace-pre-wrap">{{ msg.msg }}</span>
                </div>
              </div>
            </div>

            <!-- 自己头像 -->
            <el-avatar
              v-if="data.isSelf"
              :src="data.ava_url"
              :size="45"
              class="flex-shrink-0 border-2 border-blue-200 shadow-sm transform hover:scale-110 transition-transform"
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
import { debounce } from 'lodash'
import MyButton from '../ui/MyButton.vue'

export default {
  name: 'ChatWindow',
  components: { MyButton },
  data() {
    return {
      message: '',
      isStartChat: false,
      chatInfo: {},
      chatId: 'default',
      reloadKey: 0,
      chatHeight: 400,
      windowHeight: window.innerHeight,
    }
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    this.$store.dispatch('initChatSocket')
    this.calculateChatHeight()
    this.debouncedResize = debounce(this.handleResize, 100)
    window.addEventListener('resize', this.debouncedResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.debouncedResize)
  },
  methods: {
    calculateChatHeight() {
      const chatWindow = this.$el
      const header = this.$refs.header
      const inputArea = this.$refs.inputArea

      console.log('header', header)
      console.log('inputArea', inputArea)

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

      const loading = this.getLoading('.el-textarea')

      try {
        await this.$chatWebSocket.sendMessage(
          this.botInfo,
          this.chatInfo.group_id,
          this.chatInfo.user_id,
          this.message
        )
        this.message = ''
        this.reloadKey++
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } finally {
        loading.close()
      }
    },

    scrollToBottom() {
      const chatElement = document.getElementById('chat')
      if (chatElement) {
        chatElement.scrollTop = chatElement.scrollHeight
      }
    },

    startChat(data) {
      this.chatInfo = data
      const chatId = data.group_id || data.user_id
      this.chatId = chatId
      this.$store.commit('SET_CHAT_ID', chatId)
      this.$store.commit('ADD_CHAT_MSG', { chatId })
      this.isStartChat = true
      this.$nextTick(this.scrollToBottom)
      this.$nextTick(this.calculateChatHeight)
    },

    clearMessage() {
      this.$confirm('确认清空聊天记录?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        customClass: 'confirm-box',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        iconClass: 'el-icon-warning text-red-500',
      })
        .then(() => {
          this.$store.commit('CLEAR_CHAT', this.chatId)
          this.$message.success({
            message: '清空记录成功!',
            iconClass: 'el-icon-success',
            customClass: 'cute-message',
          })
        })
        .catch(() => {
          this.$message.info({
            message: '已取消操作',
            iconClass: 'el-icon-info',
            customClass: 'cute-message',
          })
        })
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
    padding: 12px;
    border-radius: 0;
  }

  #chat {
    max-height: 60vh;
  }

  :deep(.el-textarea__inner) {
    font-size: 14px;
  }
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
