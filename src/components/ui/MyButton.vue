<template>
  <div
    :class="{ disabled: disabled }"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <span class="content">
      <el-tooltip
        v-if="content"
        class="item"
        effect="dark"
        :content="content"
        placement="top-start"
      >
        <button
          class="button-class"
          role="button"
          :class="{ disabled: disabled }"
          @click="() => this.$emit('click')"
          :style="{
            width: '100%',
            height: '100%',
            'background-color': backgroundColor,
            color: color,
          }"
        >
          {{ text }}
          <span v-if="icon" style="margin-top: 5px">
            <svg-icon
              :icon-class="icon"
              :style="{ width: iconWidth + 'px', height: iconHeight + 'px' }"
            />
          </span>
        </button>
      </el-tooltip>
      <button
        v-else
        class="button-class"
        role="button"
        :class="{ disabled: disabled }"
        :disabled="disabled"
        @click="() => this.$emit('click')"
        :style="{
          width: '100%',
          height: '100%',
          'background-color': backgroundColor,
          color: color,
        }"
      >
        <span v-if="icon" style="margin-top: 5px">
          <svg-icon
            :icon-class="icon"
            :style="{ width: iconWidth + 'px', height: iconHeight + 'px' }"
          />
        </span>
        <span style="margin-left: 5px">{{ text }}</span>
      </button>
    </span>
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
    iconWidth: { type: Number, default: 23 },
    iconHeight: { type: Number, default: 23 },
    type: String,
    width: {
      type: Number,
      default: 66,
    },
    height: {
      type: Number,
      default: 40,
    },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      color: "#606266",
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

.content {
  position: relative;
  z-index: 2;
}

.disabled {
  cursor: not-allowed;
  position: relative;
}

.disabled::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1); /* 灰色遮罩的颜色和透明度 */
  z-index: 1; /* 确保遮罩在内容之上 */
  border-radius: 5px;
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
