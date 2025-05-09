<template>
  <div
    class="base bg-gradient-to-br from-pink-100 to-purple-100"
    :style="{ height: computedHeight + 'px' }"
  >
    <el-row :gutter="1" class="h-full">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" class="h-full">
        <div class="base-info h-full pr-0 md:pr-0">
          <LeftInfo class="h-full" />
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="16" :lg="12" class="h-full">
        <div class="main-info h-full px-0 md:px-0">
          <MidInfo class="h-full" />
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="6" class="h-full">
        <div class="config-info h-full pl-0 md:pl-0">
          <RightInfo class="h-full" />
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
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style lang="scss" scoped>
.base {
  @apply transition-all duration-300;
  overflow: auto;
}

.base-info {
  @apply bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-cute;
  border: 1px solid rgba(255, 192, 203, 0.3);
}

.main-info {
  @apply bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-cute;
  border: 1px solid rgba(216, 180, 254, 0.3);
}

.config-info {
  @apply bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-cute;
  border: 1px solid rgba(255, 192, 203, 0.3);
}

/* 自定义二次元风格阴影 */
.shadow-cute {
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.1),
    0 2px 5px rgba(192, 132, 252, 0.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .el-col {
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      @apply h-auto;
    }
  }

  .base-info,
  .main-info,
  .config-info {
    @apply mb-2;
  }
}

@media (max-width: 768px) {
  .el-row {
    @apply flex-col;
  }

  .base-info,
  .main-info,
  .config-info {
    @apply px-2;
  }
}
</style>
