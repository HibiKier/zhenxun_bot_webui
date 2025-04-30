<template>
  <div class="plugin-list-container">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
    >
      <div
        v-for="data in dataList"
        :key="data.module"
        class="plugin-card relative rounded-xl p-4 transition-all duration-300 cursor-pointer"
        :class="{
          'border-2 border-pink-500 shadow-lg shadow-pink-200/50 transform -translate-y-1':
            isSelected(data.module),
          'border-2 border-transparent hover:border-pink-300': !isSelected(
            data.module
          ),
          'bg-gradient-to-br from-pink-50 to-purple-50': true,
        }"
        @click="toggleSelection(data.module)"
      >
        <!-- 选中标记 -->
        <div
          v-if="isSelected(data.module)"
          class="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs z-10 animate-bounce"
        >
          <i class="fas fa-check"></i>
        </div>

        <!-- 插件内容 -->
        <div class="flex flex-col h-full">
          <!-- 插件名称和版本 -->
          <div class="flex items-baseline mb-1">
            <h3 class="text-lg font-bold text-purple-800 truncate">
              {{ data.plugin_name }}
            </h3>
            <span
              class="ml-2 text-xs text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded-full"
              >v{{ data.version }}</span
            >
          </div>

          <!-- 模块和作者 -->
          <p class="text-sm text-purple-700 mb-2 truncate">
            <span class="font-mono">{{ data.module }}</span>
            <span v-if="data.author" class="text-pink-600 ml-2"
              >@{{ data.author }}</span
            >
          </p>

          <!-- 菜单类型标签 -->
          <div v-if="data.menu_type" class="mt-auto">
            <span
              class="inline-block px-2 py-1 text-xs rounded-full bg-pink-200 text-pink-800"
            >
              {{ data.menu_type }}
            </span>
          </div>

          <!-- 底部按钮区域 - 右侧横向排列 -->
          <div
            class="flex justify-end items-center mt-3 pt-2 border-t border-pink-100"
          >
            <!-- 开关按钮 -->
            <button
              @click.stop="changeSwitch(data)"
              class="p-2 rounded-lg transition-all duration-200 hover:scale-110 flex items-center ml-2"
              :class="{
                'bg-green-100 text-green-600 hover:bg-green-200': data.status,
                'bg-red-100 text-red-500 hover:bg-red-200': !data.status,
              }"
              :title="data.status ? '关闭插件' : '开启插件'"
            >
              <i
                class="fas text-lg"
                :class="data.status ? 'fa-toggle-on' : 'fa-toggle-off'"
              ></i>
              <span class="ml-1 text-xs hidden sm:inline">{{
                data.status ? "开启" : "关闭"
              }}</span>
            </button>

            <!-- 配置按钮 -->
            <button
              @click.stop="openSetting(data)"
              class="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition-all duration-200 hover:scale-110 flex items-center ml-2"
              title="插件配置"
            >
              <i class="fas fa-cog text-lg"></i>
              <span class="ml-1 text-xs hidden sm:inline">配置</span>
            </button>

            <!-- 卸载按钮 -->
            <button
              @click.stop="uninstallPlugin(data)"
              class="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 hover:text-purple-800 transition-all duration-200 hover:scale-110 flex items-center ml-2"
              title="卸载插件"
            >
              <i class="fas fa-trash-alt text-lg"></i>
              <span class="ml-1 text-xs hidden sm:inline">卸载</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <UpdateDialog
      v-if="dialogVisible"
      :module="pluginModule"
      @close="closeSetting"
    />
  </div>
</template>

<script>
import UpdateDialog from "./UpdateDialog"

