<template>
  <div
    :class="[
      'my-button-container',
      customClass,
      disabled || loading
        ? 'opacity-70 cursor-not-allowed'
        : 'transform hover:scale-102 active:scale-98',
      `button-size-${size}`,
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
        :type="nativeType"
        class="button-class"
        :class="[
          typeClass,
          roundedClass,
          shadowClass,
          disabled || loading ? 'pointer-events-none' : '',
          glowEffect,
        ]"
        @click="handleClick"
        :disabled="disabled || loading"
        :style="{
          '--button-bg-color': getButtonColor(),
          '--button-hover-color': getButtonHoverColor(),
          '--button-border-color': getButtonBorderColor(),
        }"
      >
        <span class="button-content">
          <el-icon v-if="loading" class="is-loading">
            <svg-icon
              icon-class="loading"
              class="animate-spin"
              :color="getIconColor()"
            />
          </el-icon>
          <svg-icon
            v-else-if="icon"
            :icon-class="icon"
            class="button-icon"
            :color="getIconColor()"
            :width="getIconSize()"
            :height="getIconSize()"
          />
          <span
            class="button-text"
            :style="{
              fontSize: `${getFontSize()}px`,
            }"
            >{{ text }}</span
          >
        </span>
        <div class="button-background"></div>
      </button>
    </el-tooltip>

    <button
      v-else
      :type="nativeType"
      class="button-class"
      :class="[
        typeClass,
        roundedClass,
        shadowClass,
        disabled || loading ? 'pointer-events-none' : '',
        glowEffect,
      ]"
      @click="handleClick"
      :disabled="disabled || loading"
      :style="{
        '--button-bg-color': getButtonColor(),
        '--button-hover-color': getButtonHoverColor(),
        '--button-border-color': getButtonBorderColor(),
      }"
    >
      <span class="button-content">
        <el-icon v-if="loading" class="is-loading">
          <svg-icon
            icon-class="loading"
            class="animate-spin"
            :color="getIconColor()"
          />
        </el-icon>
        <svg-icon
          v-else-if="icon"
          :icon-class="icon"
          class="button-icon"
          :color="getIconColor()"
          :width="getIconSize()"
          :height="getIconSize()"
        />
        <span
          class="button-text"
          :style="{
            fontSize: `${getFontSize()}px`,
          }"
          >{{ text }}</span
        >
      </span>
      <div class="button-background"></div>
    </button>
  </div>
</template>

<script>
import SvgIcon from "../SvgIcon/SvgIcon.vue"

