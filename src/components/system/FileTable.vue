<template>
  <div class="kawaii-file-manager">
    <!-- 顶部面包屑导航 -->
    <div class="breadcrumb">
      <span v-for="(path, i) in pathList" :key="i" class="breadcrumb-item">
        <span class="path-item" @click="clickPath(i)">
          {{ path }}
        </span>
        <span class="path-separator" v-if="i < pathList.length - 1">/</span>
      </span>
    </div>

    <!-- 操作按钮区 -->
    <div class="action-buttons">
      <button @click="clickRootAddFile" class="kawaii-btn kawaii-btn-pink">
        <svg-icon icon-class="file-add" class="btn-icon" />
        <span>新建文件</span>
      </button>
      <button @click="clickRootAddFolder" class="kawaii-btn kawaii-btn-purple">
        <svg-icon icon-class="folder-add" class="btn-icon" />
        <span>新建文件夹</span>
      </button>
      <button @click="refreshFiles" class="kawaii-btn kawaii-btn-blue">
        <svg-icon icon-class="refresh" class="btn-icon" />
        <span>刷新</span>
      </button>
    </div>

    <!-- 文件表格区 -->
    <div class="file-table-container">
      <table class="kawaii-table">
        <thead>
          <tr>
            <th class="table-header">
              <div class="header-content">
                <svg-icon icon-class="file" class="header-icon" />
                <span>名称</span>
              </div>
            </th>
            <th class="table-header">
              <div class="header-content">
                <svg-icon icon-class="calendar" class="header-icon" />
                <span>修改时间</span>
              </div>
            </th>
            <th class="table-header">
              <div class="header-content">
                <svg-icon icon-class="size" class="header-icon" />
                <span>大小</span>
              </div>
            </th>
            <th class="table-header table-header-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <!-- 上级目录 -->
          <tr
            v-if="currentPath !== ''"
            class="table-row table-row-up"
            @click="navigateUp"
          >
            <td class="table-cell">
              <div class="cell-content">
                <svg-icon icon-class="arrow-up" class="cell-icon" />
                <span class="cell-text">返回上级</span>
              </div>
            </td>
            <td class="table-cell">-</td>
            <td class="table-cell">-</td>
            <td class="table-cell table-cell-actions">-</td>
          </tr>

          <!-- 文件列表 -->
          <tr
            v-for="item in fileList"
            :key="item.full_path"
            class="table-row"
            @dblclick="handleDoubleClick(item)"
          >
            <td class="table-cell">
              <div class="cell-content">
                <svg-icon
                  :icon-class="getIcon(item)"
                  class="cell-icon"
                  :class="item.is_file ? 'file-icon' : 'folder-icon'"
                />
                <span class="cell-text">{{ item.name }}</span>
              </div>
            </td>
            <td class="table-cell">{{ formatDate(item.mtime) }}</td>
            <td class="table-cell">
              {{ item.is_file ? formatSize(item.size) : '-' }}
            </td>
            <td class="table-cell table-cell-actions">
              <div class="action-buttons">
                <!-- 文件操作按钮 -->
                <button
                  v-if="item.is_file"
                  @click.stop="editFile(item, false)"
                  class="action-btn action-btn-blue"
                  title="编辑"
                >
                  <svg-icon icon-class="edit" />
                </button>
                <button
                  v-if="item.is_file && item.is_image"
                  @click.stop="viewImage(item)"
                  class="action-btn action-btn-green"
                  title="查看"
                >
                  <svg-icon icon-class="eye" />
                </button>
                <button
                  @click.stop="showRenameDialog(item)"
                  class="action-btn action-btn-purple"
                  title="重命名"
                >
                  <svg-icon icon-class="rename" />
                </button>
                <button
                  @click.stop="showDeleteDialog(item)"
                  class="action-btn action-btn-red"
                  title="删除"
                >
                  <svg-icon icon-class="delete" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 空状态 -->
      <div
        v-if="fileList.length === 0 && currentPath === ''"
        class="empty-state"
      >
        <svg-icon icon-class="empty-folder" class="empty-icon" />
        <p class="empty-text">当前目录为空，点击上方按钮添加文件或文件夹吧~</p>
      </div>
    </div>

    <!-- 新建文件/文件夹对话框 -->
    <div v-if="showCreateDialog" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">
          <svg-icon
            :icon-class="createType === 'file' ? 'file-add' : 'folder-add'"
            class="modal-icon"
          />
          {{ createType === 'file' ? '新建文件' : '新建文件夹' }}
        </h3>
        <input
          v-model="newItemName"
          type="text"
          :placeholder="
            createType === 'file' ? '请输入文件名' : '请输入文件夹名'
          "
          class="modal-input"
          @keyup.enter="confirmCreate"
        />
        <div class="modal-buttons">
          <button @click="cancelCreate" class="modal-btn modal-btn-cancel">
            取消
          </button>
          <button @click="confirmCreate" class="modal-btn modal-btn-confirm">
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 重命名对话框 -->
    <div v-if="showRenameDialogFlag" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">
          <svg-icon icon-class="rename" class="modal-icon" />
          重命名
        </h3>
        <input
          v-model="renameValue"
          type="text"
          placeholder="请输入新名称"
          class="modal-input"
          @keyup.enter="confirmRename"
        />
        <div class="modal-buttons">
          <button @click="cancelRename" class="modal-btn modal-btn-cancel">
            取消
          </button>
          <button @click="confirmRename" class="modal-btn modal-btn-confirm">
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteDialogFlag" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title modal-title-warning">
          <svg-icon icon-class="warning" class="modal-icon" />
          确认删除
        </h3>
        <p class="modal-message">
          确定要删除
          <span class="delete-item-name">{{ itemToDelete?.name }}</span> 吗？
        </p>
        <div class="modal-buttons">
          <button @click="cancelDelete" class="modal-btn modal-btn-cancel">
            取消
          </button>
          <button @click="confirmDelete" class="modal-btn modal-btn-danger">
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 文件编辑器和图片查看器 -->
    <edit-file
      v-if="editVisible"
      @close="editVisible = false"
      :name="currentFile.name"
      :fullPath="currentFile.full_path"
      :onlyRead="currentFile.is_image"
    />
  </div>
