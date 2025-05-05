<template>
  <div
    ref="container"
    class="dir-tree-container bg-gradient-to-br from-pink-50 to-purple-50 p-4 h-full overflow-y-auto cute-scrollbar"
  >
    <!-- 顶部面包屑导航 -->
    <div
      ref="breadcrumb"
      class="breadcrumb bg-white rounded-xl p-3 mb-4 shadow-md flex items-center flex-wrap"
    >
      <span v-for="(path, i) in pathList" :key="i" class="flex items-center">
        <span
          class="path-item text-purple-600 hover:text-pink-500 cursor-pointer transition-colors"
          @click="clickPath(i)"
        >
          {{ path }}
        </span>
        <span class="mx-2 text-gray-400" v-if="i < pathList.length - 1">/</span>
      </span>
    </div>

    <!-- 主要内容区 - 上下布局 -->
    <div class="content-area flex flex-col lg:flex-row gap-4">
      <!-- 资源图表区 -->
      <div
        ref="chartArea"
        class="chart-area bg-white rounded-2xl p-4 shadow-md flex-1"
        :style="{ height: chartAreaHeight + 'px' }"
      >
        <div
          ref="resourcesChart"
          class="w-full h-full"
          :style="{ height: chartAreaHeight + 'px' }"
        ></div>
      </div>

      <!-- 目录树区 -->
      <div
        ref="treeArea"
        class="tree-area bg-white rounded-2xl p-4 shadow-md flex-1 lg:w-1/2"
        :style="{ height: treeAreaHeight + 'px' }"
      >
        <!-- 标题和操作按钮 -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-purple-600 flex items-center">
            <svg-icon icon-class="folder-tree" class="mr-2" />
            目录结构树
          </h3>
          <div class="flex space-x-2">
            <my-button
              icon="add-file"
              class="btn cute-btn"
              :width="40"
              :height="32"
              content="添加文件"
              @click="clickRootAddFile"
            />
            <my-button
              icon="add-folder"
              content="添加文件夹"
              class="btn cute-btn"
              :width="40"
              :height="32"
              @click="clickRootAddFolder"
            />
            <my-button
              icon="refresh"
              content="刷新"
              class="btn cute-btn"
              :width="40"
              :height="32"
              @click="treeKey++"
            />
          </div>
        </div>

        <!-- 添加文件/文件夹输入框 -->
        <div class="mb-4 space-y-2">
          <div class="flex items-center space-x-2" v-if="showAddFile">
            <el-input
              v-model="addFileName"
              placeholder="请输入文件名称"
              class="cute-input"
            ></el-input>
            <my-button
              text="确定"
              :height="30"
              :width="50"
              class="cute-btn"
              @click="addFile({ createName: addFileName })"
            />
            <my-button
              text="取消"
              :height="30"
              :width="50"
              class="cute-btn-secondary"
              @click="
                showAddFile = false
                addFileName = ''
              "
            />
          </div>
          <div class="flex items-center space-x-2" v-if="showAddFolder">
            <el-input
              v-model="addFileName"
              placeholder="请输入文件夹名称"
              class="cute-input"
            ></el-input>
            <my-button
              text="确定"
              :height="30"
              :width="50"
              class="cute-btn"
              @click="addFolder({ createFolderName: addFileName })"
            />
            <my-button
              text="取消"
              :height="30"
              :width="50"
              class="cute-btn-secondary"
              @click="
                showAddFolder = false
                addFileName = ''
              "
            />
          </div>
        </div>

        <!-- 树形目录 -->
        <el-tree
          ref="tree"
          :data="treeData"
          :props="props"
          :load="loadNode"
          lazy
          class="cute-tree"
          :key="treeKey"
          :default-expanded-keys="defaultExpandedKeys"
          node-key="full_path"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
          :style="{ height: treeHeight + 'px' }"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="flex items-center">
              <svg-icon
                :iconClass="getIcon(data)"
                path="vscode-icons"
                class="mr-2 text-lg"
              />
              <span class="truncate">{{ node.label }}</span>
            </span>
            <span>
              <el-popover
                placement="right"
                width="120"
                trigger="click"
                :ref="`popover-${data.full_path}`"
                popper-class="cute-popover"
                @hide="hidePopover(data)"
              >
                <template v-if="data.is_file">
                  <p class="pop-item" @click="editCode(data, true)">查看</p>
                  <p
                    class="pop-item"
                    v-if="!data.is_image"
                    @click="editCode(data, false)"
                  >
                    编辑
                  </p>
                  <p class="pop-item" @click="showRename(data)">重命名</p>
                  <div class="rename-input" v-if="data.showRename">
                    <el-input
                      v-model="data.rename"
                      class="cute-input"
                    ></el-input>
                    <my-button
                      text="确定"
                      :height="30"
                      :width="50"
                      class="cute-btn mt-2"
                      @click="rename(data, 'file')"
                    />
                  </div>
                  <p class="pop-item text-red-500" @click="deleteFile(data)">
                    删除
                  </p>
                </template>
                <template v-else>
                  <p class="pop-item" @click="showCreate(data)">新建文件</p>
                  <div class="rename-input" v-if="data.showCreate">
                    <el-input
                      v-model="data.createName"
                      class="cute-input"
                    ></el-input>
                    <my-button
                      text="确定"
                      :height="30"
                      :width="50"
                      class="cute-btn mt-2"
                      @click="addFile(data)"
                    />
                  </div>
                  <p class="pop-item" @click="showCreateFolder(data)">
                    新建文件夹
                  </p>
                  <div class="rename-input" v-if="data.showCreateFolder">
                    <el-input
                      v-model="data.createFolderName"
                      class="cute-input"
                    ></el-input>
                    <my-button
                      text="确定"
                      :height="30"
                      :width="50"
                      class="cute-btn mt-2"
                      @click="addFolder(data)"
                    />
                  </div>
                  <p class="pop-item" @click="showRename(data)">重命名</p>
                  <div class="rename-input" v-if="data.showRename">
                    <el-input
                      v-model="data.rename"
                      class="cute-input"
                    ></el-input>
                    <my-button
                      text="确定"
                      :height="30"
                      :width="50"
                      class="cute-btn mt-2"
                      @click="rename(data, 'folder')"
                    />
                  </div>
                  <p class="pop-item text-red-500" @click="deleteFolder(data)">
                    删除
                  </p>
                </template>
                <svg-icon
                  :iconClass="
                    data.is_file ? 'file-settings' : 'folder-settings'
                  "
                  @click.native.stop="clickPopover"
                  slot="reference"
                  class="text-gray-500 hover:text-pink-500 cursor-pointer transition-colors"
                />
              </el-popover>
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <!-- 编辑器和图片查看器 -->
    <edit-file
      v-if="editVisible"
      @close="
        editVisible = false
        codeFullPath = ''
        codeFileName = ''
      "
      :name="codeFileName"
      :fullPath="codeFullPath"
      :onlyRead="onlyRead"
    />
    <image-view
      v-if="imageVisible"
      @close="
        imageVisible = false
        codeFullPath = ''
        codeFileName = ''
      "
      :name="codeFileName"
      :fullPath="codeFullPath"
    />
  </div>
