<template>
  <div class="system-status p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- CPU 卡片 -->
      <div
        class="chart-item bg-white rounded-xl shadow-md p-4 transition-all hover:shadow-lg anime-hover"
        :style="{ height: statusBorderHeight + 'px' }"
      >
        <div class="flex items-center mb-2">
          <div
            class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-2"
          >
            <svg-icon icon-class="cpu" class="text-pink-500 text-lg" />
          </div>
          <p class="title text-lg font-bold text-pink-600">CPU</p>
        </div>
        <div
          ref="cpuChart"
          class="base-chart w-full"
          :style="{ height: computedChartHeight + 'px' }"
        ></div>
      </div>

      <!-- 内存卡片 -->
      <div
        class="chart-item bg-white rounded-xl shadow-md p-4 transition-all hover:shadow-lg anime-hover"
        :style="{ height: statusBorderHeight + 'px' }"
      >
        <div class="flex items-center mb-2">
          <div
            class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2"
          >
            <svg-icon icon-class="memory" class="text-purple-500 text-lg" />
          </div>
          <p class="title text-lg font-bold text-purple-600">MEMORY</p>
        </div>
        <div
          ref="memoryChart"
          class="base-chart w-full"
          :style="{ height: computedChartHeight + 'px' }"
        ></div>
      </div>

      <!-- 磁盘卡片 -->
      <div
        class="chart-item bg-white rounded-xl shadow-md p-4 transition-all hover:shadow-lg anime-hover"
        :style="{ height: statusBorderHeight + 'px' }"
      >
        <div class="flex items-center mb-2">
          <div
            class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2"
          >
            <svg-icon icon-class="disk" class="text-blue-500 text-lg" />
          </div>
          <p class="title text-lg font-bold text-blue-600">DISK</p>
        </div>
        <div
          ref="diskChart"
          class="base-chart w-full"
          :style="{ height: computedChartHeight + 'px' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFontSize } from "@/utils/utils"
import { mapGetters } from "vuex"

export default {
  name: "SystemStatus",
  data() {
    return {
      windowHeight: window.innerHeight,
      statusBorderHeight: 300, // 默认高度
      chartHeight: 240, // 默认图表高度
      cpuChart: null,
      memoryChart: null,
      diskChart: null,
      statusWs: null,
      timer: null,
      cpuOpt: null,
      memoryOpt: null,
      diskOpt: null,
      chartOpt: {
        backgroundColor: "transparent",
        grid: {
          top: "20%",
          bottom: "18%",
          left: "15%",
          right: "15%",
        },
        xAxis: {
          type: "category",
          data: [],
          name: "时间",
          axisLabel: {
            interval: 0,
            rotate: 18,
            formatter: function (value) {
              return value.length > 8 ? value.slice(0, 8) + "..." : value
            },
          },
        },
        yAxis: {
          type: "value",
          name: "百分比 %",
        },
        series: [
          {
            data: [],
            type: "line",
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#ec4899", // 粉色线条
            },
            itemStyle: {
              color: "#ec4899", // 粉色点
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(236, 72, 153, 0.3)", // 粉色渐变
                  },
                  {
                    offset: 1,
                    color: "rgba(236, 72, 153, 0.1)",
                  },
                ],
              },
            },
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      statusObj: "getWsStatusObj",
    }),
    computedChartHeight() {
      return this.chartHeight
    },
  },
  mounted() {
    this.handleResize()
    window.addEventListener("resize", this.handleResize)

    this.cpuChart = this.$echarts.init(this.$refs.cpuChart)
    this.memoryChart = this.$echarts.init(this.$refs.memoryChart)
    this.diskChart = this.$echarts.init(this.$refs.diskChart)

    this.initSystemStatus()
    this.timer = setInterval(() => {
      this.initSystemStatus()
    }, 1000)
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight

      // 移动端调整为单列布局
      if (window.innerWidth < 768) {
        this.statusBorderHeight = this.windowHeight / 3
        this.chartHeight = this.statusBorderHeight - 80
      } else {
        this.statusBorderHeight = 300
        this.chartHeight = 240
      }

      this.$nextTick(() => {
        this.cpuChart?.resize()
        this.memoryChart?.resize()
        this.diskChart?.resize()
      })
    },
    initSystemStatus() {
      // 为每个图表设置不同颜色
      const colors = {
        cpu: "#ec4899", // 粉色
        memory: "#a855f7", // 紫色
        disk: "#3b82f6", // 蓝色
      }

      const createChartOptions = (type) => {
        const opt = JSON.parse(JSON.stringify(this.chartOpt))
        opt.series[0].data = this.statusObj[`${type}List`]
        opt.xAxis.data = this.statusObj.timeList

        // 设置不同颜色
        opt.series[0].lineStyle.color = colors[type]
        opt.series[0].itemStyle.color = colors[type]
        opt.series[0].areaStyle.color.colorStops[0].color = `rgba(${this.hexToRgb(
          colors[type]
        )}, 0.3)`
        opt.series[0].areaStyle.color.colorStops[1].color = `rgba(${this.hexToRgb(
          colors[type]
        )}, 0.1)`

        return opt
      }

      this.cpuChart.setOption(createChartOptions("cpu"))
      this.memoryChart.setOption(createChartOptions("memory"))
      this.diskChart.setOption(createChartOptions("disk"))
    },
    hexToRgb(hex) {
      // 转换十六进制颜色为RGB格式
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `${r}, ${g}, ${b}`
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style scoped>
/* 自定义滚动条（可选） */
.system-status::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.system-status::-webkit-scrollbar-thumb {
  @apply bg-pink-300 rounded-full;
}

.system-status::-webkit-scrollbar-track {
  @apply bg-pink-100 rounded-full;
}

/* 悬停动画 */
.anime-hover {
  transition: all 0.3s ease;
}

.anime-hover:hover {
  transform: translateY(-2px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .system-status {
    padding: 10px;
  }

  .chart-item {
    width: 100% !important;
    margin-bottom: 12px;
  }

  .title {
    font-size: 16px !important;
  }
}
</style>
