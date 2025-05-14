<template>
  <div class="plugin-list-container h-full overflow-auto">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
    >
      <div
        v-for="data in dataList"
        :key="data.module"
        class="plugin-card relative rounded-xl p-4 transition-all duration-300 cursor-pointer"
        :class="{
          'border-2 shadow-lg transform -translate-y-1': isSelected(
            data.module
          ),
          'border-2 border-transparent hover:border-opacity-50': !isSelected(
            data.module
          ),
        }"
        :style="{
          borderColor: isSelected(data.module)
            ? 'var(--primary-color)'
            : 'var(--border-color-light)',
          boxShadow: isSelected(data.module) ? 'var(--primary-shadow)' : 'none',
          background: 'var(--bg-color-secondary)',
        }"
        @click="toggleSelection(data)"
      >
        <!-- 选中标记 -->
        <div
          v-if="isSelected(data.module)"
          class="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs z-10 animate-bounce"
          :style="{ backgroundColor: 'var(--primary-color)' }"
        >
          <i class="fas fa-check"></i>
        </div>

        <!-- 插件内容 -->
        <div class="flex flex-col h-full">
          <!-- 插件名称和版本 -->
          <div class="flex items-baseline mb-1">
            <h3
              class="text-lg font-bold truncate"
              :style="{ color: 'var(--primary-color)' }"
            >
              {{ data.plugin_name }}
            </h3>
            <span
              class="ml-2 text-xs px-1.5 py-0.5 rounded-full"
              :style="{
                color: 'var(--primary-color)',
                backgroundColor: 'var(--bg-color-hover)',
              }"
              >v{{ data.version }}</span
            >
          </div>

          <!-- 模块和作者 -->
          <p
            class="text-sm mb-2 truncate"
            :style="{ color: 'var(--text-color-secondary)' }"
          >
            <span class="font-mono">{{ data.module }}</span>
            <span
              v-if="data.author"
              class="ml-2"
              :style="{ color: 'var(--primary-color-light)' }"
              >@{{ data.author }}</span
            >
          </p>

          <!-- 菜单类型标签 -->
          <div v-if="data.menu_type" class="mt-auto">
            <span
              class="inline-block px-2 py-1 text-xs rounded-full"
              :style="{
                backgroundColor: 'var(--bg-color-hover)',
                color: 'var(--primary-color)',
              }"
            >
              {{ data.menu_type }}
            </span>
          </div>

          <!-- 底部按钮区域 - 右侧横向排列 -->
          <div
            class="flex justify-end items-center mt-3 pt-2"
            :style="{ borderTop: '1px solid var(--border-color-light)' }"
          >
            <!-- 开关按钮 -->
            <NormalButton
              :text="
                !data.allow_switch ? '禁用' : data.status ? '开启' : '关闭'
              "
              iconClass="switch"
              title="切换插件状态"
              :disabled="!data.allow_switch"
              :base-class="'hover:scale-110'"
              :active-class="
                !data.allow_switch
                  ? 'bg-gray-100 text-gray-400'
                  : data.status
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-red-100 text-red-500 hover:bg-red-200'
              "
              :icon-color="
                !data.allow_switch
                  ? 'var(--el-text-color-disabled)'
                  : data.status
                  ? 'var(--el-color-success)'
                  : 'var(--el-color-danger)'
              "
              @click="changeSwitch(data)"
            />

            <!-- 配置按钮 -->
            <NormalButton
              icon-class="fas fa-cog text-lg"
              iconClass="setting"
              :disabled="!data.allow_setting"
              text="配置"
              title="插件配置"
              base-class="hover:scale-110"
              active-class="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800"
              @click="openSetting(data)"
            />

            <!-- 卸载按钮 -->
            <NormalButton
              text="卸载"
              :iconClass="
                data.is_builtin ? 'uninstall-disabled' : 'uninstall-purple'
              "
              :title="data.is_builtin ? '系统内置插件不可卸载' : '卸载插件'"
              :disabled="data.is_builtin"
              :base-class="'hover:scale-110'"
              :active-class="'bg-purple-100 text-purple-600 hover:bg-purple-200 hover:text-purple-800'"
              @click="uninstallPlugin(data)"
            />
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
import NormalButton from "@/components/ui/NormalButton.vue"

