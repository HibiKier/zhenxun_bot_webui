<template>
  <div
    :class="[
      'my-button-container',
      disabled
        ? 'opacity-70 cursor-not-allowed'
        : 'transform hover:scale-105 active:scale-95',
    ]"
    :style="{
      width: computedWidth,
      height: computedHeight,
    }"
  >
    <el-tooltip
      v-if="content"
      effect="light"
      :content="content"
      placement="top"
      popper-class="button-tooltip"
    >
      <button
        class="button-class"
        :class="[
          typeClass,
          roundedClass,
          shadowClass,
          disabled ? 'pointer-events-none' : '',
          glowEffect,
        ]"
        @click="handleClick"
        :disabled="disabled"
      >
        <span class="button-content">
          <svg-icon v-if="icon" :icon-class="icon" class="button-icon" />
          <span class="button-text">{{ text }}</span>
        </span>
        <!-- 二次元装饰元素 -->
        <span v-if="!disabled" class="decoration-star">✦</span>
        <span v-if="!disabled" class="decoration-sparkle">✧</span>
      </button>
    </el-tooltip>

    <button
      v-else
      class="button-class"
      :class="[
        typeClass,
        roundedClass,
        shadowClass,
        disabled ? 'pointer-events-none' : '',
        glowEffect,
      ]"
      @click="handleClick"
      :disabled="disabled"
    >
      <span class="button-content">
        <svg-icon v-if="icon" :icon-class="icon" class="button-icon" />
        <span class="button-text">{{ text }}</span>
      </span>
      <!-- 二次元装饰元素 -->
      <span v-if="!disabled" class="decoration-star">✦</span>
      <span v-if="!disabled" class="decoration-sparkle">✧</span>
    </button>
  </div>
</template>

<script>
import SvgIcon from '../SvgIcon/SvgIcon.vue'

export default {
  components: { SvgIcon },
  name: 'MyButton',
  props: {
    text: String,
    icon: String,
    content: String,
    iconWidth: { type: Number, default: 20 },
    iconHeight: { type: Number, default: 20 },
    type: {
      type: String,
      default: 'default',
      validator: (value) =>
        [
          'default',
          'primary',
          'success',
          'warning',
          'danger',
          'pink',
          'purple',
          'mint',
          'peach',
          'sky',
          'lavender',
          'coral',
        ].includes(value),
    },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 40 },
    disabled: { type: Boolean, default: false },
    fontSize: { type: Number, default: 14 },
    rounded: {
      type: String,
      default: 'full',
      validator: (value) => ['none', 'sm', 'md', 'lg', 'full'].includes(value),
    },
    shadow: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value),
    },
    glow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sizeMana: {
        iconWidth: this.iconWidth,
        iconHeight: this.iconHeight,
        fontSize: this.fontSize,
        width: this.width,
        height: this.height,
      },
    }
  },
  computed: {
    computedWidth() {
      return this.sizeMana.width === 0 ? '100%' : `${this.sizeMana.width}px`
    },
    computedHeight() {
      return this.sizeMana.height === 0 ? '100%' : `${this.sizeMana.height}px`
    },
    typeClass() {
      const classes = {
        default:
          'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50',
        primary:
          'bg-blue-400 text-white hover:bg-blue-500 border-2 border-blue-300',
        success:
          'bg-green-400 text-white hover:bg-green-500 border-2 border-green-300',
        warning:
          'bg-yellow-400 text-white hover:bg-yellow-500 border-2 border-yellow-300',
        danger:
          'bg-red-400 text-white hover:bg-red-500 border-2 border-red-300',
        pink: 'bg-pink-300 text-white hover:bg-pink-400 border-2 border-pink-200',
        purple:
          'bg-purple-400 text-white hover:bg-purple-500 border-2 border-purple-300',
        mint: 'bg-teal-300 text-white hover:bg-teal-400 border-2 border-teal-200',
        peach:
          'bg-orange-300 text-white hover:bg-orange-400 border-2 border-orange-200',
        sky: 'bg-cyan-300 text-white hover:bg-cyan-400 border-2 border-cyan-200',
        lavender:
          'bg-indigo-300 text-white hover:bg-indigo-400 border-2 border-indigo-200',
        coral:
          'bg-rose-300 text-white hover:bg-rose-400 border-2 border-rose-200',
      }
      return classes[this.type] || classes.default
    },
    roundedClass() {
      return {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      }[this.rounded]
    },
    shadowClass() {
      return {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
      }[this.shadow]
    },
    glowEffect() {
      if (!this.glow || this.disabled) return ''

      const glowColors = {
        default: 'hover:shadow-gray-300',
        primary: 'hover:shadow-blue-300',
        success: 'hover:shadow-green-300',
        warning: 'hover:shadow-yellow-300',
        danger: 'hover:shadow-red-300',
        pink: 'hover:shadow-pink-200',
        purple: 'hover:shadow-purple-300',
        mint: 'hover:shadow-teal-200',
        peach: 'hover:shadow-orange-200',
        sky: 'hover:shadow-cyan-200',
        lavender: 'hover:shadow-indigo-200',
        coral: 'hover:shadow-rose-200',
      }

      return `transition-shadow duration-300 ${
        glowColors[this.type] || glowColors.default
      } hover:shadow-lg`
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  methods: {
    handleResize() {
      this.sizeMana = {
        iconWidth: this.iconWidth,
        iconHeight: this.iconHeight,
        fontSize: this.fontSize,
        width: this.width,
        height: this.height,
      }
    },
    handleClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style scoped>
.my-button-container {
  position: relative;
  transition: all 0.2s ease;
}

.button-class {
  @apply flex items-center justify-center relative overflow-hidden;
  width: 100%;
  height: 100%;
  font-family: 'Comic Sans MS', 'Segoe UI', sans-serif;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: v-bind('sizeMana.fontSize + "px"');
  padding: 0 1.25em;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.button-content {
  @apply flex items-center justify-center gap-2 z-10;
}

.button-icon {
  width: v-bind('sizeMana.iconWidth + "px"');
  height: v-bind('sizeMana.iconHeight + "px"');
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.button-text {
  white-space: nowrap;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.decoration-star {
  position: absolute;
  right: -5px;
  top: -5px;
  font-size: 0.8em;
  opacity: 0;
  transition: all 0.4s ease;
  transform: rotate(0deg);
  z-index: 5;
}

.decoration-sparkle {
  position: absolute;
  left: -5px;
  bottom: -5px;
  font-size: 0.6em;
  opacity: 0;
  transition: all 0.4s ease 0.1s;
  z-index: 5;
}

.button-class:hover .decoration-star {
  opacity: 1;
  transform: translate(-5px, 5px) rotate(15deg);
}

.button-class:hover .decoration-sparkle {
  opacity: 1;
  transform: translate(5px, -5px) rotate(-15deg);
}

.button-class:hover .button-icon {
  transform: scale(1.15) rotate(5deg);
}

.button-class:active {
  transform: scale(0.95);
}

/* 工具提示样式 */
:deep(.button-tooltip) {
  background-color: #fff !important;
  color: #7c3aed !important;
  border: 1px solid #e9d5ff !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  font-family: 'Comic Sans MS', sans-serif !important;
  border-radius: 12px !important;
  padding: 8px 12px !important;
}

:deep(.button-tooltip .popper__arrow) {
  border-bottom-color: #e9d5ff !important;
}

:deep(.button-tooltip .popper__arrow::after) {
  border-bottom-color: #fff !important;
}

/* 添加可爱的脉冲动画 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.button-class:not(:disabled):hover {
  animation: pulse 1.5s infinite;
}
</style>
