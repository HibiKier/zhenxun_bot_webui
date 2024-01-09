<template>
  <div
    class="button-wrapper"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <button
      class="button-class"
      role="button"
      @click="() => this.$emit('click')"
      :style="{
        width: '100%',
        height: '100%',
        'background-color': backgroundColor,
        color: color,
      }"
    >
      {{ text }}
      <span v-if="icon">
        <svg-icon
          :icon-class="icon"
          :style="{ width: iconWidth + 'px', height: iconHeight + 'px' }"
        />
      </span>
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
    iconWidth: { type: String, default: "23" },
    iconHeight: { type: String, default: "23" },
    type: String,
    width: {
      type: Number,
      default: 66,
    },
    height: {
      type: Number,
      default: 40,
    },
  },
  data() {
    return {
      color: "#000000",
      backgroundColor: null,
    }
  },
  mounted() {
    if (this.type == "success") {
      this.color = "#ffffff"
      this.backgroundColor = "#67C23A"
    } else if (this.type == "error") {
      this.color = "#ffffff"
      this.backgroundColor = "#F56C6C"
    } else if (this.type == "warn") {
      this.color = "#ffffff"
      this.backgroundColor = "#E6A23C"
    } else if (this.type == "main") {
      this.color = "#ffffff"
      this.backgroundColor = "#409EFF"
    }
  },
}
</script>

<style lang="scss" scoped>
.button-class {
  align-items: center;
  appearance: none;
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 0.375em;
  box-shadow: none;
  box-sizing: border-box;
  color: #363636;
  cursor: pointer;
  display: inline-flex;
  font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  font-size: 1rem;
  height: 2.5em;
  justify-content: center;
  line-height: 1.5;
  padding: calc(0.5em - 1px) 1em;
  position: relative;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;
}

.button-class:active {
  border-color: #4a4a4a;
  outline: 0;
}

.button-class:focus {
  border-color: #485fc7;
  outline: 0;
}

.button-class:hover {
  border-color: #b5b5b5;
}

.button-class:focus:not(:active) {
  box-shadow: rgba(72, 95, 199, 0.25) 0 0 0 0.125em;
}
</style>
