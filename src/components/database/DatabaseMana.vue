<template>
  <div class="main">
    <el-row>
      <el-col :span="8">
        <div class="left-table">
          <table-list :style="{ height: computedHeight + 'px' }" />
        </div>
      </el-col>
      <el-col :span="16">
        <div class="right-main">
          <cmd-main :style="{ height: computedHeight + 'px' }" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHeaderHeight } from "@/utils/utils"
import CmdMain from "./CmdMain.vue"
import TableList from "./TableList.vue"
export default {
  components: { TableList, CmdMain },
  name: "DatabaseMana",
  data() {
    return {
      windowHeight: window.innerHeight,
    }
  },
  computed: {
    computedHeight() {
      return this.windowHeight - getHeaderHeight() - 5
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;

  .right-main {
    height: 100%;
  }
}
</style>
