<template>
  <div v-if="visible" class="cute-dialog-overlay">
    <div class="cute-dialog">
      <div class="cute-dialog-header">
        <span class="cute-dialog-title">{{ title }}</span>
      </div>
      <div class="cute-dialog-body">
        <pre class="cute-dialog-message">{{ message }}</pre>
      </div>
      <div class="cute-dialog-footer">
        <button
          class="cute-dialog-button cute-dialog-cancel"
          @click="handleCancel"
        >
          取消
        </button>
        <button
          class="cute-dialog-button cute-dialog-confirm"
          @click="handleConfirm"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "提示",
    },
    message: {
      type: String,
      default: "这是一个可爱的弹框哦～🌸",
    },
    onConfirm: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    handleConfirm() {
      this.onConfirm() // 触发确认回调
      this.$emit("update:visible", false) // 关闭弹框
    },
    handleCancel() {
      this.onCancel() // 触发取消回调
      this.$emit("update:visible", false) // 关闭弹框
    },
  },
}
</script>

<style scoped>
.cute-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.cute-dialog {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  overflow: hidden;
  animation: fadeIn 0.3s ease-in-out;
}

.cute-dialog-header {
  padding: 16px;
  background-color: #f9c2df; /* 浅粉色背景 */
  text-align: center;
  border-bottom: 1px solid #f589b9; /* 主题色边框 */
}

.cute-dialog-title {
  font-size: 16px;
  font-weight: bold;
  color: #f589b9; /* 主题色 */
}

.cute-dialog-body {
  padding: 20px;
  text-align: center;
}

.cute-dialog-message {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.cute-dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px;
  background-color: #f9c2df; /* 浅粉色背景 */
  border-top: 1px solid #f589b9; /* 主题色边框 */
}

.cute-dialog-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-left: 8px;
  color: white;
}

.cute-dialog-button:active {
  transform: scale(0.95);
}

.cute-dialog-cancel {
  background-color: #f589b9; /* 浅粉色背景 */
  color: white; /* 主题色文字 */
  border: 1px solid #f589b9; /* 主题色边框 */
}

.cute-dialog-cancel:hover {
  background-color: #f5a9c9; /* 稍深的粉色 hover 效果 */
}

.cute-dialog-confirm {
  background-color: #f589b9; /* 主题色 */
  color: white;
}

.cute-dialog-confirm:hover {
  background-color: #e65a9d; /* 主题色 hover 效果 */
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
