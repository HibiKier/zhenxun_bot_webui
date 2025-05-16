<template>
  <div
    class="left-info-container p-4 h-full overflow-y-auto"
    :style="{ backgroundColor: 'var(--bg-color)' }"
    ref="leftInfoContainer"
  >
    <!-- 头像和信息区域 -->
    <div
      class="avatar-section rounded-xl p-6 shadow-lg transform transition-all hover:scale-[1.01]"
      :style="{ backgroundColor: 'var(--bg-color-secondary)' }"
    >
      <div class="flex flex-col items-center">
        <!-- 头像 -->
        <el-image
          :src="botInfo.ava_url"
          class="w-24 h-24 rounded-full border-4 shadow-md transition-all"
          :style="{ borderColor: 'var(--border-color)' }"
          fit="cover"
        >
          <div
            slot="error"
            class="w-full h-full flex items-center justify-center rounded-full"
            :style="{ backgroundColor: 'var(--el-fill-color)' }"
          >
            <i
              class="el-icon-picture-outline text-3xl"
              :style="{ color: 'var(--primary-color)' }"
            ></i>
          </div>
        </el-image>

        <!-- 昵称 -->
        <h2
          class="mt-4 text-xl font-bold anime-font"
          :style="{ color: 'var(--primary-color)' }"
        >
          {{ botInfo.nickname }}
        </h2>

        <!-- ID -->
        <div
          class="mt-2 px-3 py-1 text-white rounded-full text-xs font-medium shadow-md"
          :style="{
            background:
              'linear-gradient(to right, var(--primary-color), var(--primary-color-light))',
          }"
        >
          ID: {{ botInfo.self_id }}
        </div>

        <!-- 统计信息 -->
        <div
          class="w-full mt-6 grid grid-cols-3 divide-x"
          :style="{ borderColor: 'var(--border-color-light)' }"
        >
          <!-- 好友数量 -->
          <div class="text-center">
            <p
              class="text-xl font-bold"
              :style="{ color: 'var(--info-color)' }"
            >
              {{ botInfo.friend_count }}
            </p>
            <p
              class="text-xxs mt-1"
              :style="{ color: 'var(--text-color-secondary)' }"
            >
              好友数量
            </p>
          </div>

          <!-- 开关 -->
          <div
            class="switch-border text-center cursor-pointer"
            @click="handleBotStatus"
          >
            <svg-icon
              icon-class="switch"
              class="text-lg"
              :color="
                botInfo.status ? 'var(--success-color)' : 'var(--danger-color)'
              "
            />
            <p
              class="text-xxs mt-2"
              :style="{ color: 'var(--text-color-secondary)' }"
            >
              全局开关
            </p>
          </div>

          <!-- 群组数量 -->
          <div class="text-center">
            <p
              class="text-xl font-bold"
              :style="{ color: 'var(--success-color)' }"
            >
              {{ botInfo.group_count }}
            </p>
            <p
              class="text-xxs mt-1"
              :style="{ color: 'var(--text-color-secondary)' }"
            >
              群组数量
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 插件管理区域 -->
    <div
      class="plugin-section"
      :style="{
        height: pluginSectionHeight + 'px',
        backgroundColor: 'var(--bg-color-secondary)',
      }"
    >
      <h3
        class="text-md font-bold mb-4 flex items-center"
        :style="{ color: 'var(--primary-color)' }"
      >
        <svg-icon
          icon-class="plugin"
          class="mr-2"
          color="var(--primary-color-light)"
        />
        Bot插件管理
      </h3>

      <div class="space-y-6">
        <!-- 全局禁用被动 -->
        <div
          v-if="$store.state.botType == 'zhenxun'"
          class="grid grid-cols-12 gap-4 items-center"
        >
          <label
            class="col-span-3 text-xs"
            :style="{ color: 'var(--text-color-secondary)' }"
            >全局禁用被动</label
          >
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
          <label
            class="col-span-3 text-xs"
            :style="{ color: 'var(--text-color-secondary)' }"
            >全局禁用插件</label
          >
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
          class="w-full py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 text-sm"
          :style="{
            background:
              'linear-gradient(to right, var(--primary-color), var(--primary-color-light))',
          }"
        >
          应用设置
        </button>
      </div>
    </div>
  </div>
</template>

<script>
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
      var loading = this.getLoading(".left-info-container")

      this.postRequest(`${this.$root.prefix}/main/change_bot_status`, {
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
      var loading = this.getLoading(".left-info-container")

      this.getRequest(`${this.$root.prefix}/main/get_bot_block_module`, {
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
      var loading = this.getLoading(".left-info-container")

      this.postRequest(`${this.$root.prefix}/main/update_bot_manage`, {
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
}

.left-info-container {
  @apply flex flex-col h-full p-4 overflow-hidden;
  gap: 16px; /* 设置两个部分之间的间距 */
}

.avatar-section {
  @apply rounded-xl p-6 shadow-lg;
  flex-shrink: 0; /* 防止压缩 */
}

.plugin-section {
  @apply rounded-xl p-6 shadow-lg overflow-y-auto;
  flex-grow: 1; /* 填充剩余空间 */
  min-height: 300px; /* 设置最小高度 */
}

/* 使用全局字体变量 */
.anime-font {
  font-family: "Mochiy Pop P One", sans-serif;
  font-size: var(--font-size-xl);
  line-height: var(--line-height-dense);
}
</style>
