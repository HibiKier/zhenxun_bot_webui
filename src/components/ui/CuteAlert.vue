<template>
  <div v-if="visible" class="cute-alert">
    <div class="cute-alert-content">
      <span class="cute-alert-message">{{ message }}</span>
      <button class="cute-alert-close" @click="close">×</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit("close")
    },
  },
}
</script>

<style scoped>
.cute-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.cute-alert-content {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: #f9c2df; /* 浅粉色背景 */
  border: 2px solid #f589b9; /* 主色调边框 */
  border-radius: 15px; /* 圆角 */
  box-shadow: 0 4px 10px rgba(245, 137, 185, 0.3); /* 粉色阴影 */
  animation: fadeIn 0.3s ease-in-out; /* 淡入动画 */
}

.cute-alert-message {
  font-size: 16px;
  color: #f589b9; /* 主色调文字 */
  font-weight: bold;
  margin-right: 15px;
}

.cute-alert-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #f589b9; /* 主色调关闭按钮 */
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s ease;
}

.cute-alert-close:hover {
  color: #e65a9d; /* 悬停时深一点的粉色 */
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
