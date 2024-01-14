<template>
  <div class="system">
    <div class="status">
      <system-status />
    </div>
    <el-divider direction="vertical" />
    <div class="tree">
      <dir-tree />
    </div>
  </div>
</template>

<script>
import DirTree from "./DirTree.vue"
import SystemStatus from "./SystemStatus.vue"
export default {
  components: { SystemStatus, DirTree },
}
</script>

<style lang="scss" scoped>
.system {
  display: flex;
  height: 100%;
  width: 100%;
  .status {
    height: 100%;
    width: 40%;
  }

  .tree {
    height: 100%;
    width: 60%;
  }

  ::v-deep .el-divider--vertical {
    height: calc(100% - 40px);
    margin: 20px 0;
  }
}
</style>