</template>

<script>
import SvgIcon from '../SvgIcon/SvgIcon.vue'
import EditFile from './EditFile.vue'

export default {
  components: { SvgIcon, EditFile },
  name: 'KawaiiFileManager',
  data() {
    return {
      pathList: ['/'],
      currentPath: '',
      fileList: [],
      vscodeIcons: [],

      // 对话框状态
      showCreateDialog: false,
      createType: 'file', // 'file' or 'folder'
      newItemName: '',

      showRenameDialogFlag: false,
      renameValue: '',
      itemToRename: null,

      showDeleteDialogFlag: false,
      itemToDelete: null,

      // 文件查看/编辑
      editVisible: false,
      currentFile: {},

      // 图标映射
      iconMap: {
        // 文件夹类型
        folder: 'folder',

        // 文件类型
        image: 'image',
        pdf: 'pdf',
        zip: 'zip',
        txt: 'text',
        md: 'markdown',
        json: 'json',
        yml: 'yaml',
        yaml: 'yaml',

        // 代码文件
        js: 'javascript',
        ts: 'typescript',
        py: 'python',
        java: 'java',
        c: 'c',
        cpp: 'cpp',
        h: 'h',
        html: 'html',
        css: 'css',
        scss: 'scss',
        vue: 'vue',
        sh: 'shell',

        // 默认
        default: 'file',
      },
    }
  },
  mounted() {
    this.loadFiles()
    this.loadIcons()
  },
  methods: {
    // 加载文件列表
    async loadFiles(path = '') {
      try {
        const resp = await this.getRequest(
          `${this.$root.prefix}/system/get_dir_list`,
          {
            path: path || this.currentPath,
          }
        )

        if (resp.suc) {
          this.fileList = resp.data.map((item) => ({
            ...item,
            full_path: item.parent ? `${item.parent}/${item.name}` : item.name,
          }))

          // 更新面包屑导航
          if (path !== '') {
            this.currentPath = path
            this.updateBreadcrumb(path)
          }
        } else {
          this.$message.error(resp.info)
        }
      } catch (error) {
        this.$message.error('加载文件列表失败')
        console.error(error)
      }
    },

    // 刷新文件列表
    refreshFiles() {
      this.loadFiles()
    },

    // 更新面包屑导航
    updateBreadcrumb(path) {
      if (path === '') {
        this.pathList = ['/']
        return
      }

      const parts = path.split('/').filter((p) => p)
      this.pathList = ['/', ...parts]
    },

    // 导航到指定路径
    clickPath(index) {
      if (index === 0) {
        this.currentPath = ''
        this.loadFiles('')
      } else {
        const path = this.pathList.slice(1, index + 1).join('/')
        this.loadFiles(path)
      }
    },

    // 返回上级目录
    navigateUp() {
      if (this.currentPath === '') return

      const parts = this.currentPath.split('/')
      parts.pop()
      const newPath = parts.join('/')
      this.loadFiles(newPath)
    },

    // 双击处理
    handleDoubleClick(item) {
      if (item.is_file) {
        if (item.is_image) {
          this.viewImage(item)
        } else {
          this.editFile(item, false)
        }
      } else {
        // 进入文件夹
        this.loadFiles(item.full_path)
      }
    },

    // 编辑文件
    editFile(item, onlyRead) {
      this.currentFile = item
      this.editVisible = true
    },

    // 查看图片
    viewImage(item) {
      this.currentFile = item
      this.editVisible = true
    },

    // 显示新建对话框
    clickRootAddFile() {
      this.createType = 'file'
      this.newItemName = ''
      this.showCreateDialog = true
    },

    clickRootAddFolder() {
      this.createType = 'folder'
      this.newItemName = ''
      this.showCreateDialog = true
    },

    // 确认新建
    async confirmCreate() {
      if (!this.newItemName.trim()) {
        this.$message.warning('请输入名称')
        return
      }

      try {
        const endpoint = this.createType === 'file' ? 'add_file' : 'add_folder'

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
        } else {
          this.$message.error(resp.info)
        }
      } catch (error) {
        this.$message.error('操作失败')
        console.error(error)
      } finally {
        this.showCreateDialog = false
      }
    },

    // 取消新建
    cancelCreate() {
      this.showCreateDialog = false
      this.newItemName = ''
    },

    // 显示重命名对话框
    showRenameDialog(item) {
      this.itemToRename = item
      this.renameValue = item.name
      this.showRenameDialogFlag = true
    },

    // 确认重命名
    async confirmRename() {
      if (!this.renameValue.trim()) {
        this.$message.warning('请输入新名称')
        return
      }

      try {
        const endpoint = this.itemToRename.is_file
          ? 'rename_file'
          : 'rename_folder'

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
        } else {
          this.$message.error(resp.info)
        }
      } catch (error) {
        this.$message.error('重命名失败')
        console.error(error)
      } finally {
        this.showRenameDialogFlag = false
      }
    },

    // 取消重命名
    cancelRename() {
      this.showRenameDialogFlag = false
      this.renameValue = ''
    },

    // 显示删除对话框
    showDeleteDialog(item) {
      this.itemToDelete = item
      this.showDeleteDialogFlag = true
    },

    // 确认删除
    async confirmDelete() {
      try {
        const endpoint = this.itemToDelete.is_file
          ? 'delete_file'
          : 'delete_folder'

        const resp = await this.postRequest(
          `${this.$root.prefix}/system/${endpoint}`,
          {
            full_path: this.itemToDelete.full_path,
          }
        )

        if (resp.suc) {
          this.$message.success(resp.info)
          this.loadFiles()
        } else {
          this.$message.error(resp.info)
        }
      } catch (error) {
        this.$message.error('删除失败')
        console.error(error)
      } finally {
        this.showDeleteDialogFlag = false
      }
    },

    // 取消删除
    cancelDelete() {
      this.showDeleteDialogFlag = false
    },

    // 加载图标
    loadIcons() {
      const req = require.context(
        '@/assets/icons/svg/vscode-icons',
        false,
        /\.svg$/
      )
      const requireAll = (requireContext) => requireContext.keys()

      const re = /\.\/(.*)\.svg/

      this.vscodeIcons = requireAll(req).map((i) => {
        return i.match(re)[1]
      })
    },

    // 获取文件图标
    getIcon(item) {
      if (!item.is_file) return 'folder'

      const ext = item.name.split('.').pop().toLowerCase()
      const iconType = this.iconMap[ext] || this.iconMap.default

      if (this.vscodeIcons.includes(`file_type_${iconType}`)) {
        return `file_type_${iconType}`
      }

      return 'file'
    },

    // 格式化日期
    formatDate(timestamp) {
      if (!timestamp) return '-'
      return new Date(timestamp * 1000).toLocaleString()
    },

    // 格式化文件大小
    formatSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
  },
}
</script>

