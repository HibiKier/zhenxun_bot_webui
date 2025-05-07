<template>
  <el-dialog
    class="moe-dialog"
    :visible="true"
    @close="close"
    custom-class="moe-dialog-container"
  >
    <div class="moe-container">
      <!-- 顶部标题区 -->
      <div class="header-box">
        <h3 class="title">
          <span class="icon">🌸</span>
          好友与群组请求
          <span class="icon">🌸</span>
        </h3>
        <div class="header-buttons">
          <cute-button
            @click="clearRequest('FRIEND')"
            size="sm"
            icon="clear3"
            type="danger"
          >
            <i class="icon-trash"></i> 清空好友
          </cute-button>
          <cute-button
            @click="clearRequest('GROUP')"
            size="sm"
            icon="clear3"
            type="danger"
          >
            <i class="icon-trash"></i> 清空群组
          </cute-button>
        </div>
      </div>

      <!-- 主体内容 (标签页形式) -->
      <div class="tab-container">
        <div class="tabs">
          <button
            @click="activeTab = 'friend'"
            :class="{ active: activeTab === 'friend' }"
          >
            <i class="icon-heart"></i> 好友请求
            <span class="badge">{{ dataObj.friend.length }}</span>
          </button>
          <button
            @click="activeTab = 'group'"
            :class="{ active: activeTab === 'group' }"
          >
            <i class="icon-group"></i> 群组请求
            <span class="badge">{{ dataObj.group.length }}</span>
          </button>
        </div>

        <!-- 好友请求列表 -->
        <div v-show="activeTab === 'friend'" class="request-list friend-list">
          <div v-if="!dataObj.friend.length" class="empty-state">
            <p>暂时没有好友请求哦 (≧▽≦)</p>
          </div>

          <div
            v-for="(data, index) in dataObj.friend"
            :key="data.flag"
            class="request-card"
            :style="{ 'animation-delay': `${index * 0.05}s` }"
          >
            <div class="user-info">
              <div class="avatar-wrapper">
                <el-avatar :src="data.ava_url" class="moe-avatar"></el-avatar>
                <div class="online-dot" v-if="data.isOnline"></div>
              </div>
              <div class="user-details">
                <p class="username">{{ data.remark || data.nickname }}</p>
                <p class="userid">ID: {{ data.id }}</p>
                <p class="message" v-if="data.message">
                  留言: {{ data.message }}
                </p>
              </div>
            </div>
            <div class="action-buttons">
              <cute-button
                @click="handleApprove(data)"
                type="primary"
                icon="true"
                size="sm"
              >
                同意
              </cute-button>
              <cute-button
                @click="handleRefuse(data)"
                type="danger"
                icon="false"
                size="sm"
              >
                拒绝
              </cute-button>
              <cute-button
                @click="handleIgnore(data)"
                type="normal"
                icon="ignore"
                size="sm"
              >
                忽略
              </cute-button>
            </div>
          </div>
        </div>

        <!-- 群组请求列表 -->
        <div v-show="activeTab === 'group'" class="request-list group-list">
          <div v-if="!dataObj.group.length" class="empty-state">
            <p>暂时没有群组请求呢 (◕‿◕✿)</p>
          </div>

          <div
            v-for="(data, index) in dataObj.group"
            :key="data.flag"
            class="request-card"
            :style="{ 'animation-delay': `${index * 0.05}s` }"
          >
            <div class="user-info">
              <div class="avatar-wrapper">
                <el-avatar :src="data.ava_url" class="moe-avatar"></el-avatar>
                <div class="member-count">
                  <i class="icon-user"></i> {{ data.memberCount }}
                </div>
              </div>
              <div class="user-details">
                <p class="username">{{ data.groupName }}</p>
                <p class="userid">群ID: {{ data.id }}</p>
                <p class="inviter" v-if="data.inviter">
                  邀请人: {{ data.inviter }}
                </p>
              </div>
            </div>
            <div class="action-buttons">
              <cute-button
                @click="handleApprove(data)"
                type="primary"
                icon="true"
                size="sm"
              >
                同意
              </cute-button>
              <cute-button
                @click="handleRefuse(data)"
                type="danger"
                icon="false"
                size="sm"
              >
                拒绝
              </cute-button>
              <cute-button
                @click="handleIgnore(data)"
                type="normal"
                icon="ignore"
                size="sm"
              >
                忽略
              </cute-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="footer-decoration">
        <div class="paw left-paw"></div>
        <div class="paw right-paw"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import CuteButton from '../ui/CuteButton.vue'

