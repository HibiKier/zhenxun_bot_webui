<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
   
  <script>
export default {
  name: "svg-icon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
  },
};
</script>
   
<style scoped>
.svg-icon {
  width: 16px;
  height: 16px;
  vertical-align: -3px;
  fill: currentColor;
  overflow: hidden;
}
</style>