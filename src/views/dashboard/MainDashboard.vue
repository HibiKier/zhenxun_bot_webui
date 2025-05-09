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
  @apply transition-all duration-300;
  overflow: auto;
}

.base-info {
  @apply bg-opacity-80 backdrop-blur-sm;
  border: 1px solid rgba(255, 192, 203, 0.3);
}

.main-info {
  @apply bg-opacity-80 backdrop-blur-sm;
  border: 1px solid rgba(255, 192, 203, 0.3);
}

.config-info {
  @apply bg-opacity-80 backdrop-blur-sm;
  border: 1px solid rgba(255, 192, 203, 0.3);
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .el-col {
    &:nth-child(1) {
      @apply w-full pr-0;
    }
    &:nth-child(2) {
      @apply w-full px-0;
    }
    &:nth-child(3) {
      @apply w-full pl-0;
    }
  }
}

@media (max-width: 768px) {
  .el-row {
    @apply flex-col;
  }
  .el-col {
    @apply w-full h-auto px-0 py-2;

    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      @apply h-auto;
    }
  }

  .base-info,
  .main-info,
  .config-info {
    @apply px-2;
  }
}
</style>