<style>
/* 基础样式 */
.kawaii-file-manager {
  background: linear-gradient(135deg, #fff1f8 0%, #f8f1ff 100%);
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  font-family: 'Arial', sans-serif;
}

/* 面包屑导航 */
.breadcrumb {
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(165, 94, 234, 0.1);
  border: 1px solid rgba(236, 72, 153, 0.2);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.path-item {
  color: #a855f7;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.path-item:hover {
  color: #ec4899;
  background-color: rgba(236, 72, 153, 0.1);
}

.path-separator {
  color: #d1d5db;
  margin: 0 4px;
}

/* 操作按钮区 */
.action-buttons {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.kawaii-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: white;
  font-weight: 500;
}

.kawaii-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.kawaii-btn-pink {
  background-color: #ff9ff3;
}

.kawaii-btn-pink:hover {
  background-color: #f368e0;
}

.kawaii-btn-purple {
  background-color: #a55eea;
}

.kawaii-btn-purple:hover {
  background-color: #8854d0;
}

.kawaii-btn-blue {
  background-color: #48dbfb;
}

.kawaii-btn-blue:hover {
  background-color: #0abde3;
}

.btn-icon {
  margin-right: 8px;
  font-size: 16px;
}

/* 文件表格 */
.file-table-container {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(165, 94, 234, 0.1);
  border: 1px solid rgba(236, 72, 153, 0.15);
  overflow-x: auto;
}

.kawaii-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.table-header {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #ec4899;
  background-color: rgba(255, 159, 243, 0.05);
  border-bottom: 2px solid rgba(255, 159, 243, 0.2);
}

.table-header-actions {
  text-align: right;
}

.header-content {
  display: flex;
  align-items: center;
}

.header-icon {
  margin-right: 8px;
  font-size: 16px;
}

.table-row {
  transition: all 0.2s;
  cursor: pointer;
}

.table-row:hover {
  background-color: rgba(255, 159, 243, 0.05);
}

.table-row:active {
  transform: scale(0.99);
}

.table-row-up {
  color: #a855f7;
}

.table-cell {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 159, 243, 0.1);
  vertical-align: middle;
}

.table-cell-actions {
  text-align: right;
}

.cell-content {
  display: flex;
  align-items: center;
}

.cell-icon {
  margin-right: 8px;
  font-size: 18px;
}

.file-icon {
  color: #48dbfb;
}

.folder-icon {
  color: #feca57;
}

.cell-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn-blue {
  color: #48dbfb;
}

.action-btn-blue:hover {
  background-color: rgba(72, 219, 251, 0.1);
}

.action-btn-green {
  color: #1dd1a1;
}

.action-btn-green:hover {
  background-color: rgba(29, 209, 161, 0.1);
}

.action-btn-purple {
  color: #a55eea;
}

.action-btn-purple:hover {
  background-color: rgba(165, 94, 234, 0.1);
}

.action-btn-red {
  color: #ff6b6b;
}

.action-btn-red:hover {
  background-color: rgba(255, 107, 107, 0.1);
}

/* 空状态 */
.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-text {
  color: #9ca3af;
  font-size: 14px;
}

/* 模态对话框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #ec4899;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.modal-title-warning {
  color: #ff6b6b;
}

.modal-icon {
  margin-right: 8px;
  font-size: 24px;
}

.modal-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(165, 94, 234, 0.3);
  border-radius: 8px;
  margin-bottom: 20px;
  transition: all 0.2s;
}

.modal-input:focus {
  outline: none;
  border-color: #a55eea;
  box-shadow: 0 0 0 2px rgba(165, 94, 234, 0.2);
}

.modal-message {
  margin-bottom: 20px;
  color: #4b5563;
}

.delete-item-name {
  font-weight: 600;
  color: #ec4899;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.modal-btn-cancel {
  background-color: #e5e7eb;
  color: #4b5563;
}

.modal-btn-cancel:hover {
  background-color: #d1d5db;
}

.modal-btn-confirm {
  background-color: #ec4899;
  color: white;
}

.modal-btn-confirm:hover {
  background-color: #db2777;
}

.modal-btn-danger {
  background-color: #ff6b6b;
  color: white;
}

.modal-btn-danger:hover {
  background-color: #fa5252;
}

/* 滚动条 */
.kawaii-file-manager::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.kawaii-file-manager::-webkit-scrollbar-thumb {
  background-color: rgba(255, 159, 243, 0.6);
  border-radius: 4px;
}

.kawaii-file-manager::-webkit-scrollbar-track {
  background-color: rgba(255, 159, 243, 0.1);
  border-radius: 4px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .kawaii-file-manager {
    padding: 8px;
  }

  .file-table-container {
    padding: 8px;
  }

  .table-header,
  .table-cell {
    padding: 8px 12px;
  }

  .action-buttons {
    gap: 4px;
  }

  .kawaii-btn {
    padding: 6px 12px;
    font-size: 14px;
  }

  .cell-text {
    max-width: 150px;
  }

  .modal-content {
    padding: 16px;
    margin: 0 16px;
  }
}
</style>
