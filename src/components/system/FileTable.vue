<template>
  <div
    class="kawaii-file-manager"
    :style="{ backgroundColor: 'var(--bg-color)' }"
  >
    <!-- 面包屑导航 -->
    <div
      class="breadcrumb rounded-xl p-3 mb-4 shadow"
      :style="{
        backgroundColor: 'var(--bg-color-secondary)',
        border: '1px solid var(--border-color)',
      }"
    >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(path, i) in pathList"
          :key="i"
          @click.native="clickPath(i)"
          class="cursor-pointer"
          :style="{ color: 'var(--text-color)' }"
        >
          {{ path || "首页" }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons mb-4 flex flex-wrap gap-2">
      <CuteButton
        size="sm"
        type="primary"
        solid
        @click="clickRootAddFile"
        icon="add-file"
        :iconColor="'var(--button-icon-color-primary)'"
      >
        新建文件
      </CuteButton>
      <CuteButton
        size="sm"
        type="primary"
        solid
        @click="clickRootAddFolder"
        icon="add-folder"
        :iconColor="'var(--button-icon-color-primary)'"
      >
        新建文件夹
      </CuteButton>
      <CuteButton
        size="sm"
        type="info"
        solid
        @click="refreshFiles"
        icon="refresh"
        :iconColor="'var(--button-icon-color-info)'"
      >
        刷新
      </CuteButton>
    </div>

    <!-- 文件表格 -->
    <div
      class="file-table-container rounded-xl shadow"
      :style="{
        backgroundColor: 'var(--bg-color-secondary)',
        border: '1px solid var(--border-color)',
      }"
    >
      <el-table
        :data="fileList"
        style="width: 100%"
        :height="getTableHeight()"
        highlight-current-row
        @row-dblclick="handleDoubleClick"
        class="kawaii-table"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="名称" minwidth="300">
          <template slot-scope="scope">
            <div class="flex items-center">
              <svg-icon
                :iconClass="getIconClass(scope.row)"
                class="mr-2 text-xl"
                :style="{ color: 'var(--text-color)' }"
              ></svg-icon>
              <span :style="{ color: 'var(--text-color)' }">{{
                scope.row.name
              }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="mtime" label="修改时间" min-width="180">
          <template slot-scope="scope">
            <span :style="{ color: 'var(--text-color)' }">{{
              formatDate(scope.row.mtime)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="size" label="大小" min-width="120">
          <template slot-scope="scope">
            <span :style="{ color: 'var(--text-color)' }">{{
              scope.row.is_file ? formatSize(scope.row.size) : "-"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.is_file"
              @click.stop="editFile(scope.row)"
              type="text"
              icon="el-icon-edit"
              :style="{ color: 'var(--primary-color)' }"
              title="编辑"
            ></el-button>
            <el-button
              v-if="scope.row.is_file && scope.row.is_image"
              @click.stop="viewImage(scope.row)"
              type="text"
              icon="el-icon-view"
              :style="{ color: 'var(--success-color)' }"
              title="查看"
            ></el-button>
            <el-button
              @click.stop="showRenameDialog(scope.row)"
              type="text"
              icon="el-icon-edit-outline"
              :style="{ color: 'var(--info-color)' }"
              title="重命名"
            ></el-button>
            <el-button
              @click.stop="showDeleteDialog(scope.row)"
              type="text"
              icon="el-icon-delete"
              :style="{ color: 'var(--danger-color)' }"
              title="删除"
            ></el-button>
          </template>
        </el-table-column>

        <!-- 空状态 -->
        <div slot="empty" class="empty-state">
          <i
            class="icon-empty-folder text-5xl mb-4"
            :style="{ color: 'var(--text-color-disabled)' }"
          ></i>
          <p :style="{ color: 'var(--text-color-secondary)' }">
            当前目录为空，点击上方按钮添加文件或文件夹吧~
          </p>
        </div>
      </el-table>
    </div>

    <!-- 返回上级按钮（固定在表格底部） -->
    <div
      v-if="currentPath !== ''"
      @click="navigateUp"
      class="fixed bottom-4 right-4 p-3 rounded-full shadow-lg cursor-pointer transition-colors"
      :style="{
        backgroundColor: 'var(--primary-color)',
        color: 'var(--button-icon-color-primary)',
      }"
    >
      <i class="el-icon-upload2 text-xl"></i>
    </div>

    <!-- 各种对话框（保持原样） -->
    <NeonDialog
      :visible.sync="showCreateDialog"
      :title="createType === 'file' ? '新建文件' : '新建文件夹'"
      :icon-class="createType === 'file' ? 'add-file1' : 'add-folder1'"
      @confirm="confirmCreate"
    >
      <NeonInput
        v-model="newItemName"
        class="fm-input"
        :placeholder="
          createType === 'file' ? '输入文件名称...' : '输入文件夹名称...'
        "
      />
    </NeonDialog>

    <NeonDialog
      :visible.sync="showRenameDialogFlag"
      :title="renameType === 'file' ? '重命名文件' : '重命名文件夹'"
      icon-class="rename1"
      @confirm="confirmRename"
    >
      <NeonInput
        v-model="renameValue"
        class="fm-input"
        :placeholder="
          renameType === 'file'
            ? '输入重命名文件名称...'
            : '输入重命名文件夹名称...'
        "
      />
    </NeonDialog>

    <!-- 删除确认对话框 -->
    <NeonDialog
      :visible.sync="showDeleteDialogFlag"
      title="确认删除"
      type="danger"
      icon-class="warning"
      confirm-text="删除"
      @confirm="confirmDelete"
    >
      <p>
        确定要永久删除
        <span class="text-pink-600 font-bold">{{ itemToDelete.name }}</span>
        吗？
      </p>
    </NeonDialog>

    <!-- 文件编辑器 -->
    <edit-file
      v-if="editVisible"
      @close="editVisible = false"
      :title="currentFile.name"
      :filePath="currentFile.full_path"
      :readOnly="currentFile.is_image"
      :icon="getIconClass(currentFile)"
      :language="iconMap[currentFile.name.split('.').pop().toLowerCase()]"
    />
    <image-view
      v-if="viewVisible && currentFile.is_image"
      :name="currentFile.name"
      :fullPath="currentFile.full_path"
      @close="viewVisible = false"
    />
  </div>
</template>

<script>
import SvgIcon from "../SvgIcon/SvgIcon.vue"
import EditFile from "./EditFile.vue"
import ImageView from "./ImageView.vue"
import NeonDialog from "@/components/ui/NeonDialog.vue"
import NeonInput from "@/components/ui/NeonInput.vue"
import CuteButton from "@/components/ui/CuteButton.vue"
export default {
  components: {
    SvgIcon,
    EditFile,
    NeonDialog,
    NeonInput,
    CuteButton,
    ImageView,
  },
  name: "FileManager",
  data() {
    return {
      pathList: ["/"],
      currentPath: "",
      fileList: [],
      vscodeIcons: [],
      showCreateDialog: false,
      createType: "file",
      renameType: "file",
      newItemName: "",
      showRenameDialogFlag: false,
      renameValue: "",
      itemToRename: {},
      showDeleteDialogFlag: false,
      itemToDelete: {},
      editVisible: false,
      viewVisible: false,
      currentFile: {},
      iconMap: {
        folder: "folder",
        image: "image",
        pdf: "pdf",
        zip: "zip",
        txt: "text",
        md: "markdown",
        json: "json",
        yml: "yaml",
        yaml: "yaml",
        js: "javascript",
        ts: "typescript",
        py: "python",
        java: "java",
        c: "c",
        cpp: "cpp",
        h: "h",
        html: "html",
        css: "css",
        scss: "scss",
        vue: "vue",
        sh: "shell",
        default: "file",
      },
    }
  },
  mounted() {
    this.loadFiles()
    this.loadIcons()
  },
  methods: {
    getTableHeight() {
      if (this.$isMobile()) {
        return "calc(100vh - 500px)"
      } else {
        return "calc(100vh - 300px)"
      }
    },
    async loadFiles(path = "") {
      try {
        var loading = this.getLoading(".file-table-container")
        const resp = await this.getRequest(
          `${this.$root.prefix}/system/get_dir_list`,
          { path: path || this.currentPath }
        )

        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.fileList = resp.data.map((item) => ({
              ...item,
              full_path: item.parent
                ? `${item.parent}/${item.name}`
                : item.name,
            }))

            if (path !== "") {
              this.currentPath = path
              this.updateBreadcrumb(path)
            }
          }
        } else {
          this.$message.error(resp.info)
        }
      } catch (error) {
        this.$message.error("加载文件列表失败")
        console.error(error)
      }
      loading.close()
    },

    refreshFiles() {
      this.loadFiles()
    },

    updateBreadcrumb(path) {
      if (path === "") {
        this.pathList = ["/"]
        return
      }
      this.pathList = ["/", ...path.split("/").filter((p) => p)]
    },

    clickPath(index) {
      if (index === 0) {
        this.currentPath = ""
        this.pathList = ["/"]
        this.loadFiles()
      } else {
        const path = this.pathList.slice(1, index + 1).join("/")
        this.loadFiles(path)
      }
    },

    navigateUp() {
      if (this.currentPath === "") return
      const parts = this.currentPath.split("/")
      parts.pop()
      this.loadFiles(parts.join("/"))
    },

    handleDoubleClick(row) {
      if (row.is_file) {
        row.is_image ? this.viewImage(row) : this.editFile(row)
      } else {
        this.loadFiles(row.full_path)
      }
    },

    editFile(item) {
      this.currentFile = item
      this.editVisible = true
    },

    viewImage(item) {
      this.currentFile = item
      this.viewVisible = true
    },

    clickRootAddFile() {
      this.createType = "file"
      this.newItemName = ""
      this.showCreateDialog = true
    },

    clickRootAddFolder() {
      this.createType = "folder"
      this.newItemName = ""
      this.showCreateDialog = true
    },

    async confirmCreate() {
      if (!this.newItemName.trim()) {
        this.$message.warning("请输入名称")
        return
      }

      try {
        const endpoint = this.createType === "file" ? "add_file" : "add_folder"
        const resp = await this.postRequest(
          `${this.$root.prefix}/system/${endpoint}`,
          {
            parent: this.currentPath,
            name: this.newItemName,
          }
        )

        if (resp.suc) {
          this.$message.success(resp.info)
          this.loadFiles()
          this.showCreateDialog = false
        } else {
          this.$message.error(resp.info)
        }
      } catch (error) {
        this.$message.error("操作失败")
        console.error(error)
      }
    },

    cancelCreate() {
      this.showCreateDialog = false
    },

    showRenameDialog(item) {
      console.log("showRenameDialog", item)

      this.renameType = item.is_file ? "file" : "folder"
      this.itemToRename = item
      this.renameValue = item.name
      this.showRenameDialogFlag = true
    },

    async confirmRename() {
      if (!this.renameValue.trim()) {
        this.$message.warning("请输入新名称")
        return
      }

      try {
        const endpoint = this.itemToRename.is_file
          ? "rename_file"
          : "rename_folder"
        const resp = await this.postRequest(
          `${this.$root.prefix}/system/${endpoint}`,
          {
            parent: this.itemToRename.parent,
            old_name: this.itemToRename.name,
            name: this.renameValue,
          }
        )

        if (resp.suc) {
          this.$message.success(resp.info)
          this.loadFiles()
          this.showRenameDialogFlag = false
        } else {
          this.$message.error(resp.info)
        }
      } catch (error) {
        this.$message.error("重命名失败")
        console.error(error)
      }
    },

    cancelRename() {
      this.showRenameDialogFlag = false
    },

    showDeleteDialog(item) {
      this.itemToDelete = item
      this.showDeleteDialogFlag = true
    },

    async confirmDelete() {
      try {
        const endpoint = this.itemToDelete.is_file
          ? "delete_file"
          : "delete_folder"
        const resp = await this.postRequest(
          `${this.$root.prefix}/system/${endpoint}`,
          {
            full_path: this.itemToDelete.full_path,
          }
        )

        if (resp.suc) {
          this.$message.success(resp.info)
          this.loadFiles()
          this.showDeleteDialogFlag = false
        } else {
          this.$message.error(resp.info)
        }
      } catch (error) {
        this.$message.error("删除失败")
        console.error(error)
      }
    },

    cancelDelete() {
      this.showDeleteDialogFlag = false
    },

    loadIcons() {
      const req = require.context(
        "@/assets/icons/svg/vscode-icons",
        false,
        /\.svg$/
      )
      const requireAll = (requireContext) => requireContext.keys()
      const re = /\.\/(.*)\.svg/
      this.vscodeIcons = requireAll(req).map((i) => i.match(re)[1])
    },

    getIconClass(item) {
      if (item.is_file) {
        const ext = item.name.split(".").pop().toLowerCase()
        const iconType = this.iconMap[ext] || this.iconMap.default

        return this.vscodeIcons.includes(`file_type_${iconType}`)
          ? `file_type_${iconType}`
          : "default_file"
      } else {
        if (this.vscodeIcons.includes(`folder_type_${item.name}`)) {
          return `folder_type_${item.name}`
        }
        return "default_folder"
      }
    },

    formatDate(timestamp) {
      if (!timestamp) return "-"
      return new Date(timestamp * 1000).toLocaleString()
    },

    formatSize(bytes) {
      if (bytes === 0) return "0 B"
      const k = 1024
      const sizes = ["B", "KB", "MB", "GB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    },
  },
}
</script>

<style scoped>
/* 可爱风格样式 */
.kawaii-file-manager {
  padding: 1rem;
  font-family: sans-serif;
}

/* 表格样式 */
.kawaii-table {
  --el-table-header-background-color: var(--bg-color-hover);
  --el-table-border-color: var(--border-color);
}

.kawaii-table::before {
  background-color: var(--border-color-light);
}

/* 面包屑导航样式 */
.el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: var(--primary-color);
}

.el-breadcrumb__item:hover .el-breadcrumb__inner {
  color: var(--primary-color-light);
}

/* 滚动条样式 */
.el-table__body-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 4px;
}

.el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: var(--bg-color-hover);
  border-radius: 4px;
}

/* 空状态样式 */
.empty-state {
  padding: 40px 0;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .el-table {
    height: calc(100vh - 240px) !important;
  }

  .el-table-column {
    width: auto !important;
  }
}
</style>
