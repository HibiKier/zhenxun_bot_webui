<template>
  <div class="one-mark">
    <p class="tip">
      <svg-icon icon-class="magic" style="height: 20px; width: 20px" />{{
        text
      }}
    </p>
    <el-divider v-if="showDivider" />
  </div>
</template>

<script>
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
}
</script>

<style lang="scss" scoped>
.one-mark {
  .tip {
    color: #acafb8;
    font-size: 12px;
    text-align: center;
    padding: 10px;
  }

  /deep/ .el-divider--horizontal {
    margin-top: 5px;
  }
}
</style>
