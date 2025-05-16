<template>
  <div
    class="fg-list p-4 h-full overflow-hidden"
    :style="{
      background: 'var(--el-bg-color-page)',
    }"
  >
    <!-- 好友/群组切换标签 -->
    <div
      class="flex rounded-lg shadow-inner p-1 mb-4"
      :style="{ background: 'var(--el-bg-color)' }"
    >
      <div
        :class="[
          'flex-1 text-center py-2 rounded-md cursor-pointer transition-all',
        ]"
        :style="{
          background:
            activeBtn === 'private' ? 'var(--el-color-primary)' : 'transparent',
          color:
            activeBtn === 'private'
              ? 'var(--el-color-white)'
              : 'var(--el-color-primary)',
          boxShadow:
            activeBtn === 'private' ? 'var(--el-box-shadow-light)' : 'none',
        }"
        @click="clickListType('private')"
      >
        好友({{
          botInfo.friend_count > 0
            ? botInfo.friend_count - 1
            : botInfo.friend_count
        }})
      </div>
      <div
        class="w-px mx-1 my-2"
        :style="{ background: 'var(--el-border-color)' }"
      ></div>
      <div
        :class="[
          'flex-1 text-center py-2 rounded-md cursor-pointer transition-all',
        ]"
        :style="{
          background:
            activeBtn === 'group' ? 'var(--el-color-primary)' : 'transparent',
          color:
            activeBtn === 'group'
              ? 'var(--el-color-white)'
              : 'var(--el-color-primary)',
          boxShadow:
            activeBtn === 'group' ? 'var(--el-box-shadow-light)' : 'none',
        }"
        @click="clickListType('group')"
      >
        群组({{ botInfo.group_count }})
      </div>
    </div>

    <!-- 列表内容 -->
    <div
      class="data-list-container rounded-xl p-2 overflow-y-auto"
      :style="{
        height: 'calc(100% - 65px)',
        background: 'var(--el-fill-color-blank)',
        boxShadow: 'var(--el-box-shadow-light)',
      }"
    >
      <div
        v-for="data in dataList"
        :key="data.id"
        :class="[
          'data-item flex items-center p-3 rounded-lg mb-2 transition-all',
          { selected: detailId === data.id },
        ]"
        :style="{
          background:
            detailId === data.id
              ? 'var(--el-color-primary-light-3)'
              : 'var(--el-fill-color-blank)',
          borderLeft:
            detailId === data.id ? '4px solid var(--el-color-primary)' : 'none',
          color:
            detailId === data.id
              ? 'var(--el-color-white)'
              : 'var(--el-text-color-primary)',
        }"
      >
        <!-- 头像和基本信息 -->
        <div class="flex items-center flex-1 min-w-0" @click="getDetail(data)">
          <el-avatar
            :src="data.ava_url"
            :size="50"
            class="flex-shrink-0 shadow-sm"
            :style="{ border: '2px solid var(--el-border-color-light)' }"
          >
            <i class="el-icon-user" v-if="!data.ava_url"></i>
          </el-avatar>

          <div class="ml-3 min-w-0">
            <p
              class="font-semibold truncate"
              :style="{
                color:
                  detailId === data.id
                    ? 'var(--el-color-white)'
                    : 'var(--el-text-color-primary)',
              }"
            >
              {{ data.remark || data.nickname || data.group_name }}
            </p>
            <p
              class="text-sm mt-1"
              :style="{
                color:
                  detailId === data.id
                    ? 'var(--el-color-white)'
                    : 'var(--el-text-color-secondary)',
              }"
            >
              ID: {{ data.id }}
            </p>
          </div>
        </div>

        <!-- 未读消息标记 -->
        <div
          v-if="getUnreadCount(data.id)"
          class="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-2"
          :style="{
            background:
              detailId === data.id
                ? 'var(--el-color-white)'
                : 'var(--el-color-danger)',
            color:
              detailId === data.id
                ? 'var(--el-color-primary)'
                : 'var(--el-color-white)',
          }"
        >
          {{ getUnreadCount(data.id) }}
        </div>

        <!-- 更多操作菜单 -->
        <el-dropdown
          trigger="click"
          @command="(c) => handleCommand(c, data.id)"
          class="ml-2"
        >
          <div
            class="p-1 rounded-full transition-colors"
            :style="{
              color:
                detailId === data.id
                  ? 'var(--el-color-white)'
                  : 'var(--el-text-color-secondary)',
            }"
          >
            <svg-icon icon-class="more" class="w-5 h-5" />
          </div>

          <el-dropdown-menu
            slot="dropdown"
            class="rounded-lg"
            :style="{
              boxShadow: 'var(--el-box-shadow)',
              border: '1px solid var(--el-border-color-light)',
            }"
          >
            <el-dropdown-item
              command="delete"
              :style="{
                color: 'var(--el-color-danger)',
                '&:hover': {
                  background: 'var(--el-color-danger-light-9)',
                },
              }"
            >
              <i class="el-icon-delete mr-2"></i>
              {{ activeBtn == "private" ? "删除好友" : "退出群组" }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from "../SvgIcon/SvgIcon.vue"

export default {
  name: "DataList",
  components: { SvgIcon },
  data() {
    return {
      dataList: [],
      activeBtn: "private",
      botInfo: {},
      requestCount: 0,
      detailId: null,
    }
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    this.refresh()
    window.sortFriendGroupList = this.sortFriendGroupList
  },
  methods: {
    sortFriendGroupList(type) {
      if (type == this.activeBtn && this.dataList.length) {
        this.dataList.forEach((e) => {
          const chat = this.$store.state.chatObj[e.id]
          if (chat) {
            e.time = chat.time
          }
        })
        this.dataList = this.dataList.sort((a, b) => {
          return a.time < b.time ? 1 : -1
        })
      }
    },
    getUnreadCount(id) {
      const chat = this.$store.state.chatObj[id]
      if (chat) {
        const unreadCount = chat.unreadCount
        if (unreadCount > 99) {
          return "99+"
        }
        return chat.unreadCount
      }
    },
    getDetail(data) {
      this.detailId = data.id
      this.$emit("getDetail", this.activeBtn, data.id)
      this.$store.commit("READ_CHAT", data.id)
    },
    refresh() {
      if (this.activeBtn == "private") {
        this.getFriendList()
      } else {
        this.getGroupList()
      }
    },
    clickListType(type) {
      this.activeBtn = type
      if (type == "private") {
        this.getFriendList()
      } else {
        this.getGroupList()
      }
    },
    handleCommand(command, id) {
      if (command == "delete") {
        this.deleteHandle(id)
      }
    },
    deleteHandle(id) {
      this.$confirm("确认删除/退出?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: true,
        type: "warning",
        customClass: "confirm-box",
        confirmButtonClass: "el-button--danger",
        iconClass: "el-icon-warning text-red-500",
      }).then(() => {
        let url = null
        let data = null
        if (this.activeBtn == "private") {
          url = "delete_friend"
          data = { bot_id: this.botInfo.self_id, user_id: id }
        } else {
          url = "leave_group"
          data = { bot_id: this.botInfo.self_id, group_id: id }
        }
        this.postRequest(`${this.$root.prefix}/manage/${url}`, data).then(
          (resp) => {
            if (resp.suc) {
              if (resp.warning) {
                this.$message.warning(resp.warning)
              } else {
                this.$message.success(resp.info)
                setTimeout(() => {
                  this.refresh()
                }, 500)
              }
            } else {
              this.$message.error(resp.info)
            }
          }
        )
      })
    },
    getGroupList() {
      const loading = this.getLoading(".data-list-container")
      this.getRequest(`${this.$root.prefix}/manage/get_group_list`, {
        bot_id: this.botInfo.self_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.dataList = resp.data.map((e) => {
              return { id: e.group_id, time: 0, ...e }
            })
            this.sortFriendGroupList("group")
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    getFriendList() {
      const loading = this.getLoading(".data-list-container")
      this.getRequest(`${this.$root.prefix}/manage/get_friend_list`, {
        bot_id: this.botInfo.self_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.dataList = resp.data.map((e) => {
              return { id: e.user_id, time: 0, ...e }
            })
            this.sortFriendGroupList("private")
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
  },
}
</script>

<style scoped>
/* 二次元风格弹窗 */
.confirm-box {
  border-radius: 16px !important;
  border: 2px solid var(--el-border-color) !important;
  background-color: var(--el-bg-color) !important;
}

/* 滚动条美化 */
.data-list-container::-webkit-scrollbar {
  width: 6px;
}

.data-list-container::-webkit-scrollbar-track {
  background: var(--el-color-primary-light-9);
  border-radius: 3px;
}

.data-list-container::-webkit-scrollbar-thumb {
  background: var(--el-color-primary-light-5);
  border-radius: 3px;
}

.data-list-container::-webkit-scrollbar-thumb:hover {
  background: var(--el-color-primary-light-3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .fg-list {
    padding: 12px;
  }

  .data-list-container {
    height: calc(100% - 70px);
  }
}

/* 悬停效果 */
.data-item:not(.selected):hover {
  background: var(--el-fill-color-light) !important;
}

/* 选中项的悬停效果 */
.data-item.selected:hover {
  opacity: 0.95;
}

/* 列表容器背景 */
.data-list-container {
  background: var(--el-fill-color-blank) !important;
}

/* 亮色主题特殊处理 */
:root[data-theme="light"] .data-item:not(.selected) {
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-lighter);
}

:root[data-theme="light"] .data-item:not(.selected):hover {
  background: var(--el-fill-color-light) !important;
  border-color: var(--el-border-color);
}

/* 暗色主题特殊处理 */
:root[data-theme="dark"] .data-item:not(.selected),
:root[data-theme="one-dark"] .data-item:not(.selected) {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-darker);
}

:root[data-theme="dark"] .data-item:not(.selected):hover,
:root[data-theme="one-dark"] .data-item:not(.selected):hover {
  background: var(--el-fill-color-dark) !important;
  border-color: var(--el-border-color);
}
</style>
