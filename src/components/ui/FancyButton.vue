<template>
  <el-button
    class="pink-white-button"
    :class="{ 'is-loading': loading }"
    @click="handleClick"
    :style="{ fontSize: fontSize + 'px', color: '#fff' }"
  >
    <span class="button-content">
      <i v-if="icon" :class="icon"></i>
      <span>{{ text }}</span>
    </span>
  </el-button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "Click Me",
    },
    icon: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: Number,
      default: 14,
    },
  },
  methods: {
    handleClick() {
      this.$emit("click")
    },
  },
}
</script>

<style scoped>
.pink-white-button {
  --main-color: #f589b9; /* 主粉色 */
  --hover-color: #ff5ca1; /* 悬停时更深的粉色 */
  --active-color: #ff3d7f; /* 点击时最深的粉色 */
  --text-color: #ffffff; /* 白色文字 */
  --transition-speed: 0.2s;
  position: relative;
  border: none;
  border-radius: 5px; /* 圆角 */
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  background-color: var(--main-color);
  transition: all var(--transition-speed) ease;
  cursor: pointer;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pink-white-button:hover {
  background-color: var(--hover-color);
}

.pink-white-button:active {
  background-color: var(--active-color);
}

.pink-white-button .button-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pink-white-button.is-loading {
  pointer-events: none;
}

.pink-white-button.is-loading .button-content {
  opacity: 0;
}

.pink-white-button.is-loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--text-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* 图标样式 */
.pink-white-button i {
  font-size: 16px;
}

/* 禁用状态 */
.pink-white-button.is-disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* 不同尺寸 */
.pink-white-button.small {
  padding: 8px 16px;
  font-size: 12px;
}

.pink-white-button.large {
  padding: 12px 32px;
  font-size: 16px;
}

/* 白色边框变体 */
.pink-white-button.outline {
  background-color: transparent;
  border: 2px solid var(--main-color);
  color: var(--main-color);
}

.pink-white-button.outline:hover {
  background-color: rgba(255, 126, 185, 0.1);
}

.pink-white-button.outline:active {
  background-color: rgba(255, 126, 185, 0.2);
}
</style>
