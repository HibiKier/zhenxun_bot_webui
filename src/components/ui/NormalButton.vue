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
    <svg-icon :icon-class="iconClass" v-if="iconClass"></svg-icon>
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
import SvgIcon from '../SvgIcon/SvgIcon.vue'
export default {
  name: 'NormalButton',
  components: { SvgIcon },
  props: {
    disabled: Boolean,
    iconClass: {
      type: String,
    },
    text: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    baseClass: {
      type: String,
      default: '',
    },
    activeClass: {
      type: String,
      default: '',
    },
    disabledClass: {
      type: String,
      default: 'bg-gray-100 text-gray-400 cursor-not-allowed',
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
        this.$emit('click')
      }
    },
  },
}
</script>
<style scoped>
/* 按钮动画 */
button {
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
