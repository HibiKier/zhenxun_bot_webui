<template>
  <div class="main-container" :class="{ 'mobile-container': isMobile }">
    <div
      class="main"
      :class="{ 'mobile-main': isMobile }"
      :style="{
        background: 'var(--el-bg-color)',
        minHeight: '100%',
        padding: '1rem',
      }"
    >
      <!-- 添加可爱的标题 -->
      <div class="flex items-center mb-4">
        <svg-icon
          icon-class="database"
          class="text-3xl mr-2"
          :style="{ color: 'var(--el-color-primary)' }"
        />
        <h1
          class="text-2xl md:text-3xl font-bold cute-title"
          :style="{ color: 'var(--el-color-primary)' }"
        >
          数据库管理
        </h1>
      </div>

      <el-row
        :gutter="16"
        class="flex flex-wrap"
        :style="!isMobile ? { height: computedHeight + 55 + 'px' } : {}"
      >
        <!-- 左侧表格列表 - 宽度较小 -->
        <el-col :span="24" :md="6">
          <div
            class="card-container rounded-xl p-4"
            :class="{ 'mobile-card': isMobile }"
            :style="{
              background: 'var(--el-bg-color-overlay)',
              boxShadow: 'var(--el-box-shadow-light)',
              border: '2px solid var(--el-color-primary-light-7)',
            }"
          >
            <table-list
              :style="{ height: isMobile ? 'auto' : computedHeight + 'px' }"
            />
          </div>
        </el-col>

        <!-- 右侧命令区域 - 占据更多空间 -->
        <el-col :span="24" :md="18">
          <div
            class="card-container rounded-xl p-4"
            :class="{ 'mobile-card': isMobile }"
            :style="{
              background: 'var(--el-bg-color-overlay)',
              boxShadow: 'var(--el-box-shadow-light)',
              border: '2px solid var(--el-color-primary-light-7)',
            }"
          >
            <cmd-main
              :style="{
                height: isMobile ? 'auto' : computedHeight + 'px',
              }"
            />
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
      isMobile: this.$isMobile(),
    }
  },
  computed: {
    computedHeight() {
      return this.windowHeight - getHeaderHeight() - 135
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.handleResize()
      window.addEventListener("resize", this.handleResize)
    })
  },
  activated() {
    if (this.isMobile) {
      this.$nextTick(() => {
        document.body.style.overflow = "auto"
        document.documentElement.style.overflow = "auto"
      })
    }
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight
      this.isMobile = window.innerWidth <= 768
      if (this.isMobile) {
        document.body.style.overflow = "auto"
        document.documentElement.style.overflow = "auto"
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style scoped>
.main-container {
  height: 100%;
  width: 100%;
  position: relative;
}

.cute-title {
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
  background: var(--el-color-primary);
  border-radius: 3px;
  opacity: 0.7;
}

/* 卡片容器样式 */
.card-container {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card-container:hover {
  transform: translateY(-2px);
}

/* 左侧卡片装饰线 */
.card-container:first-child::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: var(--el-color-primary);
  opacity: 0.8;
}

/* 右侧卡片装饰线 */
.card-container:last-child::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: var(--el-color-primary);
  opacity: 0.8;
}

/* 移动端特定样式 */
.mobile-container {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-main {
  height: auto;
  min-height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-card {
  height: auto !important;
  min-height: 300px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main {
    padding: 1rem;
  }

  .card-container {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .el-row {
    height: auto !important;
  }

  .el-col {
    margin-bottom: 1rem;
  }
}
</style>