export default {
  name: "PluginListTemplate",
  props: { pluginType: String, menuType: String },
  components: { UpdateDialog },
  data() {
    return {
      dataList: [],
      pluginModule: null,
      dialogVisible: false,
      selectedPlugins: [],
    }
  },
  mounted() {
    this.getPluginList()
  },
  methods: {
    getPluginList() {
      this.clearSelection()
      const loading = this.$loading({
        target: ".plugin-list-container",
        background: "rgba(255, 255, 255, 0.7)",
        spinner: "el-icon-loading",
        text: "正在加载插件...",
      })

      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_list`, {
        plugin_type: [this.pluginType],
        menu_type: this.menuType,
      })
        .then((resp) => {
          if (resp?.suc) {
            this.dataList = Array.isArray(resp.data) ? resp.data : []
            if (resp.warning) {
              this.$notify.warning({
                title: "提示",
                message: resp.warning,
                duration: 3000,
              })
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: resp?.info || "获取插件列表失败",
              duration: 3000,
            })
            this.dataList = []
          }
        })
        .catch((error) => {
          this.$notify.error({
            title: "错误",
            message: "请求插件列表失败: " + error,
            duration: 3000,
          })
          this.dataList = []
        })
        .finally(() => loading.close())
    },
    changeSwitch(data) {
      this.postRequest(`${this.$root.prefix}/plugin/change_switch`, {
        module: data.module,
        status: !data.status,
      }).then((resp) => {
        if (resp.suc) {
          this.$notify.success({
            title: "成功",
            message: resp.info,
            duration: 2000,
          })
          this.getPluginList()
        } else {
          this.$notify.error({
            title: "错误",
            message: resp.info,
            duration: 3000,
          })
        }
      })
    },
    openSetting(data) {
      this.pluginModule = data.module
      this.dialogVisible = true
    },
    closeSetting(isRefresh) {
      this.dialogVisible = false
      if (isRefresh) this.getPluginList()
    },
    uninstallPlugin(data) {
      this.$confirm(`确定要卸载插件 "${data.plugin_name}" 吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "anime-confirm-dialog",
      })
        .then(() => {
          this.postRequest(`${this.$root.prefix}/plugin/uninstall`, {
            module: data.module,
          }).then((resp) => {
            if (resp.suc) {
              this.$notify.success({
                title: "成功",
                message: `插件 "${data.plugin_name}" 已卸载`,
                duration: 3000,
              })
              this.getPluginList()
            } else {
              this.$notify.error({
                title: "错误",
                message: resp.info || "卸载失败",
                duration: 3000,
              })
            }
          })
        })
        .catch(() => {
          this.$notify.info({
            title: "已取消",
            message: "取消卸载操作",
            duration: 2000,
          })
        })
    },
    isSelected(module) {
      return this.selectedPlugins.includes(module)
    },
    toggleSelection(module) {
      const index = this.selectedPlugins.indexOf(module)
      if (index > -1) {
        this.selectedPlugins.splice(index, 1)
      } else {
        this.selectedPlugins.push(module)
      }
      this.$emit("update:selection", [...this.selectedPlugins])
    },
    clearSelection() {
      if (this.selectedPlugins.length > 0) {
        this.selectedPlugins = []
        this.$emit("update:selection", [])
      }
    },
  },
}
</script>

<style scoped>
.plugin-card {
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.1);
  background-image: radial-gradient(
      circle at 10% 20%,
      rgba(255, 200, 240, 0.2) 0%,
      rgba(230, 230, 255, 0.3) 90%
    ),
    linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.6)
    );
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-height: 140px;
}

.plugin-card .button-row {
  border-top: 1px dashed rgba(236, 72, 153, 0.3);
  padding-top: 8px;
  margin-top: 8px;
}

.plugin-card:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
}

/* 选中状态动画 */
.plugin-card.is-selected {
  animation: pulse 2s infinite;
  border-color: rgba(236, 72, 153, 0.5);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(236, 72, 153, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
  }
}

/* 按钮区域 */
.plugin-card .button-area {
  border-left: 1px dashed rgba(236, 72, 153, 0.3);
}

/* 按钮动画 */
button {
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 移动端适配 */
@media (max-width: 640px) {
  /* 小屏幕下只显示图标 */
  .plugin-card button span {
    display: none;
  }
  .plugin-card button {
    padding: 6px;
    min-width: 32px;
  }
}

/* 二次元风格确认对话框 */
:deep(.anime-confirm-dialog) {
  border-radius: 16px;
  background: linear-gradient(to bottom right, #fff5f7, #f8f0ff);
  border: 2px solid #f8bbd0;

  .el-message-box__header {
    background: linear-gradient(to right, #ff9a9e, #fad0c4);
    border-radius: 14px 14px 0 0;
    padding: 10px 20px;

    .el-message-box__title {
      color: white;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }
  }

  .el-message-box__content {
    padding: 20px;
    color: #6b46c1;
  }

  .el-message-box__btns {
    padding: 10px 20px 20px;

    button {
      border-radius: 12px;
      padding: 8px 16px;

      &.el-button--primary {
        background: linear-gradient(to right, #ff9a9e, #fad0c4);
        border-color: #ff9a9e;
        color: white;
      }

      &.el-button--default {
        background: linear-gradient(to right, #f8f0ff, #e0f7fa);
        border-color: #b2ebf2;
        color: #6b46c1;
      }
    }
  }
}
</style>
