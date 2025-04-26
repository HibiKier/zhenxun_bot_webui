<template>
  <div class="base" :style="{ height: computedHeight + 'px' }">
    <el-row :gutter="1">
      <el-col :span="6">
        <div class="base-info">
          <LeftInfo />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="main-info">
          <MidInfo />
        </div>
      </el-col>
      <el-col :span="6" :style="{ height: computedHeight + 'px' }">
        <div class="config-info">
          <RightInfo />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LeftInfo from "@/components/dashboard/LeftInfo.vue"
import MidInfo from "@/components/dashboard/MidInfo.vue"
import RightInfo from "@/components/dashboard/RightInfo.vue"
import { getHeaderHeight } from "@/utils/utils"
export default {
  name: "MainDashboard",
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
}
</script>

<style lang="scss" scoped>
.base {
  background-color: var(--bg-color);
}

.base-info {
  background-color: var(--bg-color);
  height: 100%;
  min-width: 367px;
}

.main-info {
  height: 100%;
  // min-width: 1080px;
  background-color: var(--bg-color);
  overflow: auto;
  padding: 0 10px;
  box-sizing: border-box;
}

.config-info {
  height: 100%;
  // min-width: 501px;
  background-color: var(--bg-color);
}
</style>
