<template>
  <div class="main">
    <div class="left-table">
      <table-list />
    </div>
    <div class="right-main">
      <cmd-main />
    </div>
  </div>
</template>

<script>
import CmdMain from "./CmdMain.vue"
import TableList from "./TableList.vue"
export default {
  components: { TableList, CmdMain },
  name: "DatabaseMana",
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  .left-table {
    width: 17%;
    height: 100%;
    background-color: #f4f5fa;
  }

  .right-main {
    width: 82%;
    height: 100%;
  }
}
</style>
