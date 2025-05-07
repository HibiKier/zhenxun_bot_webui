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
          'border-2 border-pink-500 shadow-lg shadow-pink-200/50 transform -translate-y-1':
            isSelected(data.module),
          'border-2 border-transparent hover:border-pink-300': !isSelected(
            data.module
          ),
          'bg-gradient-to-br from-pink-50 to-purple-50': true,
        }"
        @click="toggleSelection(data)"
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
            <NormalButton
              :text="data.status ? '开启' : '关闭'"
              :iconClass="
                !data.allow_switch
                  ? 'switch-disabled'
                  : data.status
                  ? 'switch-green'
                  : 'switch-red'
              "
              title="切换插件状态"
              :disabled="!data.allow_switch"
              :base-class="'hover:scale-110'"
              :active-class="
                data.status
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-red-100 text-red-500 hover:bg-red-200'
              "
              @click="changeSwitch(data)"
            />

            <!-- 配置按钮 -->
            <NormalButton
              icon-class="fas fa-cog text-lg"
              :iconClass="
                data.allow_switch ? 'setting-blue' : 'setting-disabled'
              "
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
import UpdateDialog from './UpdateDialog'
import NormalButton from '@/components/ui/NormalButton.vue'

export default {
  name: 'PluginListTemplate',
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
      const loading = this.getLoading('.plugin-list-container')

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
            this.$message.error(resp?.info || '获取插件列表失败')
            this.dataList = []
          }
        })
        .catch((error) => {
          this.$message.error('请求插件列表失败: ' + error)
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
        title: '卸载确认',
        message: `确定要卸载插件 "${data.plugin_name}" 吗?`,
        cancelButtonText: '我再想想',
        confirmButtonText: '狠心卸载',
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
              this.$message.error(resp.info || '卸载失败')
            }
          })
        } catch (error) {
          this.$message.error('卸载失败: ' + error.message)
        }
      } else {
        console.log('取消卸载')
      }
    },
    isSelected(module) {
      return this.selectedPlugins.includes(module)
    },
    toggleSelection(data) {
      const module = data.module
      if (!data.allow_switch || !data.allow_setting) {
        this.$message.warning('该插件不支持切换或配置')
        return
      }

      const index = this.selectedPlugins.indexOf(module)
      if (index > -1) {
        this.selectedPlugins.splice(index, 1)
      } else {
        this.selectedPlugins.push(module)
      }
      this.$emit('update:selection', [...this.selectedPlugins])
    },
    clearSelection() {
      if (this.selectedPlugins.length > 0) {
        this.selectedPlugins = []
        this.$emit('update:selection', [])
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
