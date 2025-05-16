<template>
  <div
    ref="main"
    class="friend-manager-container w-full flex flex-col"
    :style="{
      height: 'calc(100vh - 77px)',
      background: 'var(--el-bg-color-page)',
    }"
  >
    <!-- 顶部导航栏 -->
    <div
      ref="topHeader"
      class="header-bar h-14 flex-shrink-0 flex items-center justify-between px-4"
      :style="{
        background: 'var(--el-bg-color-overlay)',
        borderBottom: '1px solid var(--el-border-color-light)',
        backdropFilter: 'blur(8px)',
      }"
    >
      <!-- 标题 -->
      <div class="flex items-center">
        <h1
          class="text-xl font-bold"
          :style="{ color: 'var(--el-color-primary)' }"
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
            class="flex items-center px-4 py-2 rounded-full transition-colors shadow-sm"
            :style="{
              background: 'var(--el-color-primary-light-9)',
              color: 'var(--el-color-primary)',
            }"
          >
            <svg-icon icon-class="request" class="w-5 h-5 mr-2" />
            <span class="text-sm font-medium hidden md:block">请求管理</span>
          </button>
        </el-badge>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col md:flex-row p-2 gap-2 min-h-0">
      <!-- 左侧好友列表 -->
      <div
        class="data-list-container w-full md:w-1/4 lg:w-1/5 rounded-xl transition-all duration-300 flex-shrink-0"
        :style="{
          background: 'var(--el-bg-color)',
          boxShadow: 'var(--el-box-shadow-light)',
        }"
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
        class="chat-container flex-1 rounded-xl flex-shrink-0"
        :style="{
          background: 'var(--el-bg-color)',
          boxShadow: 'var(--el-box-shadow-light)',
        }"
      >
        <ChatWindow ref="chatWindow" class="h-full" />
      </div>

      <!-- 右侧详情信息 -->
      <div
        class="detail-container w-full md:w-1/3 lg:w-1/4 rounded-xl transition-all duration-300 flex-shrink-0"
        :style="{
          background: 'var(--el-bg-color)',
          boxShadow: 'var(--el-box-shadow-light)',
        }"
        :class="{
          'hidden md:block': !showDetail,
          'absolute z-20 top-16 left-2 right-2 h-2/3 md:relative md:top-0 md:left-0 md:right-0 md:h-full':
            showDetail,
        }"
      >
        <DetailInfo ref="detailInfo" @startChat="startChat" class="h-full" />
      </div>
    </div>

    <!-- 移动端底部操作栏 -->
    <div
      class="md:hidden h-16 flex-shrink-0 flex items-center justify-around px-4"
      :style="{
        background: 'var(--el-bg-color-overlay)',
        borderTop: '1px solid var(--el-border-color-light)',
        backdropFilter: 'blur(8px)',
      }"
    >
      <!-- 列表切换按钮 -->
      <button
        @click="toggleList"
        class="flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-20"
        :style="{
          color: showList
            ? 'var(--el-color-primary)'
            : 'var(--el-text-color-secondary)',
        }"
      >
        <span class="text-xs">好友列表</span>
      </button>

      <!-- 请求管理按钮 (移动端) -->
      <div class="relative w-20">
        <el-badge
          :value="requestCount"
          :hidden="requestCount <= 0"
          class="absolute -top-4"
          style="right: 25px"
        >
          <button
            @click="openRequest"
            class="flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-full"
            :style="{ color: 'var(--el-color-primary)' }"
          >
            <svg-icon icon-class="request" class="w-6 h-6 mb-1" />
          </button>
        </el-badge>
      </div>

      <!-- 详情切换按钮 -->
      <button
        @click="toggleDetail"
        class="flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-20"
        :style="{
          color: showDetail
            ? 'var(--el-color-primary)'
            : 'var(--el-text-color-secondary)',
        }"
      >
        <span class="text-xs">详细信息</span>
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
import { getHeaderHeight } from "@/utils/utils"
import ChatWindow from "@/components/manage/ChatWindow.vue"
import DataList from "@/components/manage/DataList.vue"
import DetailInfo from "@/components/manage/DetailInfo.vue"
import RequestDialog from "@/components/manage/RequestDialog.vue"

export default {
  name: "FriendGroupMana",
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
    window.addEventListener("resize", this.handleResize)
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
      if (type == "private") {
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
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style scoped>
.friend-manager-container {
  position: relative;
  background-image: radial-gradient(
      circle at 10% 20%,
      var(--el-color-primary-light-8) 0%,
      transparent 20%
    ),
    radial-gradient(
      circle at 90% 80%,
      var(--el-color-primary-light-7) 0%,
      transparent 20%
    );
}

/* 滚动条美化 */
.detail-container::-webkit-scrollbar {
  width: 6px;
}

.detail-container::-webkit-scrollbar-track {
  background: var(--el-color-primary-light-9);
  border-radius: 3px;
}

.detail-container::-webkit-scrollbar-thumb {
  background: var(--el-color-primary-light-5);
  border-radius: 3px;
}

.detail-container::-webkit-scrollbar-thumb:hover {
  background: var(--el-color-primary-light-3);
}

/* PC端样式 */
@media (min-width: 769px) {
  .friend-manager-container {
    overflow: hidden;
  }

  .data-list-container,
  .chat-container,
  .detail-container {
    overflow: hidden;
  }

  .data-list-container {
    overflow-y: auto;
  }

  .chat-container {
    overflow: hidden;
  }

  .detail-container {
    overflow-y: auto;
  }
}

/* 移动端样式优化 */
@media (max-width: 768px) {
  .friend-manager-container {
    overflow: hidden;
  }

  .data-list-container,
  .detail-container {
    box-shadow: var(--el-box-shadow-light);
    max-height: calc(100vh - 196px);
    overflow-y: auto;
  }

  .chat-container {
    height: calc(100vh - 196px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 8px;
    right: 8px;
    bottom: 72px;
  }

  .header-bar {
    height: 56px;
    padding: 0 16px;
  }

  /* 底部操作栏样式调整 */
  .md\:hidden {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--el-bg-color-overlay);
    backdrop-filter: blur(8px);
    z-index: 40;
  }
}
</style>
