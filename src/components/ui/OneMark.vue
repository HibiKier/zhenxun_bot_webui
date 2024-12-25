<template>
  <div class="one-mark">
    <p class="tip" :style="{ fontSize: fontSize + 'px' }">
      <svg-icon
        icon-class="magic"
        :style="{
          height: height + 'px',
          width: width + 'px',
        }"
      />{{ text }}
    </p>
    <el-divider v-if="showDivider" />
  </div>
</template>

<script>
import { getFontSize, getConvertSize } from "@/utils/utils"

export default {
  name: "OneMark",
  props: {
    text: {
      type: String,
      default: "施展了来自奇迹的魔法",
    },
    showDivider: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      height: 20,
      width: 20,
      fontSize: 11,
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.handleResize()
  },

  methods: {
    handleResize() {
      this.height = getConvertSize(20, 1024)
      this.width = getConvertSize(20, 1024)
      this.fontSize = getFontSize(14)
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style lang="scss" scoped>
.one-mark {
  .tip {
    color: #acafb8;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
  }

  /deep/ .el-divider--horizontal {
    margin-top: 5px;
  }

  /deep/ .el-dialog__header {
    padding: 0;
  }
}
</style>
