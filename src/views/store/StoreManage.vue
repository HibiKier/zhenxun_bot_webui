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
  background-color: #f1f5f8;
}

.base-box {
  padding: 20px;
  width: calc(100% - 40px);
  height: calc(100% - 80px);
}
</style>
