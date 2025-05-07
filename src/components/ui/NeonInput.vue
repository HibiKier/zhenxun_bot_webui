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
      default: 'text',
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
      this.$emit('input', value)
    },
    handleFocus(e) {
      this.isFocused = true
      this.$emit('focus', e)
    },
    handleBlur(e) {
      this.isFocused = false
      this.$emit('blur', e)
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  .input-wrapper {
    @apply relative;
  }

  .soft-pink-overlay {
    @apply absolute top-0 left-0 right-0 bottom-0 rounded-lg pointer-events-none;
    background: linear-gradient(
      120deg,
      rgba(255, 220, 240, 0.2),
      rgba(255, 200, 220, 0.2)
    );
    opacity: 0.3;
    z-index: 0;
  }

  .border-highlight {
    @apply absolute top-0 left-0 right-0 bottom-0 rounded-lg pointer-events-none;
    background: rgba(255, 182, 193, 0.3);
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
    @apply pr-8 h-10 bg-white bg-opacity-95 rounded-lg border border-pink-200 text-gray-700;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(255, 182, 193, 0.1);
    padding: 0px 30px !important;

    &:hover {
      @apply border-pink-300;
    }

    &:focus {
      box-shadow: 0 0 0 2px rgba(255, 182, 193, 0.2);
      border-color: #ec4899 !important;
    }

    &::placeholder {
      @apply text-pink-300;
    }
  }

  .el-input__prefix {
    @apply left-2 flex items-center;
  }

  .el-input__suffix {
    @apply right-2 flex items-center;
  }

  &.is-focused {
    .el-input__inner {
      @apply border-pink-400 bg-opacity-95;
      box-shadow: 0 0 10px rgba(255, 182, 193, 0.15);
      border-color: #ec4899 !important;
    }
  }
}

.input-icon {
  @apply text-base text-pink-400;
}
</style>
