<template>
  <div class="base">
    <el-row :gutter="1">
      <el-col :span="6">
        <div class="base-info">
          <LeftInfo :style="{ height: computedHeight + 'px' }" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="main-info">
          <MidInfo :style="{ height: computedHeight + 'px' }" />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="config-info">
          <RightInfo :style="{ height: computedHeight + 'px' }" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LeftInfo from "@/components/command/LeftInfo.vue"
import MidInfo from "@/components/command/MidInfo.vue"
import RightInfo from "@/components/command/RightInfo.vue"
import { getHeaderHeight } from "@/utils/utils"
export default {
  name: "MainCommand",
  data() {
    return {
      botInfo: {},
      windowHeight: window.innerHeight,
    }
  },
  components: { LeftInfo, MidInfo, RightInfo },
  computed: {
    computedHeight() {
      return this.windowHeight - getHeaderHeight()
    },
  },
  created() {},
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
.base {
  background-color: #f4f5fa;
  height: 100%;
  width: 100%;
}

.base-info {
  background-color: #f4f5fa;
  height: 100%;
  min-width: 367px;
}

.main-info {
  height: 100%;
  background-color: #f4f5fa;
}

.test {
  ::v-deep .el-divider--vertical {
    height: 100%;
    margin-left: 40px;
  }
}

.config-info {
  background-color: #f4f5fa;
}
</style>
