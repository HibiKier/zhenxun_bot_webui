<template>
  <div
    ref="pluginManager"
    class="plugin-manager bg-pink-50 p-4 md:p-6 rounded-2xl"
  >
    <!-- 顶部插件类型选择 -->
    <div
      class="type-selector bg-white rounded-xl shadow-md p-1 mb-6 inline-flex border border-pink-200"
    >
      <button
        v-for="type in pluginTypes"
        :key="type.value"
        @click="clickPluginType(type.value)"
        class="px-4 py-2 text-sm font-medium transition-all duration-300"
        :class="{
          'bg-pink-500 text-white shadow-inner': activeBtn === type.value,
          'text-pink-600 hover:bg-pink-100': activeBtn !== type.value,
          'rounded-l-lg': type.first,
          'rounded-r-lg': type.last,
        }"
      >
        {{ type.label }}({{ pluginCount[type.countKey] }})
      </button>
    </div>

    <!-- 过滤标签区域 -->
    <div
      class="filter-area bg-white rounded-xl shadow-md p-4 mb-6 border border-pink-200"
    >
      <div class="flex flex-wrap items-center gap-2">
        <span
          v-for="tag in sortedMenuTypeList"
          :key="tag"
          @click="selectMenuType(tag)"
          class="px-3 py-1 text-xs rounded-full transition-all duration-200 cursor-pointer"
          :class="{
            'bg-pink-500 text-white': searchMenuType === tag,
            'bg-pink-100 text-pink-600 hover:bg-pink-200':
              searchMenuType !== tag,
          }"
        >
          {{ tag }}
        </span>

        <button
          @click="showAddDialogFlag = true"
          class="ml-auto px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors duration-200 flex items-center"
        >
          <i class="fas fa-plus mr-1"></i>新增类型
        </button>

        <button
          @click="openManageTypesDialog"
          class="px-3 py-1 text-xs rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors duration-200 flex items-center"
        >
          <i class="fas fa-cog mr-1"></i>管理类型
        </button>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div
      v-if="selectedPluginModules.length > 0"
      class="bulk-actions bg-white rounded-xl shadow-md p-3 mb-6 border-2 border-pink-300 animate-pulse"
    >
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-sm font-medium text-pink-600">
          <i class="fas fa-check-circle mr-1"></i>已选择
          {{ selectedPluginModules.length }} 个插件
        </span>

        <button
          @click="bulkToggleSwitch(true)"
          class="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200 flex items-center"
        >
          <i class="fas fa-power-off mr-1"></i>启用
        </button>

        <button
          @click="bulkToggleSwitch(false)"
          class="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 flex items-center"
        >
          <i class="fas fa-ban mr-1"></i>禁用
        </button>

        <select
          v-model="targetMenuTypeBulk"
          class="px-3 py-1 text-xs rounded-full bg-white border border-pink-200 focus:border-pink-300 focus:ring-1 focus:ring-pink-200 transition-all duration-200"
        >
          <option value="" disabled selected>选择新菜单类型</option>
          <option v-for="item in sortedMenuTypeList" :key="item" :value="item">
            {{ item }}
          </option>
        </select>

        <button
          @click="bulkUpdateMenuType"
          class="px-3 py-1 text-xs rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-200 flex items-center"
          :disabled="!targetMenuTypeBulk"
        >
          <i class="fas fa-check mr-1"></i>应用类型
        </button>

        <button
          @click="cancelSelection"
          class="ml-auto px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 flex items-center"
        >
          <i class="fas fa-times mr-1"></i>取消选择
        </button>
      </div>
    </div>

    <!-- 插件列表 -->
    <div
      class="plugin-list-container bg-white rounded-xl shadow-md p-4 border border-pink-200"
    >
      <PluginListTemplate
        ref="pluginListRef"
        :pluginType="activeBtn"
        :menuType="searchMenuType"
        :key="pltKey"
        @update:selection="handleSelectionUpdate"
        :style="{ height: pluginListHeight + 'px' }"
      />
    </div>

    <!-- 管理菜单类型对话框 -->
    <div
      v-if="manageTypesDialogVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-bounce-in"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-pink-600">
            <i class="fas fa-list-ul mr-2"></i>管理菜单类型
          </h3>
          <button
            @click="manageTypesDialogVisible = false"
            class="text-pink-400 hover:text-pink-600"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div
            v-if="sortedMenuTypeList.length === 0"
            class="text-center py-4 text-gray-500"
          >
            <i class="fas fa-inbox text-3xl mb-2"></i>
            <p>暂无自定义菜单类型</p>
          </div>

          <div
            v-for="type in sortedMenuTypeList"
            :key="type"
            class="flex justify-between items-center py-2 border-b border-pink-100 last:border-0"
          >
            <span class="text-pink-700">{{ type }}</span>
            <button
              @click="startRenameType(type)"
              class="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors duration-200"
            >
              <i class="fas fa-edit mr-1"></i>重命名
            </button>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="manageTypesDialogVisible = false"
            class="px-4 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
    <NeonDialog
      :visible.sync="showAddDialogFlag"
      title="新增菜单类型"
      icon-class="add-menu"
      @confirm="addNewMenuType"
    >
      <NeonInput
        v-model="newMenuTypeName"
        class="fm-input"
        placeholder="请输入新的菜单类型名称..."
      />
    </NeonDialog>
    <NeonDialog
      :visible.sync="showRenameDialogFlag"
      title="重命名菜单类型"
      icon-class="rename1"
      @confirm="triggerRenameType"
    >
      <NeonInput
        v-model="renameMenuTypeName"
        class="fm-input"
        placeholder="请输入新的菜单类型名称..."
      />
    </NeonDialog>
  </div>
