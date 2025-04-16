<template>
  <div class="base-box">
    <StoreTemplate />
  </div>
</template>

<script>
import StoreTemplate from "@/components/store/StoreTemplate.vue"

export default {
  name: "PluginList",
  data() {
    return {}
  },
  components: {
    StoreTemplate,
  },
}
</script>

<style lang="scss" scoped>
.el-main {
  background-color: var(--el-bg-color-page);
}

.base-box {
  padding: 20px;
  width: calc(100% - 40px);
  height: calc(100% - 80px);
  background-color: var(--bg-color);
}
</style>
