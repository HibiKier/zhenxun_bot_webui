<template>
  <div class="moe-input-container">
    <div class="input-wrapper">
      <el-input
        v-model="innerValue"
        :placeholder="placeholder"
        class="moe-el-input"
        :class="{ 'is-focused': isFocused }"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        :type="type"
      >
        <template v-if="prefixIcon" #prefix>
          <i :class="prefixIcon" class="input-icon"></i>
        </template>
        <template v-if="suffixIcon" #suffix>
          <i :class="suffixIcon" class="input-icon"></i>
        </template>
      </el-input>
      <div class="soft-pink-overlay"></div>
      <div class="border-highlight" :class="{ 'is-active': isFocused }"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Number],
    placeholder: String,
    prefixIcon: String,
    suffixIcon: String,
    type: {
      type: String,
      default: "text",
    },
  },
  data() {
    return {
      isFocused: false,
      innerValue: this.value,
    }
  },
  methods: {
    handleInput(value) {
      this.$emit("input", value)
    },
    handleFocus(e) {
      this.isFocused = true
      this.$emit("focus", e)
    },
    handleBlur(e) {
      this.isFocused = false
      this.$emit("blur", e)
    },
  },
  watch: {
    value(newVal) {
      this.innerValue = newVal
    },
  },
}
</script>

<style lang="scss" scoped>
.moe-input-container {
  @apply relative w-full;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  .input-wrapper {
    @apply relative;
  }

  .soft-pink-overlay {
    @apply absolute top-0 left-0 right-0 bottom-0 rounded-lg pointer-events-none;
    background: linear-gradient(
      120deg,
      var(--primary-color-light-9),
      var(--primary-color-light-8)
    );
    opacity: 0.3;
    z-index: 0;
  }

  .border-highlight {
    @apply absolute top-0 left-0 right-0 bottom-0 rounded-lg pointer-events-none;
    background: var(--primary-color-light-7);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;

    &.is-active {
      opacity: 1;
    }
  }
}

.moe-el-input {
  /deep/ .el-input__inner {
    @apply pr-8 h-10 rounded-lg;
    background-color: var(--bg-color-secondary);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
    box-shadow: var(--el-box-shadow-lighter);
    padding: 0px 30px !important;

    &:hover {
      border-color: var(--primary-color-light);
      box-shadow: var(--el-box-shadow-light);
    }

    &:focus {
      box-shadow: 0 0 0 2px var(--primary-color-light-9);
      border-color: var(--primary-color) !important;
    }

    &::placeholder {
      color: var(--text-color-placeholder);
    }
  }

  .el-input__prefix {
    @apply left-2 flex items-center;
    color: var(--primary-color);
  }

  .el-input__suffix {
    @apply right-2 flex items-center;
    color: var(--text-color-secondary);
  }

  &.is-focused {
    .el-input__inner {
      background-color: var(--bg-color-secondary);
      box-shadow: var(--el-box-shadow-light);
      border-color: var(--primary-color) !important;
    }
  }
}

.input-icon {
  color: var(--primary-color);
  transition: color 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .moe-el-input {
    /deep/ .el-input__inner {
      @apply h-9 text-sm;
      padding: 0px 24px !important;
    }

    .el-input__prefix,
    .el-input__suffix {
      @apply text-sm;
    }
  }
}
</style>