</template>

<script>
import PluginListTemplate from "@/components/plugin/PluginListTemplate.vue"
import NeonDialog from "@/components/ui/NeonDialog.vue"
import NeonInput from "@/components/ui/NeonInput.vue"

export default {
  name: "PluginList",
  components: {
    PluginListTemplate,
    NeonDialog,
    NeonInput,
  },
  data() {
    return {
      pluginTypes: [
        { value: "NORMAL", label: "普通插件", countKey: "normal", first: true },
        { value: "ADMIN", label: "管理员插件", countKey: "admin" },
        { value: "SUPERUSER", label: "超级用户插件", countKey: "superuser" },
        { value: "HIDDEN", label: "其他插件", countKey: "other", last: true },
      ],
      pluginCount: { normal: 0, admin: 0, superuser: 0, other: 0 },
      activeBtn: "NORMAL",
      pltKey: 0,
      pluginListHeight: 0,
      menuTypeList: [],
      searchMenuType: null,
      selectedPluginModules: [],
      targetMenuTypeBulk: null,
      manageTypesDialogVisible: false,
      showAddDialogFlag: false,
      showRenameDialogFlag: false,
      newMenuTypeName: "",
      renameMenuTypeName: "",
      oldRenameMenuTypeName: "",
    }
  },
  computed: {
    sortedMenuTypeList() {
      return [...this.menuTypeList].sort((a, b) => a.localeCompare(b))
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.getPluginCount()
    this.getPluginMenuType()
    this.handleResize()
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
  },
  methods: {
    handleResize() {
      if (this.$isMobile()) {
        this.pluginListHeight = this.$refs.pluginManager.offsetHeight
      } else {
        this.pluginListHeight = this.$refs.pluginManager.offsetHeight - 235
      }
    },
    getTopItemClass(pluginType) {
      return {
        "top-select-btn-item": true,
        "top-btn-item-select": this.activeBtn == pluginType,
      }
    },
    getTagClass(tag) {
      return {
        "filter-tag-item": true,
        "active-tag": this.searchMenuType === tag,
      }
    },
    clickPluginType(pluginType) {
      this.activeBtn = pluginType
      this.searchMenuType = null
      this.pltKey++
    },
    getPluginCount() {
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_count`)
        .then((resp) => {
          if (!resp) {
            this.$message.error("获取插件数量失败：无效的响应")
            return
          }
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.pluginCount = resp.data
            }
          } else {
            this.$message.error(resp.info || "获取插件数量失败")
          }
        })
        .catch((error) => {
          this.$message.error("请求插件数量失败: " + error)
        })
    },
    getPluginMenuType() {
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_menu_type`)
        .then((resp) => {
          if (!resp) {
            this.$message.error("获取菜单类型失败：无效的响应")
            return
          }
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.menuTypeList = (
                Array.isArray(resp.data) ? resp.data : []
              ).filter(Boolean)
            }
          } else {
            this.$message.error(resp.info || "获取菜单类型失败")
          }
        })
        .catch((error) => {
          this.$message.error("请求菜单类型失败: " + error)
        })
    },
    selectMenuType(menuType) {
      if (this.searchMenuType !== menuType) {
        this.searchMenuType = menuType
        this.pltKey++
      } else {
        this.searchMenuType = ""
        this.pltKey++
      }
    },
    handleSelectionUpdate(selectedModules) {
      this.selectedPluginModules = selectedModules || []
    },

    cancelSelection() {
      this.selectedPluginModules = []
      this.$refs.pluginListRef?.clearSelection()
    },

    bulkToggleSwitch(enable) {
      if (this.selectedPluginModules.length === 0) return
      const actionText = enable ? "启用" : "禁用"
      const loading = this.$loading({
        lock: true,
        text: `正在批量${actionText}...`,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      })

      const updates = this.selectedPluginModules.map((module) => ({
        module: module,
        block_type: enable ? null : "ALL",
      }))

      this.putRequest(`${this.$root.prefix}/plugin/plugins/batch_update`, {
        updates: updates,
      })
        .then((resp) => {
          loading.close()
          if (!resp) {
            this.$message.error(`批量${actionText}失败：无效的响应`)
            return
          }
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              const result = resp.data
              if (result.success) {
                this.$message.success(
                  `成功${actionText} ${result.updated_count} 个插件！`
                )
                if (result.errors && result.errors.length > 0) {
                  result.errors.forEach((err) =>
                    this.$message.warning(`插件 ${err.module}: ${err.error}`)
                  )
                }
                this.cancelSelection()
                this.pltKey++
              } else {
                let errorMsg = `批量${actionText}失败`
                if (result.errors && result.errors.length > 0) {
                  errorMsg +=
                    ": " +
                    result.errors
                      .map((e) => `${e.module}(${e.error})`)
                      .join(", ")
                }
                this.$message.error(errorMsg)
              }
            }
          } else {
            this.$message.error(resp.info || `批量${actionText}失败`)
          }
        })
        .catch((error) => {
          loading.close()
          this.$message.error(`请求失败: ${error}`)
        })
    },

    bulkUpdateMenuType() {
      if (!this.targetMenuTypeBulk) {
        this.$message.warning("请先在上方选择目标菜单类型")
        return
      }
      if (this.selectedPluginModules.length === 0) return

      const loading = this.$loading({
        lock: true,
        text: "正在批量修改菜单类型...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      })

      const updates = this.selectedPluginModules.map((module) => ({
        module: module,
        menu_type: this.targetMenuTypeBulk,
      }))

      this.putRequest(`${this.$root.prefix}/plugin/plugins/batch_update`, {
        updates: updates,
      })
        .then((resp) => {
          loading.close()
          if (!resp) {
            this.$message.error("批量修改菜单类型失败：无效的响应")
            return
          }
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              const result = resp.data
              if (result.success) {
                this.$message.success(
                  `成功更新 ${result.updated_count} 个插件的菜单类型！`
                )
                if (result.errors && result.errors.length > 0) {
                  result.errors.forEach((err) =>
                    this.$message.warning(`插件 ${err.module}: ${err.error}`)
                  )
                }
                this.targetMenuTypeBulk = null
                this.cancelSelection()
                this.pltKey++
              } else {
                let errorMsg = "批量修改菜单类型失败"
                if (result.errors && result.errors.length > 0) {
                  errorMsg +=
                    ": " +
                    result.errors
                      .map((e) => `${e.module}(${e.error})`)
                      .join(", ")
                }
                this.$message.error(errorMsg)
              }
            }
          } else {
            this.$message.error(resp.info || "批量修改菜单类型失败")
          }
        })
        .catch((error) => {
          loading.close()
          this.$message.error("请求失败: " + error)
        })
    },

    addNewMenuType() {
      const newType = this.newMenuTypeName.trim()
      if (!newType) {
        this.$message.warning("菜单类型名称不能为空")
        return
      }
      const exists = this.menuTypeList.some(
        (type) => type.toLowerCase() === newType.toLowerCase()
      )
      if (exists) {
        this.$message.warning(`菜单类型 "${newType}" 已存在`)
      } else {
        this.menuTypeList.push(newType)
        this.$message.success(
          `菜单类型 "${newType}" 已添加，您可以现在将其应用到插件`
        )
      }
      this.showAddDialogFlag = false
    },
    openManageTypesDialog() {
      this.manageTypesDialogVisible = true
    },
    startRenameType(type) {
      this.showRenameDialogFlag = true
      this.oldRenameMenuTypeName = type
    },
    triggerRenameType() {
      if (!this.renameMenuTypeName) return

      const newName = this.renameMenuTypeName.trim()
      if (!newName) {
        this.$message.warning("菜单类型名称不能为空")
        return
      }
      if (newName === this.oldRenameMenuTypeName) {
        this.$message.info("名称未改变")
        return
      }

      const exists = this.menuTypeList.some(
        (type) =>
          type.toLowerCase() === newName.toLowerCase() &&
          type.toLowerCase() !== this.oldRenameMenuTypeName.toLowerCase()
      )
      if (exists) {
        this.$message.warning(`菜单类型名称 "${newName}" 已存在`)
        return
      }

      const loading = this.getLoading(".animate-pop-in")
      this.putRequest(`${this.$root.prefix}/plugin/menu_type/rename`, {
        old_name: this.oldRenameMenuTypeName,
        new_name: newName,
      })
        .then((resp) => {
          loading.close()
          if (!resp) {
            this.$message.error("重命名失败：无效的响应")
            return
          }
          if (resp.suc) {
            this.$message.success(resp.info || "重命名成功！")
            const index = this.menuTypeList.findIndex(
              (type) => type === this.oldRenameMenuTypeName
            )
            if (index !== -1) {
              this.menuTypeList.splice(index, 1, newName)
            }
            this.manageTypesDialogVisible = false
            this.showRenameDialogFlag = false
          } else {
            this.$message.error(resp.info || "重命名失败")
          }
        })
        .catch((error) => {
          loading.close()
          this.$message.error(`请求失败: ${error}`)
        })
    },
  },
}
</script>

<style scoped>
/* 二次元可爱风格动画 */
@keyframes bounce-in {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.3s ease-out;
}

/* 插件卡片悬停效果 */
.plugin-list-container {
  transition: all 0.3s ease;
}

.plugin-list-container:hover {
  box-shadow: 0 10px 25px rgba(236, 72, 153, 0.15);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .type-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }

  .type-selector button {
    border-radius: 8px !important;
  }

  .bulk-actions {
    padding: 8px;
  }

  .bulk-actions select {
    width: 100%;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(244, 114, 182, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.5);
}
</style>
