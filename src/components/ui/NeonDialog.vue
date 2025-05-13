<template>
  <transition name="fm-dialog-fade">
    <div
      v-show="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="handleClose"
    >
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-black/50"></div>

      <!-- 对话框卡片 -->
      <div
        class="relative rounded-xl shadow-lg w-full max-w-md overflow-hidden border-2 animate-pop-in"
        :class="dialogBorderClass"
        :style="{
          backgroundColor: 'var(--bg-color-secondary)',
          borderColor: 'var(--border-color)',
        }"
      >
        <!-- 头部 -->
        <div
          class="flex items-center px-5 py-4 border-b"
          :class="headerBorderClass"
          :style="{ borderColor: 'var(--border-color-light)' }"
        >
          <SvgIcon
            :iconClass="iconClass"
            v-if="iconClass"
            class="text-xl mr-3"
            :style="{ color: 'var(--primary-color)' }"
          />
          <h3 class="text-lg font-bold" :style="{ color: 'var(--text-color)' }">
            {{ title }}
          </h3>
        </div>

        <!-- 内容区 -->
        <div class="p-5" :style="{ color: 'var(--text-color)' }">
          <slot></slot>
        </div>

        <!-- 操作按钮 -->
        <div
          class="flex justify-end space-x-3 px-5 py-4"
          :style="{ backgroundColor: 'var(--bg-color-hover)' }"
        >
          <NormalButton
            v-if="showCancel"
            @click="handleCancel"
            class="fm-cancel-btn"
            :text="cancelText"
          />
          <NormalButton
            @click="handleConfirm"
            class="fm-confirm-btn"
            :class="confirmBtnClass"
            :text="confirmText"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import NormalButton from "@/components/ui/NormalButton.vue"
import SvgIcon from "../SvgIcon/SvgIcon.vue"
export default {
  name: "NeonDialog",
  components: {
    NormalButton,
    SvgIcon,
  },
  props: {
    visible: Boolean,
    title: String,
    type: {
      type: String,
      default: "primary",
      validator: (val) =>
        ["primary", "danger", "warning", "success"].includes(val),
    },
    iconClass: String,
    cancelText: {
      type: String,
      default: "取消",
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    dialogBorderClass() {
      const map = {
        primary: "border-primary-light",
        danger: "border-danger-color",
        warning: "border-warning-color",
        success: "border-success-color",
      }
      return map[this.type] || map.primary
    },
    headerBorderClass() {
      const map = {
        primary: "border-primary-light-9",
        danger: "border-danger-color-light",
        warning: "border-warning-color-light",
        success: "border-success-color-light",
      }
      return map[this.type] || map.primary
    },
    titleTextClass() {
      const map = {
        primary: "text-primary-color",
        danger: "text-danger-color",
        warning: "text-warning-color",
        success: "text-success-color",
      }
      return map[this.type] || map.primary
    },
    confirmBtnClass() {
      const map = {
        primary: "bg-primary-color hover:bg-primary-color-light",
        danger: "bg-danger-color hover:bg-danger-color-light",
        warning: "bg-warning-color hover:bg-warning-color-light",
        success: "bg-success-color hover:bg-success-color-light",
      }
      return map[this.type] || map.primary
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false)
      this.$emit("close")
    },
    handleCancel() {
      this.$emit("cancel")
      this.handleClose()
    },
    handleConfirm() {
      this.$emit("confirm")
    },
  },
}
</script>

<style scoped>
/* 动画效果 */
.fm-dialog-fade-enter-active,
.fm-dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.fm-dialog-fade-enter-from,
.fm-dialog-fade-leave-to {
  opacity: 0;
}

.animate-pop-in {
  animation: popIn 0.2s ease-out;
}

@keyframes popIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 按钮样式 */
.fm-cancel-btn {
  @apply px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  background-color: var(--bg-color-secondary);
  box-shadow: var(--el-box-shadow-lighter);
}

.fm-cancel-btn:hover {
  background-color: var(--bg-color-hover);
  border-color: var(--primary-color-light);
  box-shadow: var(--el-box-shadow-light);
}

.fm-confirm-btn {
  @apply px-4 py-2 rounded-lg text-white focus:outline-none 
         focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2;
  background-color: var(--primary-color);
  box-shadow: var(--el-box-shadow-lighter);
}

.fm-confirm-btn:hover {
  background-color: var(--primary-color-light);
  box-shadow: var(--el-box-shadow-light);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .fm-dialog {
    @apply w-11/12;
  }

  .fm-cancel-btn,
  .fm-confirm-btn {
    @apply px-3 py-1.5 text-sm;
  }
}

.dialog-overlay {
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

.dialog-card {
  background-color: var(--bg-color-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--el-box-shadow-light);
  width: 90%;
  max-width: 32rem;
  overflow: hidden;
}

.dialog-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-title {
  color: var(--text-color);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.dialog-content {
  padding: 1.5rem;
  color: var(--text-color);
}

.dialog-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color-light);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.dialog-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.dialog-button.cancel {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.dialog-button.cancel:hover {
  background-color: var(--bg-color-hover);
  border-color: var(--primary-color-light);
}

.dialog-button.confirm {
  background-color: var(--primary-color);
  color: var(--bg-color-secondary);
  border: none;
}

.dialog-button.confirm:hover {
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
</style>