export default {
  name: "PluginListTemplate",
  props: { pluginType: String, menuType: String },
  components: { UpdateDialog, NormalButton },
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
      const loading = this.getLoading(".plugin-list-container")

      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_list`, {
        plugin_type: [this.pluginType],
        menu_type: this.menuType,
      })
        .then((resp) => {
          if (resp?.suc) {
            this.dataList = Array.isArray(resp.data) ? resp.data : []
            if (resp.warning) {
              this.$message.warning(resp.warning)
            }
          } else {
            this.$message.error(resp?.info || "获取插件列表失败")
            this.dataList = []
          }
        })
        .catch((error) => {
          this.$message.error("请求插件列表失败: " + error)
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
          this.$message.success(resp.info)
          this.getPluginList()
        } else {
          this.$message.error(resp.info)
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
    async uninstallPlugin(data) {
      const result = await this.$cuteConfirm({
        title: "卸载确认",
        message: `确定要卸载插件 "${data.plugin_name}" 吗?`,
        cancelButtonText: "我再想想",
        confirmButtonText: "狠心卸载",
      })

      if (result) {
        try {
          this.postRequest(`${this.$root.prefix}/store/remove_plugin`, {
            id: data.id,
          }).then((resp) => {
            if (resp.suc) {
              if (resp.warning) {
                this.$message.warning(resp.warning)
              } else {
                this.$message.success(resp.info)
                this.getPluginList()
              }
            } else {
              this.$message.error(resp.info || "卸载失败")
            }
          })
        } catch (error) {
          this.$message.error("卸载失败: " + error.message)
        }
      } else {
        console.log("取消卸载")
      }
    },
    isSelected(module) {
      return this.selectedPlugins.includes(module)
    },
    toggleSelection(data) {
      const module = data.module
      if (!data.allow_switch || !data.allow_setting) {
        this.$message.warning("该插件不支持切换或配置")
        return
      }

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
  box-shadow: var(--card-shadow);
  background-image: radial-gradient(
      circle at 10% 20%,
      var(--primary-color-light) 0%,
      var(--bg-color-hover) 90%
    ),
    linear-gradient(to bottom right, var(--bg-color), var(--bg-color-secondary));
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-height: 140px;
}

.plugin-card .button-row {
  border-top: 1px dashed var(--border-color-light);
  padding-top: 8px;
  margin-top: 8px;
}

.plugin-card:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--primary-shadow);
}

/* 选中状态动画 */
.plugin-card.is-selected {
  animation: pulse 2s infinite;
  border-color: var(--primary-color);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 var(--primary-shadow);
  }
  70% {
    box-shadow: 0 0 0 12px transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}

/* 按钮区域 */
.plugin-card .button-area {
  border-left: 1px dashed var(--border-color-light);
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
  background: var(--bg-color-secondary);
  border: 2px solid var(--border-color-light);

  .el-message-box__header {
    background: var(--primary-color);
    border-radius: 14px 14px 0 0;
    padding: 10px 20px;

    .el-message-box__title {
      color: var(--bg-color);
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }
  }

  .el-message-box__content {
    padding: 20px;
    color: var(--primary-color);
  }

  .el-message-box__btns {
    padding: 10px 20px 20px;

    button {
      border-radius: 12px;
      padding: 8px 16px;

      &.el-button--primary {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: var(--bg-color);
      }

      &.el-button--default {
        background: var(--bg-color-hover);
        border-color: var(--border-color-light);
        color: var(--primary-color);
      }
    }
  }
}
</style>
