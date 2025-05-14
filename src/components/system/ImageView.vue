<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    custom-class="kawaii-image-dialog"
    @close="close"
    top="5vh"
  >
    <!-- 顶部装饰 -->
    <div class="dialog-header-decoration">
      <div class="decoration-line"></div>
    </div>

    <!-- 文件信息 -->
    <div class="file-info-box">
      <div class="file-name">
        <span class="text">{{ name }}</span>
      </div>
      <div class="file-path">
        <span class="text">{{ fullPath }}</span>
      </div>
    </div>

    <!-- 图片展示区 -->
    <div class="image-display-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-cat">(=｀ω´=)</div>
        <div class="loading-text">图片加载中...</div>
      </div>
      <div v-else-if="imageData" class="image-wrapper">
        <img
          :src="imageData"
          class="displayed-image"
          :style="imageStyle"
          @load="handleImageLoad"
        />
      </div>
      <div v-else class="error-state">
        <div class="error-icon">(╥﹏╥)</div>
        <div class="error-text">无法加载图片</div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="dialog-footer-decoration">
      <div class="decoration-icons">🌸✨🌟✨🌸</div>
      <div class="decoration-line"></div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ImageView",
  props: {
    name: {
      type: String,
      required: true,
    },
    fullPath: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: true,
      imageData: null,
      loading: false,
      dialogWidth: "auto",
      imageStyle: {},
      imageAspectRatio: 1,
    }
  },

  mounted() {
    this.getImage()
    window.addEventListener("resize", this.calculateImageSize)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.calculateImageSize)
  },
  methods: {
    getImage() {
      this.loading = true
      const loadingInstance = this.getLoading(".kawaii-image-dialog")

      this.getRequest(`${this.$root.prefix}/system/get_image`, {
        full_path: this.fullPath,
      })
        .then((resp) => {
          if (resp.suc) {
            resp.data = resp.data.replace("base64://", "")
            this.imageData = "data:image/png;base64," + resp.data
          } else {
            this.$message.error(resp.info || "图片加载失败")
          }
          loadingInstance.close()
          this.loading = false
        })
        .catch(() => {
          loadingInstance.close()
          this.loading = false
        })
    },

    handleImageLoad(event) {
      const img = event.target
      this.imageAspectRatio = img.naturalWidth / img.naturalHeight
      this.calculateImageSize()
    },

    calculateImageSize() {
      const maxWidth = window.innerWidth * 0.8 - 40 // 减去padding
      const maxHeight = window.innerHeight * 0.8 - 150 // 减去头部和底部高度

      let width = maxWidth
      let height = width / this.imageAspectRatio

      if (height > maxHeight) {
        height = maxHeight
        width = height * this.imageAspectRatio
      }

      this.imageStyle = {
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: "100%",
        maxHeight: "100%",
      }

      // 调整对话框宽度以适应图片
      this.dialogWidth = `${Math.min(width + 40, window.innerWidth * 0.9)}px`
    },

    close() {
      this.dialogVisible = false
      this.$emit("close")
    },
  },
}
</script>

<style scoped>
/* 文件信息区域 */
.file-info-box {
  text-align: center;
  margin: 0 auto 15px;
  padding: 0 15px;
  max-width: 90%;
}

.file-name {
  font-size: 18px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.file-path {
  font-size: 14px;
  color: var(--text-color-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  word-break: break-all;
}

.file-info-box .icon {
  margin-right: 8px;
  animation: float 2s ease-in-out infinite;
}

.file-info-box .text {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 图片展示容器 */
.image-display-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: var(--bg-color-secondary);
  border-radius: 12px;
  border: 2px dashed var(--border-color);
  padding: 10px;
  box-sizing: border-box;
}

.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.displayed-image {
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 15px var(--el-box-shadow-light);
  transition: transform 0.3s ease;
}

.displayed-image:hover {
  transform: scale(1.01);
}

/* 加载状态 */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 100%;
}

.loading-cat,
.error-icon {
  font-size: 30px;
  margin-bottom: 10px;
  animation: bounce 1s infinite;
}

.loading-text,
.error-text {
  color: var(--text-color-secondary);
  font-size: 16px;
}

/* 对话框装饰 */
.dialog-header-decoration,
.dialog-footer-decoration {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 -20px;
}

.decoration-line {
  height: 2px;
  width: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary-color),
    var(--primary-color-light),
    var(--primary-color),
    transparent
  );
  margin: 5px 0;
}

.decoration-icons {
  color: var(--primary-color);
  font-size: 14px;
  letter-spacing: 3px;
}

/* 动画效果 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .file-name {
    font-size: 16px;
  }

  .file-path {
    font-size: 12px;
  }

  .image-display-container {
    min-height: 150px;
  }

  .loading-cat,
  .error-icon {
    font-size: 24px;
  }

  .loading-text,
  .error-text {
    font-size: 14px;
  }

  .decoration-icons {
    font-size: 12px;
    letter-spacing: 2px;
  }
}
</style>

<style>
/* 全局字体 */
@import url("https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=M+PLUS+Rounded+1c:wght@400;700&display=swap");

/* 自定义对话框样式 */
.kawaii-image-dialog {
  border-radius: 18px !important;
  overflow: hidden !important;
  background: var(--bg-color-secondary) !important;
  border: 2px solid var(--border-color) !important;
  box-shadow: 0 12px 35px var(--el-box-shadow-light) !important;
  max-width: 95vw !important;
}

.kawaii-image-dialog .el-dialog__header {
  background: var(--primary-color) !important;
  padding: 12px 20px !important;
  border-bottom: none !important;
}

.kawaii-image-dialog .el-dialog__title {
  color: var(--el-color-white) !important;
  font-weight: bold !important;
  font-family: "Comic Neue", "M PLUS Rounded 1c", cursive !important;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.kawaii-image-dialog .el-dialog__headerbtn {
  top: 15px !important;
  right: 20px !important;
  background: var(--primary-color) !important;
  border-radius: 50% !important;
  width: 28px !important;
  height: 28px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease !important;
  border: 2px solid var(--el-color-white) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}

.kawaii-image-dialog .el-dialog__headerbtn:hover {
  background: var(--primary-color-light) !important;
  transform: rotate(90deg) !important;
  border-color: var(--el-color-white) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

.kawaii-image-dialog .el-dialog__headerbtn .el-dialog__close {
  color: var(--el-color-white) !important;
  font-size: 20px !important;
  font-weight: bold !important;
  transition: all 0.3s ease !important;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.2) !important;
}

.kawaii-image-dialog .el-dialog__headerbtn:hover .el-dialog__close {
  color: var(--el-color-white) !important;
  transform: scale(1.2) !important;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3) !important;
}

.kawaii-image-dialog .el-dialog__body {
  padding: 15px 20px !important;
  background: var(--bg-color) !important;
  display: flex;
  flex-direction: column;
}
</style>
