<template>
  <div
    class="system-container bg-gradient-to-br from-pink-50 to-purple-50 p-2 sm:p-4 h-full overflow-y-auto cute-scrollbar"
  >
    <!-- 主容器 - 垂直排列 -->
    <div class="flex flex-col gap-3 sm:gap-4">
      <div
        ref="treeContainer"
        class="tree bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 cute-card"
      >
        <FileTable class="h-full" />
      </div>
    </div>
  </div>
</template>

<script>
import FileTable from '@/components/system/FileTable.vue'

export default {
  components: {
    FileTable,
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      statusHeight: 0,
      treeHeight: 0,
    }
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight
      this.$nextTick(() => {
        if (this.$refs.statusContainer) {
          this.statusHeight = this.$refs.statusContainer.clientHeight
        }
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
  position: relative;
  overflow: hidden;
}

.cute-card:hover {
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.15);
  border-color: rgba(236, 72, 153, 0.3);
}

/* 添加可爱装饰元素 */
.cute-card::before {
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23EC4899"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><circle cx="8.5" cy="10.5" r="1.5"/><circle cx="15.5" cy="10.5" r="1.5"/><path d="M12 16c-1.48 0-2.75-.81-3.45-2H6.88c.8 2.05 2.79 3.5 5.12 3.5s4.32-1.45 5.12-3.5h-1.67c-.7 1.19-1.97 2-3.45 2z"/></svg>');
  background-size: contain;
  opacity: 0.2;
  transform: rotate(15deg);
}

/* 可爱风格滚动条 */
.cute-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.cute-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(236, 72, 153, 0.5);
  border-radius: 4px;
  background-image: linear-gradient(to bottom, #ec4899, #a855f7);
}

.cute-scrollbar::-webkit-scrollbar-track {
  background-color: rgba(236, 72, 153, 0.1);
  border-radius: 4px;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .system-container {
    padding: 8px;
  }

  .cute-card {
    border-radius: 12px;
  }

  .cute-card::before {
    width: 30px;
    height: 30px;
  }
}

/* 动画效果 */
/* @keyframes cute-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes cute-sparkle {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
} */

.cute-card:hover {
  animation: cute-bounce 0.5s ease;
}

/* 添加悬浮时的星光效果 */
.cute-card:hover::after {
  content: '✦';
  position: absolute;
  color: #ec4899;
  font-size: 16px;
  animation: cute-sparkle 1s ease-out;
  pointer-events: none;
  top: 10px;
  left: 10px;
}
</style>
