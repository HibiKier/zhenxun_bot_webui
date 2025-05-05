<template>
  <div
    class="system-container bg-gradient-to-br from-pink-50 to-purple-50 p-4 h-full overflow-y-auto cute-scrollbar"
  >
    <!-- 主容器 - 垂直排列 -->
    <div class="flex flex-col gap-4">
      <!-- 系统状态区域 -->
      <div
        ref="statusContainer"
        class="status bg-white rounded-2xl shadow-md p-4 cute-card"
      >
        <system-status class="h-full" />
      </div>

      <!-- 目录树区域 - 动态高度 -->
      <div
        ref="treeContainer"
        class="tree bg-white rounded-2xl shadow-md p-4 cute-card"
        :style="{ height: computedTreeHeight + 'px' }"
      >
        <dir-tree class="h-full" />
      </div>
    </div>
  </div>
</template>

<script>
import DirTree from "./DirTree.vue"
import SystemStatus from "./SystemStatus.vue"

export default {
  components: {
    SystemStatus,
    DirTree,
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      statusHeight: 0,
      treeHeight: 0,
    }
  },
  computed: {
    computedTreeHeight() {
      // 计算剩余可用高度 = 窗口高度 - 状态区域高度 - 内边距和间距
      const remainingHeight = this.windowHeight - this.statusHeight - 180 // 48 = 32(padding) + 16(gap)
      return Math.max(350, remainingHeight) // 保持最小高度350px
    },
  },
  mounted() {
    this.handleResize()
    window.addEventListener("resize", this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight
      this.$nextTick(() => {
        // 获取状态区域的实际高度
        if (this.$refs.statusContainer) {
          this.statusHeight = this.$refs.statusContainer.clientHeight
        }

        // 确保图表也重新调整大小
        if (this.$refs.treeContainer) {
          this.treeHeight = this.computedTreeHeight
        }
      })
    },
  },
}
</script>

<style scoped>
/* 二次元风格卡片效果 */
.cute-card {
  border-radius: 16px;
  border: 1px solid rgba(236, 72, 153, 0.2);
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff, #faf5ff);
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.1);
}

.cute-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.15);
  border-color: rgba(236, 72, 153, 0.3);
}

/* 可爱风格滚动条 */
.cute-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.cute-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(236, 72, 153, 0.5);
  border-radius: 4px;
}

.cute-scrollbar::-webkit-scrollbar-track {
  background-color: rgba(236, 72, 153, 0.1);
  border-radius: 4px;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .system-container {
    padding: 10px;
  }

  .cute-card {
    border-radius: 12px;
  }
}

/* 动画效果 */
@keyframes cute-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.cute-card:hover {
  animation: cute-bounce 0.5s ease;
}
</style>