export default {
  components: { CuteButton },
  data() {
    return {
      activeTab: 'friend',
      sizeMana: {
        avatarSize: 50,
      },
      dataObj: {
        friend: [],
        group: [],
      },
      loading: {
        clearFriend: false,
        clearGroup: false,
      },
    }
  },
  mounted() {
    this.fetchRequests()
    window.addEventListener('resize', this.handleResize)
    this.initFontSize()
  },
  methods: {
    initFontSize() {
      const isMobile = window.innerWidth < 768
      this.sizeMana = {
        titleText: isMobile ? 16 : 18,
        nameText: isMobile ? 18 : 20,
        tipText: isMobile ? 12 : 14,
        imageSize: isMobile ? 36 : 40,
      }
    },

    async fetchRequests() {
      const loading = this.getLoading('.el-dialog')
      this.getRequest(`${this.$root.prefix}/manage/get_request_list`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.dataObj = resp.data
            }
          } else {
            this.$message.error(resp.info)
          }
          loading.close()
        }
      )
    },

    async clear_request(request_type) {
      const result = await this.$cuteConfirm({
        title: '清空确认',
        message: `确定要清空当前全局请求吗?`,
        cancelButtonText: '我再想想',
        confirmButtonText: '全部清空',
      })
      if (result) {
        try {
          const loading = this.getLoading('.el-dialog')
          this.postRequest(`${this.$root.prefix}/manage/clear_request`, {
            request_type,
          }).then((resp) => {
            if (resp.suc) {
              if (resp.warning) {
                this.$message.warning(resp.warning)
              } else {
                this.$message.success(resp.info)
              }
            } else {
              this.$message.error(resp.info)
            }
            loading.close()
            this.fetchRequests()
          })
        } catch (error) {
          this.$message.error('卸载失败: ' + error.message)
        }
      } else {
        console.log('取消清空')
      }
    },
    handleApprove(data) {
      const loading = this.getLoading('.el-dialog')
      this.postRequest(`${this.$root.prefix}/manage/approve_request`, {
        bot_id: data.bot_id,
        id: data.oid,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
        this.fetchRequests()
      })
    },
    handleRefuse(data) {
      const loading = this.getLoading('.el-dialog')
      this.postRequest(`${this.$root.prefix}/manage/refuse_request`, {
        bot_id: data.bot_id,
        id: data.oid,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
        this.fetchRequests()
      })
    },
    handleIgnore(data) {
      const loading = this.getLoading('.el-dialog')
      this.postRequest(`${this.$root.prefix}/manage/delete_request`, {
        id: data.oid,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
        this.fetchRequests()
      })
    },

    close() {
      this.$emit('close')
    },
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style>
/* 保留必要的动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>

<style scoped>
/* 对话框基础样式 */
.moe-dialog ::v-deep .el-dialog {
  @apply overflow-visible rounded-2xl border-pink-300 bg-pink-50 shadow-lg;
  border-width: 3px;
  border-style: solid;
  box-shadow: 0 10px 30px rgba(255, 182, 216, 0.3);
}

.moe-dialog ::v-deep .el-dialog__header {
  @apply hidden;
}

