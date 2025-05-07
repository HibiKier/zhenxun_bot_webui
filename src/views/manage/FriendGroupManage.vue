<template>
  <div
    ref="main"
    class="friend-manager-container w-full flex flex-col bg-gradient-to-br from-pink-50 to-purple-100 overflow-hidden"
  >
    <!-- 顶部导航栏 -->
    <div
      ref="topHeader"
      class="header-bar h-14 flex items-center justify-between px-4 bg-white bg-opacity-80 backdrop-blur-sm border-b border-pink-200"
    >
      <!-- 标题 -->
      <div class="flex items-center">
        <h1
          class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
        >
          <span class="inline-block transform rotate-3">🌸</span>
          好友与群组
          <span class="inline-block transform -rotate-3">🌸</span>
        </h1>
      </div>

      <!-- 请求管理按钮 (桌面端) -->
      <div class="hidden md:block">
        <el-badge
          :value="requestCount"
          :hidden="requestCount <= 0"
          class="transform hover:scale-105 transition-transform"
        >
          <button
            @click="openRequest"
            class="flex items-center px-4 py-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition-colors shadow-sm"
          >
            <svg-icon icon-class="request" class="w-5 h-5 mr-2" />
            <span class="text-sm font-medium hidden md:block">请求管理</span>
          </button>
        </el-badge>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col md:flex-row overflow-hidden p-2 gap-2">
      <!-- 左侧好友列表 -->
      <div
        class="data-list-container w-full md:w-1/4 lg:w-1/5 h-1/3 md:h-full bg-white rounded-xl shadow-md transition-all duration-300"
        :class="{
          'hidden md:block': !showList,
          'absolute z-20 top-16 left-2 right-2 h-2/3 md:relative md:top-0 md:left-0 md:right-0 md:h-full':
            showList,
        }"
      >
        <DataList @getDetail="getDetail" class="h-full" ref="dataList" />
      </div>

      <!-- 中间聊天窗口 -->
      <div
        class="chat-container flex-1 h-1/3 md:h-full bg-white rounded-xl shadow-md overflow-hidden"
      >
        <ChatWindow ref="chatWindow" class="h-full" />
      </div>

      <!-- 右侧详情信息 -->
      <div
        class="detail-container w-full md:w-1/3 lg:w-1/4 h-1/3 md:h-full bg-white rounded-xl shadow-md overflow-auto transition-all duration-300"
        :class="{
          'hidden md:block': !showDetail,
          'absolute z-20 top-16 left-2 right-2 h-2/3 md:relative md:top-0 md:left-0 md:right-0 md:h-full':
            showDetail,
        }"
      >
        <DetailInfo
          ref="detailInfo"
          @startChat="startChat"
          class="h-full"
          :style="{ height: computedHeight + 'px' }"
        />
      </div>
    </div>

    <!-- 移动端底部操作栏 -->
    <div
      class="md:hidden h-16 bg-white bg-opacity-90 backdrop-blur-sm border-t border-pink-200 flex items-center justify-around px-4"
    >
      <!-- 列表切换按钮 -->
      <button
        @click="toggleList"
        class="flex flex-col items-center justify-center p-2 rounded-lg transition-colors"
        :class="{ 'text-pink-600': showList, 'text-gray-500': !showList }"
      >
        <svg-icon
          :icon-class="showList ? 'friends-solid' : 'friends'"
          class="w-6 h-6"
        />
        <span class="text-xs mt-1">好友列表</span>
      </button>

      <!-- 请求管理按钮 (移动端) -->
      <div class="relative">
        <el-badge
          :value="requestCount"
          :hidden="requestCount <= 0"
          class="absolute -top-2 -right-2"
        >
          <button
            @click="openRequest"
            class="flex flex-col items-center justify-center p-2 rounded-lg text-purple-600 transition-colors"
          >
            <svg-icon icon-class="request" class="w-6 h-6" />
          </button>
        </el-badge>
      </div>

      <!-- 详情切换按钮 -->
      <button
        @click="toggleDetail"
        class="flex flex-col items-center justify-center p-2 rounded-lg transition-colors"
        :class="{ 'text-purple-600': showDetail, 'text-gray-500': !showDetail }"
      >
        <svg-icon
          :icon-class="showDetail ? 'info-solid' : 'info'"
          class="w-6 h-6"
        />
        <span class="text-xs mt-1">详细信息</span>
      </button>
    </div>
    <RequestDialog
      v-if="requestDialogVisible"
      @close="closeRequest"
      class="z-50"
    />
  </div>
</template>

<script>
import { getHeaderHeight } from '@/utils/utils'
import ChatWindow from '@/components/manage/ChatWindow.vue'
import DataList from '@/components/manage/DataList.vue'
import DetailInfo from '@/components/manage/DetailInfo.vue'
import RequestDialog from '@/components/manage/RequestDialog.vue'

export default {
  name: 'FriendGroupMana',
  components: {
    DataList,
    ChatWindow,
    DetailInfo,
    RequestDialog,
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      requestDialogVisible: false,
      showList: false,
      showDetail: false,
      requestCount: 0,
      height: 0,
    }
  },
  computed: {
    computedHeight() {
      if (!this.height) {
        this.computeHeight()
      }
      return this.height
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.fetchRequestCount()
    this.getRequestCount()
  },
  methods: {
    getRequestCount() {
      this.getRequest(`${this.$root.prefix}/manage/get_request_count`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.requestCount = resp.data.friend_count + resp.data.group_count
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    computeHeight() {
      if (this.$refs.main) {
        this.height =
          this.$refs.main -
          getHeaderHeight() -
          this.$refs.topHeader.offsetHeight
      } else {
        this.height = window.innerHeight - getHeaderHeight() - 112
      }
    },
    openRequest() {
      this.requestDialogVisible = true
    },
    closeRequest() {
      this.requestDialogVisible = false
      this.$refs.dataList.refresh()
    },
    handleResize() {
      this.windowHeight = window.innerHeight
    },
    fetchRequestCount() {
      this.getRequest(`${this.$root.prefix}/manage/get_request_count`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.requestCount = resp.data.friend_count + resp.data.group_count
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    startChat(data) {
      this.$refs.chatWindow.startChat(data)
      this.showList = false
      this.showDetail = false
    },
    getDetail(type, id) {
      if (type == 'private') {
        this.$refs.detailInfo.getFriend(id)
      } else {
        this.$refs.detailInfo.getGroup(id)
      }
      this.showDetail = true
      this.showList = false
    },
    toggleList() {
      this.showList = !this.showList
      if (this.showList) this.showDetail = false
    },
    toggleDetail() {
      this.showDetail = !this.showDetail
      if (this.showDetail) this.showList = false
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style scoped>
.friend-manager-container {
  position: relative;
  background-image: radial-gradient(
      circle at 10% 20%,
      rgba(251, 207, 232, 0.2) 0%,
      transparent 20%
    ),
    radial-gradient(
      circle at 90% 80%,
      rgba(216, 180, 254, 0.2) 0%,
      transparent 20%
    );
}

/* 滚动条美化 */
.detail-container::-webkit-scrollbar {
  width: 6px;
}

.detail-container::-webkit-scrollbar-track {
  background: rgba(251, 207, 232, 0.3);
  border-radius: 3px;
}

.detail-container::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.5);
  border-radius: 3px;
}

.detail-container::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.7);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .data-list-container,
  .detail-container {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }

  .chat-container {
    height: calc(100vh - 120px);
  }

  .header-bar {
    height: 12;
    padding: 0 2;
  }
}
</style>
