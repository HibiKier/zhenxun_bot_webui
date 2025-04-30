<template>
  <div
    class="left-info-container bg-pink-50 p-4 h-full overflow-y-auto"
    ref="leftInfoContainer"
  >
    <!-- 头像和信息区域 -->
    <div
      class="avatar-section bg-white rounded-xl p-6 shadow-lg mb-4 transform transition-all hover:scale-[1.01]"
    >
      <div class="flex flex-col items-center">
        <!-- 头像 -->
        <el-image
          :src="botInfo.ava_url"
          class="w-24 h-24 rounded-full border-4 border-pink-200 shadow-md hover:border-pink-300 transition-all"
          fit="cover"
        >
          <div
            slot="error"
            class="w-full h-full flex items-center justify-center bg-pink-100 rounded-full"
          >
            <i class="el-icon-picture-outline text-3xl text-pink-400"></i>
          </div>
        </el-image>

        <!-- 昵称 -->
        <h2 class="mt-4 text-2xl font-bold text-pink-600 anime-font">
          {{ botInfo.nickname }}
        </h2>

        <!-- ID -->
        <div
          class="mt-2 px-3 py-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full text-sm font-medium shadow-md"
        >
          ID: {{ botInfo.self_id }}
        </div>

        <!-- 统计信息 -->
        <div class="w-full mt-6 grid grid-cols-3 divide-x divide-pink-100">
          <!-- 好友数量 -->
          <div class="text-center">
            <p class="text-2xl font-bold text-blue-500">
              {{ botInfo.friend_count }}
            </p>
            <p class="text-xs text-gray-500 mt-1">好友数量</p>
          </div>

          <!-- 开关 -->
          <div
            class="switch-border text-center cursor-pointer"
            @click="handleBotStatus"
          >
            <svg-icon
              :icon-class="botInfo.status ? 'power-open' : 'power-close'"
              class="text-2xl"
              :class="botInfo.status ? 'text-green-400' : 'text-red-400'"
            />
            <p class="text-xs text-gray-500 mt-2">全局开关</p>
          </div>

          <!-- 群组数量 -->
          <div class="text-center">
            <p class="text-2xl font-bold text-green-500">
              {{ botInfo.group_count }}
            </p>
            <p class="text-xs text-gray-500 mt-1">群组数量</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 插件管理区域 -->
    <div class="plugin-section" :style="{ height: pluginSectionHeight + 'px' }">
      <h3 class="text-lg font-bold text-purple-600 mb-4 flex items-center">
        <svg-icon icon-class="plugin" class="mr-2 text-purple-400" />
        Bot插件管理
      </h3>

      <div class="space-y-6">
        <!-- 全局禁用被动 -->
        <div
          v-if="$store.state.botType == 'zhenxun'"
          class="grid grid-cols-12 gap-4 items-center"
        >
          <label class="col-span-3 text-sm text-gray-600">全局禁用被动</label>
          <div class="col-span-9">
            <el-select
              v-model="postData.blockTasks"
              multiple
              placeholder="请选择要禁用的被动"
              class="w-full"
              popper-class="cute-select-dropdown"
            >
              <el-option
                v-for="v in botModuleData.blockTasks"
                :label="v.name"
                :value="v.module"
                :key="v.module"
              ></el-option>
            </el-select>
          </div>
        </div>

        <!-- 全局禁用插件 -->
        <div class="grid grid-cols-12 gap-4 items-center">
          <label class="col-span-3 text-sm text-gray-600">全局禁用插件</label>
          <div class="col-span-9">
            <el-select
              v-model="postData.blockPlugins"
              multiple
              placeholder="请选择要禁用的插件"
              class="w-full"
              popper-class="cute-select-dropdown"
            >
              <el-option
                v-for="n in botModuleData.blockPlugins"
                :label="n.name"
                :value="n.module"
                :key="n.module"
              ></el-option>
            </el-select>
          </div>
        </div>

        <!-- 应用按钮 -->
        <button
          @click="clickBotManage"
          class="w-full py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
        >
          应用设置
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getFontSize, getConvertSize } from "@/utils/utils"
import SvgIcon from "../SvgIcon/SvgIcon.vue"