.moe-dialog ::v-deep .el-dialog__body {
  @apply p-0 relative;
  background: linear-gradient(to bottom, #fff9fc, #f8f4ff);
  border-radius: 20px;
}

.moe-container {
  @apply p-6 relative rounded-2xl;
}

/* 头部样式 */
.header-box {
  @apply text-center mb-5 relative;
}

.header-box .title {
  @apply text-pink-500 font-bold mb-4 text-xl;
  text-shadow: 1px 1px 2px rgba(255, 107, 158, 0.2);
}

.header-box .title .icon {
  @apply inline-block mx-2;
  animation: float 2s ease-in-out infinite;
}

.header-buttons {
  @apply flex justify-center gap-2 mt-3;
}

/* 标签页样式 */
.tab-container .tabs {
  @apply flex border-b-2 border-pink-200 mb-4;
}

.tab-container .tabs button {
  @apply flex-1 py-3 bg-transparent border-none relative text-purple-300 font-bold text-sm cursor-pointer transition-all;
}

.tab-container .tabs button i {
  @apply mr-1;
}

.tab-container .tabs button .badge {
  @apply bg-pink-500 text-white rounded-full px-2 text-xs ml-1;
}

.tab-container .tabs button.active {
  @apply text-pink-500;
}

.tab-container .tabs button.active::after {
  content: '';
  @apply absolute bottom-0 left-0 w-full;
  height: 3px;
  background: linear-gradient(to right, #ff6b9e, #d8a8ff);
  border-radius: 3px 3px 0 0;
}

/* 请求列表样式 */
.request-list {
  max-height: 50vh;
  @apply overflow-y-auto pr-1;
  min-height: 300px;
}

.request-list::-webkit-scrollbar {
  width: 6px;
}

.request-list::-webkit-scrollbar-track {
  @apply bg-pink-100 rounded;
}

.request-list::-webkit-scrollbar-thumb {
  @apply bg-pink-300 rounded;
}

.empty-state {
  @apply text-center py-8 text-purple-300;
}

.empty-state p {
  @apply mt-3 text-sm;
}

/* 请求卡片样式 */
.request-card {
  @apply bg-white rounded-xl p-4 mb-3 shadow-md;
  border: 1px solid #ffd6e8;
  opacity: 0;
  animation: fadeInUp 0.5s forwards;
  transition: all 0.3s;
}

.request-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 182, 216, 0.3);
}

/* 用户信息样式 */
.user-info {
  @apply flex items-center mb-3;
}

.avatar-wrapper {
  @apply relative mr-4;
}

.moe-avatar {
  width: 50px;
  height: 50px;
  @apply border-2 border-pink-200;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.05);
}

.online-dot {
  @apply absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full;
}

.member-count {
  @apply absolute -bottom-2 -right-2 bg-purple-300 text-white rounded-full px-1 text-xs border-2 border-white;
}

.user-details {
  @apply flex-1;
}

.user-details .username {
  @apply text-pink-500 font-bold mb-1 text-base;
}

.user-details .userid,
.user-details .message,
.user-details .inviter {
  @apply text-purple-300 text-xs mb-0.5;
}

.action-buttons {
  @apply flex justify-end gap-2;
}

/* 底部装饰样式 */
.footer-decoration {
  @apply absolute -bottom-4 left-0 w-full flex justify-between px-5;
}

.paw {
  @apply w-7 h-6 bg-pink-300 rounded-full relative;
}

.paw::before {
  content: '';
  @apply absolute w-2 h-2 bg-white rounded-full;
}

.left-paw {
  transform: rotate(30deg);
}

.left-paw::before {
  @apply top-1 right-1;
}

.left-paw::after {
  content: '';
  @apply absolute w-2 h-2 bg-white rounded-full top-3 right-2;
}

.right-paw {
  transform: rotate(-30deg);
}

.right-paw::before {
  @apply top-1 left-1;
}

.right-paw::after {
  content: '';
  @apply absolute w-2 h-2 bg-white rounded-full top-3 left-2;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .moe-dialog ::v-deep .el-dialog {
    width: 90%;
    max-width: none;
  }

  .header-box .title {
    @apply text-lg;
  }

  .request-card {
    @apply p-3;
  }

  .user-info {
    @apply flex-col items-start;
  }

  .avatar-wrapper {
    @apply mr-0 mb-2;
  }

  .action-buttons {
    @apply justify-center mt-2;
  }

  .footer-decoration {
    @apply hidden;
  }
}
</style>
