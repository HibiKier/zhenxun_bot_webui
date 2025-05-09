<template>
  <div class="main-container" style="overflow: hidden">
    <div
      class="main bg-gradient-to-br from-pink-50 to-purple-50 overflow-hidden"
    >
      <!-- 添加可爱的标题 -->
      <div class="flex items-center mb-4">
        <svg-icon icon-class="database" class="text-purple-500 text-3xl mr-2" />
        <h1 class="text-2xl md:text-3xl font-bold text-purple-600 cute-title">
          数据库管理
        </h1>
      </div>

      <el-row
        :gutter="16"
        class="flex flex-wrap"
        :style="{ height: computedHeight + 55 + 'px' }"
      >
        <!-- 左侧表格列表 - 宽度较小 -->
        <el-col :span="24" :md="6">
          <div
            class="card-container bg-white rounded-xl shadow-lg p-4 border-2 border-pink-200 h-full"
          >
            <table-list :style="{ height: computedHeight + 'px' }" />
          </div>
        </el-col>

        <!-- 右侧命令区域 - 占据更多空间 -->
        <el-col :span="24" :md="18">
          <div
            class="card-container bg-white rounded-xl shadow-lg p-4 border-2 border-blue-200"
          >
            <cmd-main :style="{ height: computedHeight + 22 + 'px' }" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getHeaderHeight } from "@/utils/utils"
import TableList from "@/components/database/TableList.vue"
import CmdMain from "@/components/database/CmdMain.vue"
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
      return this.windowHeight - getHeaderHeight() - 150
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

<style scoped>
.main-container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  overflow-y: auto;
  background-image: radial-gradient(
    circle at 10% 20%,
    rgba(255, 200, 239, 0.1) 0%,
    rgba(255, 255, 255, 0.9) 90%
  );
}

.cute-title {
  text-shadow: 2px 2px 4px rgba(236, 72, 153, 0.2);
  position: relative;
  display: inline-block;
}

.cute-title::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ec4899, #a855f7);
  border-radius: 3px;
}

/* 卡片容器样式 */
.card-container {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
}

/* 左侧卡片装饰线 */
.card-container:first-child::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #ec4899, #a855f7);
}

/* 右侧卡片装饰线 */
.card-container:last-child::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #60a5fa, #a855f7);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main {
    padding: 1rem;
    overflow-y: auto;
    height: 100vh;
  }

  .card-container {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .computedHeight {
    height: auto !important;
    min-height: 300px;
  }

  .el-row {
    height: auto !important;
  }

  .el-col {
    margin-bottom: 1rem;
  }
}
</style>
