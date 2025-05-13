<template>
  <div
    v-if="visible"
    class="cute-dialog-overlay"
    @click.self="handleOverlayClick"
  >
    <div class="cute-dialog">
      <div class="cute-dialog-header">
        <span class="cute-dialog-title">{{ title }}</span>
      </div>
      <div class="cute-dialog-body">
        <pre class="cute-dialog-message">{{ message }}</pre>
      </div>
      <div class="cute-dialog-footer">
        <button
          v-if="showCancelButton"
          class="cute-dialog-button cute-dialog-cancel"
          @click="handleCancel"
        >
          {{ cancelButtonText }}
        </button>
        <button
          class="cute-dialog-button cute-dialog-confirm"
          @click="handleConfirm"
        >
          {{ confirmButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CuteConfirm",
  props: {
    title: String,
    message: String,
    cancelButtonText: {
      type: String,
      default: "取消",
    },
    confirmButtonText: {
      type: String,
      default: "确定",
    },
    visible: Boolean,
    showCancelButton: {
      type: Boolean,
      default: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleConfirm() {
      this.$emit("confirm")
      this.$emit("close")
    },
    handleCancel() {
      this.$emit("close")
    },
    handleOverlayClick() {
      if (this.closeOnClickOverlay) {
        this.handleCancel()
      }
    },
  },
}
</script>
<style scoped>
/* 基础蒙层 */
.cute-dialog-overlay {
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

/* 弹框主体 */
.cute-dialog {
  background-color: var(--bg-color-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--el-box-shadow-light);
  width: 90%;
  max-width: 28rem;
  overflow: hidden;
  position: relative;
}

.cute-dialog::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(
    45deg,
    var(--primary-color-light-9),
    var(--bg-color-secondary),
    var(--primary-color-light-9)
  );
  z-index: -1;
  border-radius: 20px;
  opacity: 0.8;
}

/* 头部样式 */
.cute-dialog-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cute-dialog-header::after {
  content: "✧･ﾟ: *✧･ﾟ:*";
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  text-align: center;
  color: var(--primary-color);
  font-size: 12px;
  letter-spacing: 2px;
}

.cute-dialog-title {
  color: var(--text-color);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.cute-dialog-title::before,
.cute-dialog-title::after {
  content: "♥";
  color: var(--primary-color);
  margin: 0 8px;
  font-size: 16px;
}

/* 内容区域 */
.cute-dialog-body {
  padding: 1.5rem;
  color: var(--text-color);
}

.cute-dialog-message {
  margin: 0;
  white-space: pre-wrap;
  font-size: 15px;
  color: var(--text-color-secondary);
  line-height: 1.6;
  font-family: "Comic Sans MS", "Marker Felt", "Segoe Print", cursive;
}

/* 底部按钮区域 */
.cute-dialog-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color-light);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* 基础按钮样式 */
.cute-dialog-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.cute-dialog-button.cute-dialog-cancel {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.cute-dialog-button.cute-dialog-cancel:hover {
  background-color: var(--bg-color-hover);
  border-color: var(--primary-color-light);
}

.cute-dialog-button.cute-dialog-confirm {
  background-color: var(--primary-color);
  color: var(--bg-color-secondary);
  border: none;
}

.cute-dialog-button.cute-dialog-confirm:hover {
  background-color: var(--primary-color-light);
}

.close-button {
  color: var(--text-color-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-button:hover {
  color: var(--primary-color);
}

/* 动画效果 */
@keyframes popIn {
  0% {
    transform: scale(0.8);
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.1);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(1);
  }
}

/* 响应式调整 */
@media (max-width: 480px) {
  .cute-dialog {
    width: 90%;
    margin: 0 auto;
  }

  .cute-dialog-footer {
    flex-direction: column;
    gap: 12px;
  }

  .cute-dialog-button {
    width: 100%;
  }
}
</style>
