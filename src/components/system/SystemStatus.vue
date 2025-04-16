<template>
  <div class="system-status">
    <div class="chart-item" :style="{ height: statusBorderHeight + 'px' }">
      <p class="title" :style="{ fontSize: fontSizeMana.statusTip + 'px' }">
        CPU
      </p>
      <div class="cpu">
        <div
          ref="cpuChart"
          class="base-chart"
          :style="{ height: computedChartHeight + 'px' }"
        ></div>
      </div>
    </div>
    <div class="chart-item" :style="{ height: statusBorderHeight + 'px' }">
      <p class="title" :style="{ fontSize: fontSizeMana.statusTip + 'px' }">
        MEMORY
      </p>
      <div class="memory">
        <div
          ref="memoryChart"
          class="base-chart"
          :style="{ height: computedChartHeight + 'px' }"
        ></div>
      </div>
    </div>
    <div class="chart-item" :style="{ height: statusBorderHeight + 'px' }">
      <p class="title" :style="{ fontSize: fontSizeMana.statusTip + 'px' }">
        DISK
      </p>
      <div class="disk">
        <div
          ref="diskChart"
          class="base-chart"
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
      fontSizeMana: { statusTip: 25 },
      windowHeight: window.innerHeight,
      statusBorderHeight: 0,
      chartHeight: 0,
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
          top: "20%", // 控制数据表距离画布顶部的距离
          bottom: "18%", // 控制数据表距离画布底部的距禿
          left: "15%", // 控制数据表距离画布左侧的距离
          right: "15%", // 控制数据表距离画布右侧的距离
        },
        // x 轴 类型与数据
        xAxis: {
          type: "category",
          data: [],
          name: "时间",
          axisLabel: {
            interval: 0, //强制显示所有标签
            rotate: 18,
            formatter: function (value) {
              return value.length > 8 ? value.slice(0, 8) + "..." : value
            },
          },
        },
        // y 轴 类型与数据
        yAxis: {
          type: "value",
          name: "百分比 %",
        },
        series: [
          {
            data: [],
            // 表示该系列使用折线图进行展示
            type: "line",
            // smooth: true 表示启用平滑曲线
            // smooth:true
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      statusObj: "getWsStatusObj",
    }),
    computedStatusBorderHeight() {
      if (!this.centerLogHeight) {
        this.handleResize()
      }
      return this.statusBorderHeight
    },
    computedChartHeight() {
      if (!this.chartHeight) {
        this.handleResize()
      }
      return this.chartHeight
    },
  },
  mounted() {
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
    initFontSize() {
      this.fontSizeMana.statusTip = getFontSize(20)
    },
    handleResize() {
      this.windowHeight = window.innerHeight
      this.statusBorderHeight = this.windowHeight / 3.5
      this.chartHeight = this.statusBorderHeight - 75
      this.initFontSize()
      this.$nextTick(() => {
        setTimeout(() => {
          this.cpuChart.resize()
          this.memoryChart.resize()
          this.diskChart.resize()
        }, 100)
      })
    },
    initSystemStatus() {
      this.cpuOpt = JSON.parse(JSON.stringify(this.chartOpt))
      this.cpuOpt.series[0].data = this.statusObj.cpuList
      this.cpuOpt.xAxis.data = this.statusObj.timeList
      this.memoryOpt = JSON.parse(JSON.stringify(this.chartOpt))
      this.memoryOpt.series[0].data = this.statusObj.memoryList
      this.memoryOpt.xAxis.data = this.statusObj.timeList
      this.diskOpt = JSON.parse(JSON.stringify(this.chartOpt))
      this.diskOpt.series[0].data = this.statusObj.diskList
      this.diskOpt.xAxis.data = this.statusObj.timeList
      
      // --- 为所有图表应用主题化 Start ---
      const applyThemeToOptions = (opt) => {
        try {
          const computedStyle = getComputedStyle(document.documentElement);
          const textColor = computedStyle.getPropertyValue('--el-text-color-regular').trim() || '#c0c4cc';
          const axisLineColor = computedStyle.getPropertyValue('--el-border-color-light').trim() || '#e0e6ed'; // 坐标轴线颜色
          const splitLineColor = computedStyle.getPropertyValue('--el-border-color-lighter').trim() || '#ebeef5'; // 分隔线颜色
          
          // X 轴
          opt.xAxis.axisLabel = opt.xAxis.axisLabel || {};
          opt.xAxis.axisLabel.color = textColor;
          opt.xAxis.nameTextStyle = opt.xAxis.nameTextStyle || {};
          opt.xAxis.nameTextStyle.color = textColor;
          opt.xAxis.axisLine = opt.xAxis.axisLine || {};
          opt.xAxis.axisLine.lineStyle = opt.xAxis.axisLine.lineStyle || {};
          opt.xAxis.axisLine.lineStyle.color = axisLineColor;

          // Y 轴
          opt.yAxis.axisLabel = opt.yAxis.axisLabel || {};
          opt.yAxis.axisLabel.color = textColor;
          opt.yAxis.nameTextStyle = opt.yAxis.nameTextStyle || {};
          opt.yAxis.nameTextStyle.color = textColor;
          opt.yAxis.axisLine = opt.yAxis.axisLine || {};
          opt.yAxis.axisLine.lineStyle = opt.yAxis.axisLine.lineStyle || {};
          opt.yAxis.axisLine.lineStyle.color = axisLineColor;
          opt.yAxis.splitLine = opt.yAxis.splitLine || {}; // 分隔线
          opt.yAxis.splitLine.lineStyle = opt.yAxis.splitLine.lineStyle || {};
          opt.yAxis.splitLine.lineStyle.color = splitLineColor;

          // 系列线条颜色（可选，如果需要根据主题变）
          if (opt.series && opt.series[0]) {
             // opt.series[0].lineStyle = { color: 'var(--el-color-primary)' }; // 示例：使用主色
             // opt.series[0].itemStyle = { color: 'var(--el-color-primary)' };
          }

        } catch (e) {
          console.error("Failed to apply theme to chart options:", e);
        }
        return opt;
      }

      this.cpuChart.setOption(applyThemeToOptions(this.cpuOpt))
      this.memoryChart.setOption(applyThemeToOptions(this.memoryOpt))
      this.diskChart.setOption(applyThemeToOptions(this.diskOpt))
      // --- 为所有图表应用主题化 End ---
    },
  },
  beforeDestroy() {
    // 在组件销毁前清除定时器
    clearInterval(this.timer)
  },
}
</script>

<style lang="scss" scoped>
.system-status {
  padding: 20px;
  display: flex;
  justify-content: space-between;

  .chart-item {
    background-color: var(--bg-color-secondary);
    border-radius: 10px;
    // padding: 20px;
    box-sizing: border-box;
    margin-top: 10px;
    width: calc(33% - 27px);
  }

  .title {
    color: var(--text-color-secondary);
    margin-left: 30px;
    margin-top: 30px;
    font-size: 20px;
  }
  .base-chart {
    height: 240px;
  }
}
</style>
