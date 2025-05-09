<template>
  <div class="main p-4 md:p-6 bg-pink-50">
    <!-- 标题部分 -->
    <div class="title text-center mb-6">
      <h1 class="text-3xl md:text-4xl font-bold text-purple-600 animate-bounce">
        <span class="inline-block transform rotate-3">✨</span>
        插件商店
        <span class="inline-block transform -rotate-3">✨</span>
      </h1>
      <div class="text-sm text-pink-400 mt-2">发现更多有趣的功能吧~</div>
    </div>

    <!-- 筛选部分 -->
    <div
      class="filter mb-6 flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <!-- 搜索框 -->
      <div class="search-input w-full md:w-1/3 relative">
        <el-input
          v-model="search"
          placeholder="搜索插件..."
          class="rounded-full"
          :class="{ 'focus:ring-2 focus:ring-pink-300': true }"
        >
          <template #prefix>
            <svg-icon icon-class="search" class="text-pink-400" />
          </template>
        </el-input>
      </div>

      <!-- 作者筛选 -->
      <!-- <div class="search-tag">
        <el-dropdown
          @command="handleCommand"
          trigger="click"
          class="cursor-pointer"
        >
          <div
            class="flex items-center px-4 py-2 rounded-full bg-white shadow-md hover:bg-pink-100 transition-colors duration-200 border border-pink-200"
            @mouseover="mouseover"
            @mouseout="mouseout"
          >
            <svg-icon :icon-class="authorIcon" class="mr-2 text-pink-500" />
            <span class="text-pink-600 font-medium">作者</span>
          </div>

          <el-dropdown-menu
            slot="dropdown"
            class="rounded-lg shadow-lg border border-pink-100 overflow-hidden"
          >
            <el-dropdown-item
              v-for="(v, i) in authorList"
              :key="i"
              :command="v"
              class="hover:bg-pink-50 text-pink-600 font-medium"
            >
              <div class="flex items-center">
                <svg-icon icon-class="user" class="mr-2 text-pink-400" />
                {{ v }}
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div> -->
    </div>

    <!-- 表格部分 -->
    <div
      class="table-container flex flex-col flex-1 min-h-0"
      :style="{ height: getTableBorderHeight() + 'px' }"
    >
      <div
        ref="tableWrapper"
        class="table-border bg-white rounded-xl p-4 shadow-lg border border-pink-100 flex-1 flex flex-col"
      >
        <el-table
          :data="filterTableData"
          stripe
          :height="tableHeight"
          border
          style="width: 100%"
          class="rounded-lg overflow-hidden flex-1"
          :row-class-name="tableRowClassName"
          :key="tableKey"
        >
          <el-table-column
            prop="id"
            label="ID"
            width="70"
            align="center"
            header-align="center"
          >
            <template #header>
              <span class="text-pink-500 font-bold">ID</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="name"
            label="名称"
            width="200px"
            header-align="center"
          >
            <template #header>
              <span class="text-pink-500 font-bold">名称</span>
            </template>
            <template slot-scope="scope">
              <div class="name-border flex items-center">
                <el-tooltip
                  :content="scope.row.name"
                  placement="top"
                  effect="light"
                >
                  <span
                    class="truncate max-w-[120px] md:max-w-[160px] ml-2 font-medium text-gray-700"
                  >
                    {{ scope.row.name }}
                  </span>
                </el-tooltip>

                <a
                  v-if="scope.row.github_url"
                  :href="scope.row.github_url"
                  target="_blank"
                  class="ml-2 hover:scale-110 transform transition-transform"
                >
                  <svg-icon
                    class="github-icon w-6 h-6 text-gray-600 hover:text-purple-600"
                    icon-class="github"
                  />
                </a>

                <span
                  v-if="installModule.includes(scope.row.module)"
                  class="is-install ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center"
                >
                  <svg-icon icon-class="check" class="mr-1 w-3 h-3" />
                  已安装
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="author"
            label="作者"
            width="180px"
            header-align="center"
          >
            <template #header>
              <span class="text-pink-500 font-bold">作者</span>
            </template>
            <template slot-scope="scope">
              <div class="flex items-center">
                <svg-icon
                  icon-class="user"
                  class="mr-2 text-pink-400 w-4 h-4"
                />
                <span class="text-gray-700">{{ scope.row.author }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="version"
            label="版本"
            width="100px"
            align="center"
            header-align="center"
          >
            <template #header>
              <span class="text-pink-500 font-bold">版本</span>
            </template>
            <template slot-scope="scope">
              <el-tag
                size="small"
                effect="plain"
                class="border border-pink-200 bg-pink-50 text-pink-600"
              >
                v{{ scope.row.version }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="plugin_type"
            label="类型"
            width="120px"
            align="center"
            header-align="center"
          >
            <template #header>
              <span class="text-pink-500 font-bold">类型</span>
            </template>
            <template slot-scope="scope">
              <el-tag
                :type="getPluginTypeColor(scope.row.plugin_type)"
                size="small"
                effect="dark"
              >
                {{ scope.row.plugin_type }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="description"
            label="简介"
            header-align="center"
          >
            <template #header>
              <span class="text-pink-500 font-bold">简介</span>
            </template>
            <template slot-scope="scope">
              <el-tooltip
                :content="scope.row.description"
                placement="top"
                effect="light"
              >
                <span class="line-clamp-2 text-gray-600">
                  {{ scope.row.description }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="420px"
            align="center"
            header-align="center"
          >
            <template #header>
              <span class="text-pink-500 font-bold">操作</span>
            </template>
            <template slot-scope="scope">
              <div class="flex flex-wrap justify-center gap-1 md:gap-2">
                <my-button
                  text="README"
                  icon="readme"
                  :iconWidth="20"
                  :iconHeight="20"
                  :height="28"
                  :width="80"
                  @click="handleReadme(scope.$index, scope.row)"
                  class="handle-btn bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                  :disabled="true"
                />

                <my-button
                  text="安装"
                  icon="download"
                  :iconWidth="20"
                  :iconHeight="20"
                  :height="28"
                  :width="80"
                  @click="handleInstall(scope.$index, scope.row)"
                  class="handle-btn bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                  :disabled="installModule.includes(scope.row.module)"
                />

                <my-button
                  text="更新"
                  icon="update"
                  :iconWidth="20"
                  :iconHeight="20"
                  :height="28"
                  :width="80"
                  @click="handleUpdate(scope.$index, scope.row)"
                  class="handle-btn bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border-yellow-200"
                  :disabled="!installModule.includes(scope.row.module)"
                />

                <my-button
                  text="移除"
                  icon="remove"
                  :iconWidth="20"
                  :iconHeight="20"
                  :height="28"
                  :width="80"
                  @click="handleRemove(scope.$index, scope.row)"
                  class="handle-btn bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                  :disabled="!installModule.includes(scope.row.module)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import MyButton from "../ui/MyButton.vue"
export default {
  components: { MyButton },
  name: "StoreTemplate",
  data() {
    return {
      handleType: null,
      authorIcon: "author-red",
      authorList: [],
      tableData: [],
      search: "",
      installModule: [],
      tableHeight: null,
      resizeObserver: null,
      tableKey: 0, // 用于强制刷新表格
    }
  },
  computed: {
    filterTableData() {
      const search = this.search.trim()
      if (search) {
        return this.tableData.filter((v) => {
          return v.author.includes(search) || v.name.includes(search)
        })
      } else {
        return this.tableData
      }
    },
  },
  mounted() {
    this.getPluginList()
    this.calculateTableHeight()
    this.setupResizeObserver()
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  },
  methods: {
    getTableBorderHeight() {
      if (this.$isMobile()) {
        return this.tableHeight
      }
      return this.tableHeight - 239
    },
    calculateTableHeight() {
      this.$nextTick(() => {
        const headerHeight =
          document.querySelector(".title")?.offsetHeight || 100
        const filterHeight =
          document.querySelector(".filter")?.offsetHeight || 80
        const padding = 32 // 上下边距

        // 计算可用高度
        const windowHeight = window.innerHeight
        const availableHeight =
          windowHeight - headerHeight - filterHeight - padding

        // 设置最小高度限制
        const newHeight = Math.max(availableHeight, 300)

        // 只有当高度确实变化时才更新
        if (this.tableHeight !== newHeight) {
          this.tableHeight = newHeight

          this.tableKey += 1 // 强制表格重新渲染
        }
      })
    },

    setupResizeObserver() {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateTableHeight()
      })

      if (this.$refs.tableWrapper) {
        this.resizeObserver.observe(this.$refs.tableWrapper)
      }

      window.addEventListener("resize", this.calculateTableHeight)
    },
    tableRowClassName({ row }) {
      return this.installModule.includes(row.module) ? "installed-row" : ""
    },

    getPluginTypeColor(type) {
      const typeMap = {
        功能: "success",
        娱乐: "warning",
        工具: "",
        管理: "danger",
        其他: "info",
      }
      return typeMap[type] || ""
    },

    handleReadme(i, data) {
      this.$message.info("README功能开发中，敬请期待~")
    },

    handleUpdate(i, data) {
      this.$confirm("确定要更新这个插件吗?", "更新确认", {
        confirmButtonText: "确定更新",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirm-box",
        confirmButtonClass: "el-button--warning",
        iconClass: "el-icon-question text-yellow-500",
      })
        .then(() => {
          var loading = this.$loading({
            target: ".table-border",
            text: "正在更新插件...",
            spinner: "el-icon-loading",
            background: "rgba(255, 255, 255, 0.7)",
          })

          this.postRequest(`${this.$root.prefix}/store/update_plugin`, {
            id: data.id,
          })
            .then((resp) => {
              loading.close()
              if (resp.suc) {
                if (resp.warning) {
                  this.$message.warning({
                    message: resp.warning,
                    iconClass: "el-icon-warning-outline",
                  })
                } else {
                  this.$message.success({
                    message: resp.info || "插件更新成功!",
                    iconClass: "el-icon-success",
                  })
                  this.getPluginList()
                }
              } else {
                this.$message.error({
                  message: resp.info || "插件更新失败",
                  iconClass: "el-icon-error",
                })
              }
            })
            .catch((error) => {
              loading.close()
              this.$message.error({
                message: "更新过程中发生错误: " + (error.message || error),
                iconClass: "el-icon-error",
              })
              console.error("[Plugin Store] Update error:", error)
            })
        })
        .catch(() => {
          this.$message.info({
            message: "已取消更新",
            iconClass: "el-icon-info",
          })
        })
    },

    handleRemove(i, data) {
      this.$confirm("确定要移除这个插件吗?", "移除确认", {
        confirmButtonText: "确定移除",
        cancelButtonText: "取消",
        type: "error",
        customClass: "confirm-box",
        confirmButtonClass: "el-button--danger",
        iconClass: "el-icon-warning text-red-500",
      })
        .then(() => {
          var loading = this.$loading({
            target: ".table-border",
            text: "正在移除插件...",
            spinner: "el-icon-loading",
            background: "rgba(255, 255, 255, 0.7)",
          })

          this.postRequest(`${this.$root.prefix}/store/remove_plugin`, {
            id: data.id,
          })
            .then((resp) => {
              loading.close()
              if (resp.suc) {
                if (resp.warning) {
                  this.$message.warning({
                    message: resp.warning,
                    iconClass: "el-icon-warning-outline",
                  })
                } else {
                  this.$message.success({
                    message: resp.info || "插件移除成功!",
                    iconClass: "el-icon-success",
                  })
                  this.getPluginList()
                }
              } else {
                this.$message.error({
                  message: resp.info || "插件移除失败",
                  iconClass: "el-icon-error",
                })
              }
            })
            .catch((error) => {
              loading.close()
              this.$message.error({
                message: "移除过程中发生错误: " + (error.message || error),
                iconClass: "el-icon-error",
              })
              console.error("[Plugin Store] Remove error:", error)
            })
        })
        .catch(() => {
          this.$message.info({
            message: "已取消移除",
            iconClass: "el-icon-info",
          })
        })
    },

    handleInstall(i, data) {
      this.$confirm("确定要安装这个插件吗?", "安装确认", {
        confirmButtonText: "确定安装",
        cancelButtonText: "取消",
        type: "success",
        customClass: "confirm-box",
        confirmButtonClass: "el-button--success",
        iconClass: "el-icon-question text-green-500",
      })
        .then(() => {
          var loading = this.$loading({
            target: ".table-border",
            text: "正在安装插件...",
            spinner: "el-icon-loading",
            background: "rgba(255, 255, 255, 0.7)",
          })

          this.postRequest(`${this.$root.prefix}/store/install_plugin`, {
            id: data.id,
          })
            .then((resp) => {
              loading.close()
              if (resp.suc) {
                if (resp.warning) {
                  this.$message.warning({
                    message: resp.warning,
                    iconClass: "el-icon-warning-outline",
                  })
                } else {
                  this.$message.success({
                    message: resp.info || "插件安装成功!",
                    iconClass: "el-icon-success",
                  })
                  this.getPluginList()
                }
              } else {
                this.$message.error({
                  message: resp.info || "插件安装失败",
                  iconClass: "el-icon-error",
                })
              }
            })
            .catch((error) => {
              loading.close()
              this.$message.error({
                message: "安装过程中发生错误: " + (error.message || error),
                iconClass: "el-icon-error",
              })
              console.error("[Plugin Store] Install error:", error)
            })
        })
        .catch(() => {
          this.$message.info({
            message: "已取消安装",
            iconClass: "el-icon-info",
          })
        })
    },

    handleCommand(s) {
      this.search = s
      this.$message.success(`已筛选作者: ${s}`)
    },

    getPluginList() {
      var loading = this.getLoading(".table-border")

      this.getRequest(`${this.$root.prefix}/store/get_plugin_store`)
        .then((resp) => {
          loading.close()
          if (resp && resp.suc) {
            if (resp.warning) {
              this.$message.warning({
                message: resp.warning,
                iconClass: "el-icon-warning-outline",
              })
            } else {
              this.$message.success({
                message: resp.info || "获取插件商店列表成功!",
                iconClass: "el-icon-success",
              })
              this.tableData = Array.isArray(resp.data.plugin_list)
                ? resp.data.plugin_list
                : []
              this.installModule = resp.data.install_module || []
              this.authorList = []

              if (Array.isArray(resp.data.plugin_list)) {
                for (let v of resp.data.plugin_list) {
                  if (v && v.author && !this.authorList.includes(v.author)) {
                    this.authorList.push(v.author)
                  }
                }
              }
            }
          } else {
            const errorMsg = resp
              ? resp.info
              : "无法获取插件商店列表，请检查网络连接或后端服务。"
            this.$message.error({
              message: errorMsg || "获取插件商店列表失败",
              iconClass: "el-icon-error",
            })
            this.tableData = []
            this.installModule = []
            this.authorList = []
          }
        })
        .catch((error) => {
          loading.close()
          this.$message.error({
            message: `获取插件商店列表时出错: ${error.message || error}`,
            iconClass: "el-icon-error",
          })
          console.error("[StoreTemplate Error] getPluginList catch:", error)
          this.tableData = []
          this.installModule = []
          this.authorList = []
        })
    },

    mouseover() {
      this.authorIcon = "author-white"
    },

    mouseout() {
      this.authorIcon = "author-red"
    },
  },
}
</script>

<style lang="scss" scoped>
.table-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.table-border {
  transition: height 0.3s ease;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  ::v-deep .el-table {
    flex: 1;

    .el-table__body-wrapper {
      overflow-y: auto;
    }
  }
}

.main {
  .title {
    h1 {
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }
  }

  .search-input {
    ::v-deep .el-input__inner {
      border-radius: 9999px;
      border: 1px solid #f3a3c3;
      padding-left: 35px;
      background-color: rgba(255, 255, 255, 0.8);
      transition: all 0.3s;

      &:focus {
        border-color: #ec4899;
        box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
      }
    }
  }

  .table-border {
    ::v-deep .el-table {
      --el-table-border-color: #f9b8d0;
      --el-table-header-bg-color: #fdf2f8;
      --el-table-row-hover-bg-color: #fce7f3;

      th {
        font-weight: bold;
        color: #831843;
      }

      td {
        border-bottom: 1px solid #fbcfe8;
      }

      .el-table__body tr.installed-row {
        background-color: #f0fdf4;

        &:hover {
          background-color: #dcfce7 !important;
        }
      }

      .el-table__body tr.el-table__row--striped {
        background-color: #fff5f7;

        &.installed-row {
          background-color: #ecfdf5;
        }
      }
    }
  }
}

// 二次元风格弹窗
.confirm-box {
  border-radius: 16px !important;
  border: 2px solid #f9a8d4 !important;
  background-color: #fdf2f8 !important;

  .el-message-box__header {
    background-color: #fce7f3;
    border-radius: 14px 14px 0 0;
    padding: 15px 20px;

    .el-message-box__title {
      color: #831843;
      font-weight: bold;
    }
  }

  .el-message-box__content {
    padding: 20px;
    color: #701a75;
  }

  .el-message-box__btns {
    padding: 15px 20px;

    .el-button {
      border-radius: 9999px;
      padding: 10px 20px;
      font-weight: bold;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .main {
    padding: 2px;

    .title h1 {
      font-size: 1.8rem;
    }

    .filter {
      flex-direction: column;

      .search-input {
        width: 100%;
      }
    }

    .table-border {
      padding: 8px;

      ::v-deep .el-table {
        font-size: 0.85rem;

        th,
        td {
          padding: 8px 4px;
        }
      }
    }
  }
}

// 动画效果
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