</template>

<script>
import SvgIcon from "../SvgIcon/SvgIcon.vue"
import MyButton from "../ui/MyButton.vue"
import EditFile from "./EditFile.vue"
import ImageView from "./ImageView.vue"

export default {
  components: { SvgIcon, MyButton, EditFile, ImageView },
  name: "DirTree",
  data() {
    return {
      // 原有数据属性
      containerHeight: 0,
      breadcrumbHeight: 0,
      chartAreaHeight: 0,
      treeAreaHeight: 0,
      treeHeight: 0,
      windowHeight: window.innerHeight,
      chartHeight: 0,
      mainHeight: 0,
      mainTreeHeight: 0,
      codeFullPath: "",
      codeFileName: "",
      onlyRead: false,
      defaultExpandedKeys: [],
      treeData: [],
      resourcesChart: null,
      editVisible: false,
      imageVisible: false,
      treeKey: 0,
      vscodeIcons: [],
      showAddFile: false,
      showAddFolder: false,
      addFileName: "",
      pathList: ["/"],
      props: {
        label: "name",
        children: "children",
        isLeaf: "is_file",
      },
      option: {
        title: {
          text: "资源文件夹",
          subtext: "MB",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} MB ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "资源文件夹",
            type: "pie",
            radius: "50%",
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
    }
  },
  mounted() {
    this.resourcesChart = this.$echarts.init(this.$refs.resourcesChart)
    // this.getDir()
    this.loadIcons()
    this.getResourcesSize()
    // 添加响应式处理
    this.handleResize()
    window.addEventListener("resize", this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
  },
  methods: {
    handleResize() {
      this.$nextTick(() => {
        // 获取容器和各个区域的实际高度
        this.containerHeight = this.$refs.container?.clientHeight || 0
        this.breadcrumbHeight = this.$refs.breadcrumb?.clientHeight || 0

        // 计算剩余可用高度 (减去面包屑、内边距和间距)
        const remainingHeight =
          this.containerHeight - this.breadcrumbHeight - 32 // 32 = 16(padding) + 16(gap)

        // 设置图表区域和树区域的高度
        this.chartAreaHeight = remainingHeight - 20
        this.treeAreaHeight = remainingHeight - 20

        // 计算树形控件内部可用高度 (减去标题、按钮组和输入框区域)
        const treeHeaderHeight = 120 // 估算标题和按钮区域高度
        this.treeHeight = Math.max(300, this.treeAreaHeight - treeHeaderHeight)

        // 重新调整图表大小
        if (this.resourcesChart) {
          this.resourcesChart.resize()
        }
      })
    },
    editCode(data, onlyRead) {
      this.codeFullPath = data.full_path
      this.codeFileName = data.name
      if (!data.is_image) {
        this.onlyRead = onlyRead
        this.editVisible = true
      } else {
        this.imageVisible = true
      }
    },
    hidePopover(data) {
      data.createName = ""
      data.createFolderName = ""
      data.rename = ""
      data.showRename = false
      data.showCreate = false
      data.showCreateFolder = false
    },
    clickRootAddFile() {
      this.showAddFolder = false
      this.showAddFile = !this.showAddFile
    },
    clickRootAddFolder() {
      this.showAddFile = false
      this.showAddFolder = !this.showAddFolder
    },
    clickPopover() {
      for (const key in this.$refs) {
        if (key.indexOf("popover-") !== -1 && this.$refs[key]) {
          this.$refs[key].doClose()
        }
      }
    },
    showRename(data) {
      data.showCreateFolder = false
      data.showCreate = false
      data.showRename = !data.showRename
    },
    showCreate(data) {
      data.showCreateFolder = false
      data.showRename = false
      data.showCreate = !data.showCreate
    },
    showCreateFolder(data) {
      data.showRename = false
      data.showCreate = false
      data.showCreateFolder = !data.showCreateFolder
    },
    // 刷新树节点
    refreshNode(key) {
      if (!key) {
        this.treeKey++
      } else {
        let node = this.$refs.tree.getNode(key)
        node.loaded = false
        node.expand()
      }
    },
    nodeExpand(data) {
      this.defaultExpandedKeys.push(data.full_path)
    },
    nodeCollapse(data) {
      const index = this.defaultExpandedKeys.indexOf(data.full_path)
      if (index != -1) {
        this.defaultExpandedKeys.splice(index, 1)
      }
    },
    addFolder(data) {
      if (!data.createFolderName || !data.createFolderName.trim()) {
        return
      }
      const loading = this.getLoading(".main-tree")
      this.postRequest(`${this.$root.prefix}/system/add_folder`, {
        parent: data.full_path,
        name: data.createFolderName,
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
        this.refreshNode(data.parent)
        loading.close()
      })
      this.addFileName = ""
      this.showAddFolder = false
      data.createName = ""
      data.showCreate = false
    },
    addFile(data) {
      if (!data.createName || !data.createName.trim()) {
        return
      }
      const loading = this.getLoading(".main-tree")
      this.postRequest(`${this.$root.prefix}/system/add_file`, {
        parent: data.full_path,
        name: data.createName,
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
        this.refreshNode(data.parent)
        loading.close()
      })
      data.createName = ""
      data.showCreate = false
      this.showAddFile = false
      this.addFileName = ""
    },
    deleteFolder(data) {
      this.$confirm("确认删除文件夹吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: true,
        type: "warning",
      }).then(() => {
        const loading = this.getLoading(".main-tree")
        this.postRequest(`${this.$root.prefix}/system/delete_folder`, {
          full_path: data.full_path,
        }).then((resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.getResourcesSize()
            }
          } else {
            this.$message.error(resp.info)
          }
          this.refreshNode(data.parent)
          loading.close()
        })
      })
    },
    deleteFile(data) {
      this.$confirm("确认删除文件吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: true,
        type: "warning",
      }).then(() => {
        const loading = this.getLoading(".main-tree")
        this.postRequest(`${this.$root.prefix}/system/delete_file`, {
          full_path: data.full_path,
        }).then((resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.getResourcesSize()
            }
          } else {
            this.$message.error(resp.info)
          }
          this.refreshNode(data.parent)
          loading.close()
        })
      })
    },
    rename(data, type) {
      let url = ""
      if (type == "file") {
        url = `${this.$root.prefix}/system/rename_file`
      } else {
        url = `${this.$root.prefix}/system/rename_folder`
      }
      const loading = this.getLoading(".main-tree")
      this.postRequest(url, {
        parent: data.parent,
        old_name: data.name,
        name: data.rename,
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
        this.refreshNode(data.parent)
        loading.close()
      })
      data.rename = ""
      data.showRename = false
    },
    loadIcons() {
      const req = require.context(
        "@/assets/icons/svg/vscode-icons",
        false,
        /\.svg$/
      )
      const requireAll = (requireContext) => requireContext.keys()

      const re = /\.\/(.*)\.svg/

      this.vscodeIcons = requireAll(req).map((i) => {
        return i.match(re)[1]
      })
    },
    z2d(t) {
      const map = {
        py: "python",
        yml: "yaml",
        jpg: "image",
        jpeg: "image",
        png: "image",
        gif: "image",
        txt: "text",
      }
      return map[t]
    },
    getIcon(data) {
      if (!data.name) {
        return "default_file"
      }
      if (data.is_file) {
        const arr = data.name.split(".")
        const end = arr[arr.length - 1]
        const t = this.z2d(end) || end

        if (this.vscodeIcons.includes(`file_type_${t}`)) {
          return `file_type_${t}`
        }
        return "default_file"
      } else {
        if (this.vscodeIcons.includes(`folder_type_${data.name}`)) {
          return `folder_type_${data.name}`
        }
        return "default_folder"
      }
    },
    clickPath(i) {
      this.pathList = this.pathList.splice(0, i + 1)
      const tmpPath = [...this.pathList]
      tmpPath.shift()

      this.getResourcesSize(tmpPath.join("/"))
    },
    showFolderSize(param) {
      const data = param.data
      if (data.is_dir) {
        this.pathList.push(data.name)
        this.getResourcesSize(data.full_path)
      }
    },
    getResourcesSize(full_path) {
      const loading = this.getLoading(".chart-box")
      this.getRequest(`${this.$root.prefix}/system/get_resources_size`, {
        full_path,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            const tmpOpt = JSON.parse(JSON.stringify(this.option))
            if (resp.data) {
              tmpOpt.series[0].data = resp.data.map((e) => {
                return { value: e.size.toFixed(2), ...e }
              })
              this.resourcesChart.setOption(tmpOpt)
              this.resourcesChart.on("click", this.showFolderSize)
            }
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    async getDir(parent) {
      const resp = await this.getRequest(
        `${this.$root.prefix}/system/get_dir_list`,
        {
          path: parent,
        }
      )
      if (resp.suc) {
        if (resp.warning) {
          this.$message.warning(resp.warning)
        } else {
          this.$message.success(resp.info)
          return resp.data
        }
      } else {
        this.$message.error(resp.info)
      }
      return []
    },
    async loadNode(node, resolve) {
      const parent = node.data.parent
        ? node.data.parent + "/" + node.data.name
        : node.data.name
      const data = (await this.getDir(parent)).map((e) => {
        return {
          ...e,
          showRename: false,
          showCreate: false,
          showCreateFolder: false,
          rename: "",
          createName: "",
          createFolderName: "",
          full_path: e.parent ? `${e.parent}/${e.name}` : e.name,
        }
      })

      resolve(data)
    },
  },
}
</script>

<style scoped>
/* 二次元风格样式 */
.dir-tree-container {
  --cute-primary: #ec4899;
  --cute-secondary: #a855f7;
  --cute-bg: #fff1f8;
}

/* 面包屑导航 */
.breadcrumb {
  background: linear-gradient(145deg, #ffffff, #fdf4ff);
  border: 1px solid rgba(236, 72, 153, 0.2);
}

.path-item {
  padding: 2px 6px;
  border-radius: 4px;
}

.path-item:hover {
  background-color: rgba(236, 72, 153, 0.1);
}

/* 卡片区域 */
.chart-area,
.tree-area {
  border: 1px solid rgba(236, 72, 153, 0.15);
  background: linear-gradient(145deg, #ffffff, #fdf4ff);
  transition: all 0.3s ease;
}

.chart-area:hover,
.tree-area:hover {
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.15);
  transform: translateY(-2px);
}

/* 树形控件 */
.cute-tree {
  background: transparent;
  overflow: auto;
}

.cute-tree :deep(.el-tree-node__content) {
  height: 36px;
  padding: 0 8px;
  border-radius: 6px;
  margin: 2px 0;
  transition: all 0.2s;
}

.cute-tree :deep(.el-tree-node__content:hover) {
  background-color: rgba(236, 72, 153, 0.1);
}

.cute-tree :deep(.el-tree-node:focus > .el-tree-node__content) {
  background-color: rgba(236, 72, 153, 0.15);
}

/* 按钮样式 */
.cute-btn {
  background-color: var(--cute-primary);
  color: white;
  border-radius: 8px;
  transition: all 0.2s;
}

.cute-btn:hover {
  background-color: #db2777;
  transform: translateY(-1px);
}

.cute-btn-secondary {
  background-color: white;
  color: var(--cute-primary);
  border: 1px solid var(--cute-primary);
  border-radius: 8px;
}

.cute-btn-secondary:hover {
  background-color: rgba(236, 72, 153, 0.1);
}

/* 输入框样式 */
.cute-input :deep(.el-input__inner) {
  border-radius: 8px;
  border: 1px solid rgba(236, 72, 153, 0.3);
}

.cute-input :deep(.el-input__inner:focus) {
  border-color: var(--cute-primary);
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
}

/* 弹出菜单项 */
.pop-item {
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.pop-item:hover {
  background-color: rgba(236, 72, 153, 0.1);
  color: var(--cute-primary);
}

/* 滚动条 */
.cute-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.cute-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(236, 72, 153, 0.5);
  border-radius: 4px;
}

.cute-scrollbar::-webkit-scrollbar-track {
  background-color: rgba(236, 72, 153, 0.1);
  border-radius: 4px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dir-tree-container {
    padding: 12px;
  }

  .content-area {
    flex-direction: column;
  }

  .tree-area {
    width: 100% !important;
  }

  .btn-group {
    flex-direction: column;
    gap: 8px;
  }

  .btn {
    width: 100% !important;
    margin-right: 0 !important;
  }
}

.cute-btn {
  background-color: var(--cute-primary);
  color: white;
  border-radius: 8px;
  transition: all 0.2s;
}

.cute-btn:hover {
  background-color: #db2777;
  transform: translateY(-1px);
}

.cute-btn-secondary {
  background-color: white;
  color: var(--cute-primary);
  border: 1px solid var(--cute-primary);
  border-radius: 8px;
}

.cute-btn-secondary:hover {
  background-color: rgba(236, 72, 153, 0.1);
}
</style>

<style>
/* 全局弹出框样式 */
.cute-popover {
  border: 1px solid rgba(236, 72, 153, 0.2) !important;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.1) !important;
  border-radius: 10px !important;
  background: linear-gradient(145deg, #ffffff, #fdf4ff) !important;
}

.cute-popover .popper__arrow::after {
  border-bottom-color: #fdf4ff !important;
}
</style>
