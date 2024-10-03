<template>
  <div class="system">
    <div class="status">
      <system-status />
    </div>
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
  width: 100%;
  .status {
    height: 100%;
  }

  .tree {
    height: 100%;
  }
}
</style>
