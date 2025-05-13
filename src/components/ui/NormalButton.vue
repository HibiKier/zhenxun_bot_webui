<template>
  <button
    :disabled="disabled"
    @click.stop="handleClick"
    class="p-2 rounded-lg flex items-center ml-2 transition-all duration-200"
    :class="[
      baseClass,
      disabled ? disabledClass : activeClass,
      { 'hover:scale-110': !disabled },
    ]"
    :title="title"
  >
    <svg-icon
      :icon-class="iconClass"
      v-if="iconClass"
      class="button-icon"
    ></svg-icon>
    <span
      v-if="showText"
      class="ml-1 text-xs"
      :class="{ 'hidden xs:inline': !forceShowText }"
    >
      {{ forceShowText ? text : text.charAt(0) }}
    </span>
  </button>
</template>

<script>
import SvgIcon from "../SvgIcon/SvgIcon.vue"
export default {
  name: "NormalButton",
  components: { SvgIcon },
  props: {
    disabled: Boolean,
    iconClass: {
      type: String,
    },
    text: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    baseClass: {
      type: String,
      default: "",
    },
    activeClass: {
      type: String,
      default: "",
    },
    disabledClass: {
      type: String,
      default: "bg-gray-100 text-gray-400 cursor-not-allowed",
    },
    showText: {
      type: Boolean,
      default: true,
    },
    forceShowText: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit("click")
      }
    },
  },
}
</script>
<style scoped>
.normal-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  box-shadow: var(--el-box-shadow-lighter);
}

.normal-button:hover {
  background-color: var(--bg-color-hover);
  border-color: var(--primary-color-light);
  transform: scale(1.02);
  box-shadow: var(--el-box-shadow-light);
}

.normal-button:active {
  transform: scale(0.98);
  box-shadow: none;
}

.normal-button.disabled {
  background-color: var(--el-fill-color-light);
  color: var(--text-color-disabled);
  border-color: var(--border-color-light);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.normal-button.disabled:hover {
  background-color: var(--el-fill-color-light);
  border-color: var(--border-color-light);
  transform: none;
  box-shadow: none;
}

.button-icon {
  margin-right: 0.5rem;
  color: var(--primary-color);
  transition: color 0.3s ease;
}

.disabled .button-icon {
  color: var(--text-color-disabled);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .normal-button {
    padding: 0.375rem 0.75rem;
  }

  .button-icon {
    margin-right: 0.25rem;
  }
}
</style>
