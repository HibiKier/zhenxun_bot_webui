<template>
  <div class="system-status">
    <div class="chart-item">
      <p class="title">CPU</p>
      <div class="cpu">
        <div ref="cpuChart" class="base-chart"></div>
      </div>
    </div>
    <div class="chart-item">
      <p class="title">MEMORY</p>
      <div class="memory">
        <div ref="memoryChart" class="base-chart"></div>
      </div>
    </div>

    <div class="chart-item">
      <p class="title">DISK</p>
      <div class="disk">
        <div ref="diskChart" class="base-chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  name: "SystemStatus",
  data() {
    return {
      cpuChart: null,
      memoryChart: null,
      diskChart: null,
      statusWs: null,
      timer: null,
      cpuOpt: null,
      memoryOpt: null,
      diskOpt: null,
      chartOpt: {
        backgroundColor: "#fff",
        // x 轴 类型与数据
        xAxis: {
          type: "category",
          data: [],
          name: "时间",
          axisLabel: {
            interval: 0, //强制显示所有标签
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
  },
  mounted() {
    this.cpuChart = this.$echarts.init(this.$refs.cpuChart)
    this.memoryChart = this.$echarts.init(this.$refs.memoryChart)
    this.diskChart = this.$echarts.init(this.$refs.diskChart)
    this.initSystemStatus()
    window.onresize = function () {
      this.cpuChart.resize()
      this.memoryChart.resize()
      this.diskChart.resize()
    }
    this.timer = setInterval(() => {
      this.initSystemStatus()
    }, 1000)
  },
  methods: {
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
      this.cpuChart.setOption(this.cpuOpt)
      this.memoryChart.setOption(this.memoryOpt)
      this.diskChart.setOption(this.diskOpt)
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
  // width: 100%;
  justify-content: space-between;

  .chart-item {
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
    width: calc(33% - 27px);
  }

  .title {
    color: #939395;
    margin-left: 30px;
    margin-top: 30px;
    font-size: 20px;
  }
  .base-chart {
    // width: calc(24% - 27px);
    // width: 500px;
    height: 240px;
  }
}
</style>
