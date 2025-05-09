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
        class="relative bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border-2 animate-pop-in"
        :class="dialogBorderClass"
      >
        <!-- 头部 -->
        <div
          class="flex items-center px-5 py-4 border-b"
          :class="headerBorderClass"
        >
          <SvgIcon
            :iconClass="iconClass"
            v-if="iconClass"
            class="text-xl mr-3"
          />
          <h3 class="text-lg font-bold" :class="titleTextClass">{{ title }}</h3>
        </div>

        <!-- 内容区 -->
        <div class="p-5">
          <slot></slot>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-3 px-5 py-4 bg-gray-50">
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
        primary: "border-pink-300",
        danger: "border-red-300",
        warning: "border-yellow-300",
        success: "border-green-300",
      }
      return map[this.type] || map.primary
    },
    headerBorderClass() {
      const map = {
        primary: "border-pink-100",
        danger: "border-red-100",
        warning: "border-yellow-100",
        success: "border-green-100",
      }
      return map[this.type] || map.primary
    },
    titleTextClass() {
      const map = {
        primary: "text-pink-600",
        danger: "text-red-600",
        warning: "text-yellow-600",
        success: "text-green-600",
      }
      return map[this.type] || map.primary
    },
    confirmBtnClass() {
      const map = {
        primary: "bg-pink-500 hover:bg-pink-600",
        danger: "bg-red-500 hover:bg-red-600",
        warning: "bg-yellow-500 hover:bg-yellow-600",
        success: "bg-green-500 hover:bg-green-600",
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
  @apply px-4 py-2 rounded-lg border border-gray-300 text-gray-700 
         hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200;
}

.fm-confirm-btn {
  @apply px-4 py-2 rounded-lg text-white focus:outline-none 
         focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .max-w-md {
    width: calc(100% - 2rem);
  }

  .flex.justify-end.space-x-3 {
    @apply flex-col space-y-2 space-x-0;
  }

  .fm-cancel-btn,
  .fm-confirm-btn {
    @apply w-full;
  }
}
</style>
