<template>
  <div class="moe-select-container w-full">
    <el-select
      v-model="selectedValue"
      :placeholder="placeholder"
      :popper-class="`moe-select-dropdown ${popperClass}`"
      class="moe-el-select w-full"
      :class="{ 'is-focused': isDropdownVisible }"
      @change="handleChange"
      @visible-change="handleVisibleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      :clearable="clearable"
    >
      <template #prefix>
        <i class="i-mdi-heart-outline text-pink-400 mr-1"></i>
      </template>

      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        class="moe-select-option"
      >
        <div class="flex items-center">
          <i
            class="i-mdi-star-outline text-pink-300 mr-2"
            v-if="!isSelected(item)"
          ></i>
          <i class="i-mdi-star text-yellow-400 mr-2" v-else></i>
          <span class="flex-1">{{ item.label }}</span>
          <i class="i-mdi-check text-pink-400 ml-2" v-if="isSelected(item)"></i>
        </div>
      </el-option>
    </el-select>

    <div class="soft-pink-overlay"></div>
    <div
      class="border-highlight"
      :class="{ 'is-active': isDropdownVisible }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "MoeSelect",
  props: {
    value: {
      type: [String, Number, Object],
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
      required: true,
    },
    placeholder: {
      type: String,
      default: "请选择~",
    },
    popperClass: {
      type: String,
      default: "",
    },
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedValue: this.value,
      isDropdownVisible: false,
    }
  },
  computed: {
    selectedOption() {
      return (
        this.options.find((opt) => opt.value === this.selectedValue) || null
      )
    },
  },
  methods: {
    handleChange(value) {
      this.$emit("input", value)
      this.$emit("change", value)
    },
    handleVisibleChange(visible) {
      this.isDropdownVisible = visible
    },
    handleFocus() {
      this.$emit("focus")
    },
    handleBlur() {
      this.$emit("blur")
    },
    isSelected(option) {
      return option.value === this.selectedValue
    },
  },
  watch: {
    value(newVal) {
      this.selectedValue = newVal
    },
  },
}
</script>

<style lang="scss" scoped>
.moe-select-container {
  @apply relative w-full;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

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

.moe-el-select {
  /deep/ .el-input__inner {
    @apply pl-8 pr-8 h-10 bg-white bg-opacity-95 rounded-lg border border-pink-200 text-gray-700;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(255, 182, 193, 0.1);

    &:hover {
      @apply border-pink-300;
    }

    &:focus {
      @apply border-pink-400 bg-opacity-95;
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
    transition: transform 0.3s ease;
  }

  &.is-focused {
    .el-input__inner {
      @apply border-pink-400 bg-opacity-95;
      box-shadow: 0 0 10px rgba(255, 182, 193, 0.15);
    }

    .el-input__suffix {
      transform: rotate(180deg);
    }
  }
}
</style>

<style lang="scss">
.moe-select-dropdown {
  @apply rounded-lg border border-pink-200 shadow-lg overflow-hidden;
  background: white;
  max-height: 300px !important;

  /deep/ .el-select-dropdown__item {
    @apply text-gray-600 flex items-center py-2 px-4;
    transition: all 0.2s ease;
    height: auto;

    &:hover {
      @apply bg-pink-50 text-pink-500;
    }

    &.selected {
      @apply font-medium bg-pink-100 text-pink-600;
    }

    &.hover {
      @apply bg-pink-50;
    }
  }

  .el-select-dropdown__empty {
    @apply text-pink-400 py-4;
  }

  .el-select-dropdown__wrap {
    max-height: 300px !important;
  }

  @media (max-width: 640px) {
    width: 100% !important;
    margin-top: 4px !important;

    .el-select-dropdown__item {
      @apply py-3 px-4;
    }
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    @apply bg-pink-50;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-pink-200 rounded-full;
  }
}
</style>