export default {
  name: "LeftInfo",
  components: { SvgIcon },
  data() {
    return {
      botModuleData: {
        blockPlugins: [],
        blockTasks: [],
      },
      postData: {
        blockPlugins: [],
        blockTasks: [],
      },
      botInfo: {},
      pluginSectionHeight: 0,
    }
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    this.getBotModuleData()
    this.calculateHeights()
    window.addEventListener("resize", this.calculateHeights)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.calculateHeights)
  },
  methods: {
    calculateHeights() {
      this.$nextTick(() => {
        const container = this.$refs.leftInfoContainer
        if (container) {
          const containerHeight = container.clientHeight
          const avatarSection = container.querySelector(".avatar-section")
          const avatarHeight = avatarSection ? avatarSection.clientHeight : 0
          const padding = 16 // 根据实际padding调整

          this.pluginSectionHeight = containerHeight - avatarHeight - padding
        }
      })
    },
    handleBotStatus() {
      var loading = this.getLoading(".left-info")

      this.$postRequest(`${this.$root.prefix}/main/change_bot_status`, {
        bot_id: this.botInfo.self_id,
        status: !this.botInfo.status,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.botInfo.status = !this.botInfo.status
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    getBotModuleData() {
      var loading = this.getLoading(".left-info")

      this.$getRequest(`${this.$root.prefix}/main/get_bot_block_module`, {
        bot_id: this.botInfo.self_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.botModuleData.blockPlugins = resp.data.all_plugins
            this.botModuleData.blockTasks = resp.data.all_tasks
            this.postData.blockPlugins = resp.data.block_plugins
            this.postData.blockTasks = resp.data.block_tasks
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    clickBotManage() {
      var loading = this.getLoading(".left-info")

      this.$postRequest(`${this.$root.prefix}/main/update_bot_manage`, {
        bot_id: this.botInfo.self_id,
        block_plugins: this.postData.blockPlugins,
        block_tasks: this.postData.blockTasks,
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
      })
    },
  },
}
</script>

<style scoped>
/* 自定义字体 */
@import url("https://fonts.googleapis.com/css2?family=Mochiy+Pop+P+One&display=swap");

.switch-border {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
}

.left-info-container {
  @apply flex flex-col h-full p-4 bg-pink-50 overflow-hidden;
  gap: 16px; /* 设置两个部分之间的间距 */
}

.avatar-section {
  @apply bg-white rounded-xl p-6 shadow-lg;
  flex-shrink: 0; /* 防止压缩 */
}

.plugin-section {
  @apply bg-white rounded-xl p-6 shadow-lg overflow-y-auto;
  flex-grow: 1; /* 填充剩余空间 */
  min-height: 300px; /* 设置最小高度 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .left-info-container {
    @apply p-2;
    gap: 12px;
  }

  .avatar-section,
  .plugin-section {
    @apply p-4;
  }
}
</style>

<style>
/* 自定义下拉框样式 */
.cute-select-dropdown {
  background-color: white !important;
  border: 1px solid #f3e8ff !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.1) !important;
}

.cute-select-dropdown .el-select-dropdown__item {
  color: #6b7280 !important;
  padding: 8px 16px !important;
}

.cute-select-dropdown .el-select-dropdown__item.hover,
.cute-select-dropdown .el-select-dropdown__item:hover {
  background-color: #fdf2f8 !important;
  color: #ec4899 !important;
}

.cute-select-dropdown .el-select-dropdown__item.selected {
  background-color: #fce7f3 !important;
  color: #ec4899 !important;
  font-weight: bold !important;
}

/* 多选标签样式 */
.el-select__tags .el-tag {
  background-color: #fce7f3 !important;
  border-color: #fbcfe8 !important;
  color: #ec4899 !important;
}

.el-select__tags .el-tag .el-tag__close {
  color: #ec4899 !important;
}

.el-select__tags .el-tag .el-tag__close:hover {
  background-color: #ec4899 !important;
  color: white !important;
}
</style>