export default {
  components: { SvgIcon },
  name: "MyButton",
  props: {
    text: {
      type: String,
      default: "",
      required: true,
      validator: (value) => value.length <= 20,
    },
    icon: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    iconSize: {
      type: [Number, String],
      default: 20,
      validator: (value) => !isNaN(Number(value)) && Number(value) > 0,
    },
    type: {
      type: String,
      default: "default",
      validator: (value) =>
        ["default", "primary", "success", "warning", "danger", "info"].includes(
          value
        ),
    },
    size: {
      type: String,
      default: "default",
      validator: (value) => ["small", "default", "large"].includes(value),
    },
    width: {
      type: [Number, String],
      default: 0,
      validator: (value) => !isNaN(Number(value)) && Number(value) >= 0,
    },
    height: {
      type: [Number, String],
      default: 40,
      validator: (value) => !isNaN(Number(value)) && Number(value) > 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: [Number, String],
      default: 14,
      validator: (value) => !isNaN(Number(value)) && Number(value) > 0,
    },
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
    loading: {
      type: Boolean,
      default: false,
    },
    nativeType: {
      type: String,
      default: "button",
      validator: (value) => ["button", "submit", "reset"].includes(value),
    },
    customClass: {
      type: String,
      default: "",
    },
    iconColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      sizeMana: {
        iconWidth: this.getIconSize(),
        iconHeight: this.getIconSize(),
        fontSize: this.getFontSize(),
        width: this.width,
        height: this.height,
      },
    }
  },
  computed: {
    buttonSize() {
      const sizes = {
        small: {
          height: 32,
          fontSize: 12,
          iconSize: 16,
        },
        default: {
          height: 40,
          fontSize: 14,
          iconSize: 20,
        },
        large: {
          height: 48,
          fontSize: 16,
          iconSize: 24,
        },
      }
      return sizes[this.size] || sizes.default
    },
    computedWidth() {
      return this.sizeMana.width === 0 ? "100%" : `${this.sizeMana.width}px`
    },
    computedHeight() {
      return this.sizeMana.height === 0 ? "100%" : `${this.sizeMana.height}px`
    },
    typeClass() {
      const classes = {
        default:
          "bg-fill-color text-text-color border border-border-color hover:bg-fill-color-light",
        primary:
          "bg-primary-color text-white hover:bg-primary-color-light border border-primary-color-light",
        success:
          "bg-success-color text-white hover:bg-success-color-light border border-success-color-light",
        warning:
          "bg-warning-color text-white hover:bg-warning-color-light border border-warning-color-light",
        danger:
          "bg-danger-color text-white hover:bg-danger-color-light border border-danger-color-light",
        info: "bg-info-color text-white hover:bg-info-color-light border border-info-color-light",
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
        iconWidth: this.getIconSize(),
        iconHeight: this.getIconSize(),
        fontSize: this.getFontSize(),
        width: this.width,
        height: this.height,
      }
    },
    handleClick(event) {
      if (!this.disabled) {
        this.$emit("click", event)
      }
    },
    getButtonColor() {
      const colors = {
        default: "var(--el-bg-color)",
        primary: "var(--el-color-primary)",
        success: "var(--el-color-success)",
        warning: "var(--el-color-warning)",
        danger: "var(--el-color-danger)",
        info: "var(--el-color-info)",
      }
      return colors[this.type] || colors.default
    },
    getButtonHoverColor() {
      const colors = {
        default: "var(--el-bg-color-page)",
        primary: "var(--el-color-primary-light-3)",
        success: "var(--el-color-success-light-3)",
        warning: "var(--el-color-warning-light-3)",
        danger: "var(--el-color-danger-light-3)",
        info: "var(--el-color-info-light-3)",
      }
      return colors[this.type] || colors.default
    },
    getButtonBorderColor() {
      const colors = {
        default: "var(--el-border-color)",
        primary: "var(--el-color-primary-light-5)",
        success: "var(--el-color-success-light-5)",
        warning: "var(--el-color-warning-light-5)",
        danger: "var(--el-color-danger-light-5)",
        info: "var(--el-color-info-light-5)",
      }
      return colors[this.type] || colors.default
    },
    getIconColor() {
      if (this.iconColor) {
        return this.iconColor
      }
      if (this.disabled) {
        return "var(--el-text-color-disabled)"
      }
      if (this.type === "default") {
        return "var(--el-text-color-primary)"
      }
      if (this.loading) {
        return "var(--el-color-primary)"
      }
      return "#ffffff"
    },
    getIconSize() {
      if (this.iconSize) {
        return Number(this.iconSize)
      }
      return this.buttonSize.iconSize
    },
    getFontSize() {
      if (this.fontSize) {
        return Number(this.fontSize)
      }
      return this.buttonSize.fontSize
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
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-class {
  @apply relative w-full h-full flex items-center justify-center overflow-hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: v-bind('sizeMana.fontSize + "px"');
  position: relative;

  &:not(.bg-bg-color-secondary) {
    color: #ffffff;
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary-light-3);

    &:hover {
      background-color: var(--el-color-primary-light-3);
      border-color: var(--el-color-primary-light-5);
    }

    &:active {
      background-color: var(--el-color-primary-light-5);
      border-color: var(--el-color-primary-light-7);
    }
  }

  &.bg-bg-color-secondary {
    color: var(--el-text-color-primary);
    background-color: var(--el-fill-color);
    border-color: var(--el-border-color);

    &:hover {
      background-color: var(--el-fill-color-light);
      border-color: var(--el-border-color-darker);
    }

    &:active {
      background-color: var(--el-fill-color-dark);
      border-color: var(--el-border-color-darker);
    }
  }

  &:not(:disabled) {
    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--el-box-shadow);
    }

    &:active {
      transform: translateY(1px);
      box-shadow: var(--el-box-shadow-lighter);
    }
  }

  &:disabled {
    opacity: 0.7;
    background-color: var(--el-fill-color-light);
    border-color: var(--el-border-color-light);
    color: var(--el-text-color-disabled);
  }
}

.button-content {
  @apply flex items-center justify-center relative z-10;
  gap: 0.5rem;
}

.button-icon {
  width: v-bind('sizeMana.iconWidth + "px"');
  height: v-bind('sizeMana.iconHeight + "px"');
  transition: transform 0.3s ease;
}

.button-text {
  @apply whitespace-nowrap font-medium;
  letter-spacing: 0.025em;
}

.button-background {
  @apply absolute inset-0 z-0;
  background: linear-gradient(
    45deg,
    transparent 25%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 75%
  );
  background-size: 200% 200%;
  transition: all 0.3s ease;
  opacity: 0;
}

.button-class:not(:disabled):hover {
  .button-background {
    opacity: 1;
    animation: shimmer 2s infinite;
  }

  .button-icon {
    transform: scale(1.1) rotate(5deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 200%;
  }
  100% {
    background-position: -200% -200%;
  }
}

/* 按钮尺寸样式 */
.button-size-small {
  .button-class {
    padding: 0.375rem 0.75rem;
  }
  .button-content {
    gap: 0.375rem;
  }
}

.button-size-default {
  .button-class {
    padding: 0.5rem 1rem;
  }
  .button-content {
    gap: 0.5rem;
  }
}

.button-size-large {
  .button-class {
    padding: 0.625rem 1.25rem;
  }
  .button-content {
    gap: 0.625rem;
  }
}

/* 加载状态样式 */
.is-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .animate-spin {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .button-size-small {
    .button-class {
      padding: 0.25rem 0.5rem;
    }
    .button-content {
      gap: 0.25rem;
    }
  }

  .button-size-default {
    .button-class {
      padding: 0.375rem 0.75rem;
    }
    .button-content {
      gap: 0.375rem;
    }
  }

  .button-size-large {
    .button-class {
      padding: 0.5rem 1rem;
    }
    .button-content {
      gap: 0.5rem;
    }
  }
}
</style>
