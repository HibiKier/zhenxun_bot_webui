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
  name: 'CuteConfirm',
  props: {
    title: String,
    message: String,
    cancelButtonText: {
      type: String,
      default: '取消',
    },
    confirmButtonText: {
      type: String,
      default: '确定',
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
      this.$emit('confirm')
      this.$emit('close')
    },
    handleCancel() {
      this.$emit('close')
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
  background-color: rgba(255, 228, 240, 0.6); /* 粉白半透明 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px); /* 毛玻璃效果 */
  animation: fadeIn 0.3s ease-out;
}

/* 弹框主体 */
.cute-dialog {
  background: #fff9fc
    url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M30,50 Q50,30 70,50 Q50,70 30,50" fill="none" stroke="%23ffd6e7" stroke-width="2"/></svg>');
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(255, 131, 193, 0.2);
  width: 380px;
  overflow: hidden;
  border: 2px solid #ffd6e7;
  transform: scale(0.9);
  animation: popIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  position: relative;
  overflow: hidden;
}

.cute-dialog::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, #ffebf3, #fff9fc, #ffebf3);
  z-index: -1;
  border-radius: 20px;
  opacity: 0.8;
}

/* 头部样式 */
.cute-dialog-header {
  padding: 20px 24px 12px;
  position: relative;
}

.cute-dialog-header::after {
  content: '✧･ﾟ: *✧･ﾟ:*';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  text-align: center;
  color: #ff85b2;
  font-size: 12px;
  letter-spacing: 2px;
}

.cute-dialog-title {
  font-size: 20px;
  font-weight: bold;
  color: #ff6699;
  text-align: center;
  text-shadow: 1px 1px 0px #fff;
  position: relative;
  display: inline-block;
}

.cute-dialog-title::before,
.cute-dialog-title::after {
  content: '♥';
  color: #ff85b2;
  margin: 0 8px;
  font-size: 16px;
}

/* 内容区域 */
.cute-dialog-body {
  padding: 20px 24px;
  text-align: center;
}

.cute-dialog-message {
  margin: 0;
  white-space: pre-wrap;
  font-size: 15px;
  color: #8a6d8b;
  line-height: 1.6;
  font-family: 'Comic Sans MS', 'Marker Felt', 'Segoe Print', cursive;
}

/* 底部按钮区域 */
.cute-dialog-footer {
  padding: 16px 24px 24px;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 基础按钮样式 */
.cute-dialog-button {
  min-width: 100px;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cute-dialog-button:active {
  transform: translateY(2px);
}

/* 确认按钮 */
.cute-dialog-confirm {
  background: linear-gradient(135deg, #ff6b9d, #ff8fab);
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.cute-dialog-confirm:hover {
  background: linear-gradient(135deg, #ff5a8d, #ff7e9e);
  box-shadow: 0 6px 12px rgba(255, 107, 157, 0.3);
  animation: heartBeat 0.6s;
}

/* 取消按钮 */
.cute-dialog-cancel {
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
  color: #4db6ac;
  border: 1px solid #b2ebf2;
}

.cute-dialog-cancel:hover {
  background: linear-gradient(135deg, #b2ebf2, #80deea);
  box-shadow: 0 6px 12px rgba(178, 235, 242, 0.3);
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
