<template>
  <div
    v-if="visible"
    class="cute-dialog-overlay"
    @click.self="handleOverlayClick"
  >
    <div class="cute-dialog">
      <div class="cute-dialog-header">
        <span class="cute-dialog-title">
          <svg-icon
            :icon-class="
              type === 'warning'
                ? 'warning'
                : type === 'error'
                ? 'error'
                : 'info'
            "
            class="title-icon"
            :color="
              type === 'warning'
                ? 'var(--el-color-warning)'
                : type === 'error'
                ? 'var(--el-color-danger)'
                : 'var(--el-color-primary)'
            "
          />
          {{ title }}
        </span>
      </div>
      <div class="cute-dialog-body">
        <pre class="cute-dialog-message">{{ message }}</pre>
      </div>
      <div class="cute-dialog-footer">
        <cute-button
          v-if="showCancelButton"
          type="secondary"
          :plain="false"
          :solid="true"
          @click="handleCancel"
          class="w-full md:w-auto cancel-button"
          :style="{
            backgroundColor: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-regular)',
            borderColor: 'var(--el-border-color)',
          }"
          icon="close"
          :iconColor="'var(--el-text-color-regular)'"
          size="small"
          :fontSize="12"
          :iconSize="14"
        >
          {{ cancelButtonText }}
        </cute-button>
        <cute-button
          type="primary"
          @click="handleConfirm"
          class="w-full md:w-auto confirm-button"
          :icon="
            type === 'warning'
              ? 'warning'
              : type === 'error'
              ? 'error'
              : 'confirm'
          "
          :iconColor="'#ffffff'"
          size="small"
          :fontSize="12"
          :iconSize="14"
        >
          {{ confirmButtonText }}
        </cute-button>
      </div>
    </div>
  </div>
</template>

<script>
import CuteButton from "./CuteButton.vue"
import SvgIcon from "../SvgIcon/SvgIcon.vue"

export default {
  name: "CuteConfirm",
  components: { CuteButton, SvgIcon },
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
    type: {
      type: String,
      default: "info",
      validator: (value) => ["info", "warning", "error"].includes(value),
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

<style lang="scss" scoped>
.cute-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--el-overlay-color-lighter);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

.cute-dialog {
  background-color: var(--el-bg-color);
  border-radius: 1rem;
  border: 2px solid var(--el-border-color-light);
  box-shadow: var(--el-box-shadow-light);
  width: 90%;
  max-width: 28rem;
  overflow: hidden;
  position: relative;
  animation: popIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
    var(--el-color-primary-light-9),
    var(--el-bg-color),
    var(--el-color-primary-light-9)
  );
  z-index: -1;
  border-radius: 20px;
  opacity: 0.8;
}

.cute-dialog-header {
  padding: 1.25rem;
  border-bottom: 2px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cute-dialog-header::after {
  content: "✧･ﾟ: *✧･ﾟ:*";
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  text-align: center;
  color: var(--el-color-primary);
  font-size: 12px;
  letter-spacing: 2px;
  background: var(--el-bg-color);
  padding: 0 10px;
  width: fit-content;
  margin: 0 auto;
}

.cute-dialog-title {
  color: var(--el-text-color-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cute-dialog-title::before,
.cute-dialog-title::after {
  content: "♥";
  color: var(--el-color-primary);
  font-size: 16px;
  animation: heartBeat 1.3s ease-in-out infinite;
}

.cute-dialog-title::before {
  animation-delay: 0s;
}

.cute-dialog-title::after {
  animation-delay: 0.3s;
}

.cute-dialog-body {
  padding: 1.5rem;
  color: var(--el-text-color-regular);
  background: var(--el-bg-color);
}

.cute-dialog-message {
  margin: 0;
  white-space: pre-wrap;
  font-size: 15px;
  line-height: 1.6;
  font-family: "Comic Sans MS", "Marker Felt", "Segoe Print", cursive;
}

.cute-dialog-footer {
  padding: 1rem;
  border-top: 2px solid var(--el-border-color-light);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  background: var(--el-bg-color);
}

@keyframes popIn {
  0% {
    transform: scale(0.9);
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

@media (max-width: 640px) {
  .cute-dialog {
    width: 95%;
    margin: 1rem;
  }

  .cute-dialog-footer {
    padding: 0.625rem;
    gap: 0.25rem;
  }

  .cancel-button,
  .confirm-button {
    :deep(.button-content) {
      font-size: 12px;
    }
  }
}

// 暗色主题适配
:root[data-theme="dark"] {
  .cute-dialog {
    background-color: var(--el-bg-color-overlay);
    border-color: var(--el-border-color-darker);
  }

  .cute-dialog::before {
    background: linear-gradient(
      45deg,
      var(--el-color-primary-light-8),
      var(--el-bg-color-overlay),
      var(--el-color-primary-light-8)
    );
    opacity: 0.15;
  }

  .cute-dialog-header {
    border-color: var(--el-border-color-darker);

    &::after {
      background-color: var(--el-bg-color-overlay);
      color: var(--el-color-primary-light-3);
    }
  }

  .cute-dialog-title {
    color: var(--el-text-color-primary);

    &::before,
    &::after {
      color: var(--el-color-primary-light-3);
    }
  }

  .cute-dialog-body {
    background-color: var(--el-bg-color-overlay);
  }

  .cute-dialog-message {
    color: var(--el-text-color-regular);
  }

  .cute-dialog-footer {
    background-color: var(--el-bg-color-overlay);
    border-color: var(--el-border-color-darker);
  }
}

.title-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.cancel-button,
.confirm-button {
  :deep(.button-icon) {
    margin-right: 4px;
  }
}

.cancel-button {
  :deep(.button-icon) {
    color: var(--el-text-color-regular) !important;
  }

  &:hover {
    :deep(.button-icon) {
      color: var(--el-color-primary) !important;
    }
  }
}

.confirm-button {
  :deep(.button-icon) {
    color: #ffffff !important;
  }
}
</style>
