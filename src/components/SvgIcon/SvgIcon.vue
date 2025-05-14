<template>
  <svg
    class="svg-icon"
    :class="[iconClass, { 'has-stroke': stroke }]"
    :style="{
      width: size,
      height: size,
      '--icon-color': color,
    }"
    aria-hidden="true"
  >
    <use
      :xlink:href="iconName"
      :style="{
        stroke: stroke ? 'var(--icon-color)' : 'none',
        fill: stroke ? 'none' : 'var(--icon-color)',
      }"
    />
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    // 必须的图标名称
    iconClass: {
      type: String,
      required: true,
    },
    // 图标颜色
    color: {
      type: String,
      default: "var(--primary-color)",
    },
    // 图标大小 (带单位)
    size: {
      type: String,
      default: "1.4em",
    },
    // 是否显示描边 (针对线条图标)
    stroke: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
  },
}
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: -0.15em;
  overflow: hidden;
  transition: color 0.2s, stroke 0.2s;
}

.svg-icon use {
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 确保图标颜色能够正确继承 */
.svg-icon[style*="--icon-color"] use {
  stroke: var(--icon-color);
  fill: var(--icon-color);
}
</style>
