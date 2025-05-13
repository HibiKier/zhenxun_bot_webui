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
import SvgIcon from "../SvgIcon/SvgIcon.vue"

export default {
  components: { SvgIcon },
  name: "MyButton",
  props: {
    text: String,
    icon: String,
    content: String,
    iconWidth: { type: Number, default: 20 },
    iconHeight: { type: Number, default: 20 },
    type: {
      type: String,
      default: "default",
      validator: (value) =>
        ["default", "primary", "success", "warning", "danger", "info"].includes(
          value
        ),
    },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 40 },
    disabled: { type: Boolean, default: false },
    fontSize: { type: Number, default: 14 },
    rounded: {
      type: String,
      default: "full",
      validator: (value) => ["none", "sm", "md", "lg", "full"].includes(value),
    },
    shadow: {
      type: String,
      default: "md",
      validator: (value) => ["none", "sm", "md", "lg", "xl"].includes(value),
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
      return this.sizeMana.width === 0 ? "100%" : `${this.sizeMana.width}px`
    },
    computedHeight() {
      return this.sizeMana.height === 0 ? "100%" : `${this.sizeMana.height}px`
    },
    typeClass() {
      const classes = {
        default:
          "bg-bg-color-secondary text-text-color border-2 border-border-color hover:bg-bg-color-hover",
        primary:
          "bg-primary-color text-white hover:bg-primary-color-light border-2 border-primary-color-light",
        success:
          "bg-success-color text-white hover:bg-success-color-light border-2 border-success-color-light",
        warning:
          "bg-warning-color text-white hover:bg-warning-color-light border-2 border-warning-color-light",
        danger:
          "bg-danger-color text-white hover:bg-danger-color-light border-2 border-danger-color-light",
        info: "bg-info-color text-white hover:bg-info-color-light border-2 border-info-color-light",
      }
      return classes[this.type] || classes.default
    },
    roundedClass() {
      return {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      }[this.rounded]
    },
    shadowClass() {
      return {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
      }[this.shadow]
    },
    glowEffect() {
      if (!this.glow || this.disabled) return ""

      const glowColors = {
        default: "hover:shadow-border-color",
        primary: "hover:shadow-primary-color-light",
        success: "hover:shadow-success-color-light",
        warning: "hover:shadow-warning-color-light",
        danger: "hover:shadow-danger-color-light",
        info: "hover:shadow-info-color-light",
      }

      return `transition-shadow duration-300 ${
        glowColors[this.type] || glowColors.default
      } hover:shadow-lg`
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
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
    handleClick(event) {
      if (!this.disabled) {
        this.$emit("click", event)
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style lang="scss" scoped>
.my-button-container {
  @apply relative inline-flex;
  transition: all 0.3s ease;
}

.button-class {
  @apply relative w-full h-full flex items-center justify-center;
  transition: all 0.3s ease;
  font-size: v-bind('sizeMana.fontSize + "px"');
  box-shadow: var(--el-box-shadow-lighter);

  &:hover {
    box-shadow: var(--el-box-shadow-light);
  }

  &:active {
    box-shadow: none;
  }
}

.button-content {
  @apply flex items-center justify-center;
  z-index: 1;
}

.button-icon {
  width: v-bind('sizeMana.iconWidth + "px"');
  height: v-bind('sizeMana.iconHeight + "px"');
  margin-right: 8px;
  color: currentColor;
  transition: transform 0.3s ease;
}

.button-text {
  @apply whitespace-nowrap;
  transition: transform 0.3s ease;
}

.decoration-star,
.decoration-sparkle {
  @apply absolute pointer-events-none;
  opacity: 0;
  transition: all 0.3s ease;
  color: var(--primary-color);
}

.decoration-star {
  top: -8px;
  right: -8px;
  font-size: 12px;
}

.decoration-sparkle {
  bottom: -8px;
  left: -8px;
  font-size: 10px;
}

.button-class:hover {
  .decoration-star {
    opacity: 1;
    transform: translate(4px, -4px) rotate(15deg);
  }

  .decoration-sparkle {
    opacity: 1;
    transform: translate(-4px, 4px) rotate(-15deg);
  }

  .button-icon {
    transform: scale(1.1);
  }

  .button-text {
    transform: scale(1.05);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .button-class {
    font-size: calc(v-bind("sizeMana.fontSize") * 0.9px);
  }

  .button-icon {
    width: calc(v-bind("sizeMana.iconWidth") * 0.9px);
    height: calc(v-bind("sizeMana.iconHeight") * 0.9px);
    margin-right: 6px;
  }
}
</style>
