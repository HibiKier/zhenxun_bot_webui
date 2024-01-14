<template>
  <div class="system-status">
    <div class="chart-item">
      <p class="title">CPU</p>
      <el-divider />
      <div class="cpu">
        <div ref="cpuChart" class="base-chart"></div>
      </div>
    </div>
    <div class="chart-item">
      <p class="title">MEMORY</p>
      <el-divider />
      <div class="memory">
        <div ref="memoryChart" class="base-chart"></div>
      </div>
    </div>

    <div class="chart-item">
      <p class="title">DISK</p>
      <el-divider />
      <div class="disk">
        <div ref="diskChart" class="base-chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SystemStatus",
  data() {
    return {
      cpuChart: null,
      memoryChart: null,
      diskChart: null,
      statusWs: null,
      timeList: [],
      cpuList: [],
      memoryList: [],
      diskList: [],
      cpuOpt: null,
      memoryOpt: null,
      diskOpt: null,
      chartOpt: {
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
  mounted() {
    const host = location.host.split(":")[0] || ""
    this.STATUS_WS_URL = `ws://${host}:8080/zhenxun/socket/system_status` // 系统状态ws
    this.cpuChart = this.$echarts.init(this.$refs.cpuChart)
    this.memoryChart = this.$echarts.init(this.$refs.memoryChart)
    this.diskChart = this.$echarts.init(this.$refs.diskChart)
    this.initSystemStatusWebSocket()
    this.initSystemStatus()
  },
  methods: {
    initSystemStatus() {
      this.cpuOpt = JSON.parse(JSON.stringify(this.chartOpt))
      // cpuOpt.xAxis.data = []
      this.cpuOpt.series[0].data = this.cpuList
      this.cpuOpt.xAxis.data = this.timeList
      this.memoryOpt = JSON.parse(JSON.stringify(this.chartOpt))
      this.memoryOpt.series[0].data = this.memoryList
      this.memoryOpt.xAxis.data = this.timeList
      this.diskOpt = JSON.parse(JSON.stringify(this.chartOpt))
      this.diskOpt.series[0].data = this.diskList
      this.diskOpt.xAxis.data = this.timeList
    },
    initSystemStatusWebSocket() {
      if (!this.statusWs) {
        this.statusWs = new WebSocket(this.STATUS_WS_URL + "?sleep=3")
        this.statusWs.onopen = () => {
          console.log("系统状态 WebSocket 已连接...")
        }
        this.statusWs.onmessage = this.statusWsOnmessage
        this.statusWs.onclose = () => {
          this.$message.warning("系统状态 WebSocket 已断开...")
        }
      }
    },
    statusWsOnmessage(event) {
      const data = JSON.parse(event.data)
      this.timeList.push(data.check_time.split("T")[1])
      this.cpuList.push(data.cpu)
      this.memoryList.push(data.memory)
      this.diskList.push(data.disk)
      if (this.timeList.length > 10) {
        this.timeList.splice(0, 1)
        this.cpuList.splice(0, 1)
        this.memoryList.splice(0, 1)
        this.diskList.splice(0, 1)
      }

      this.cpuChart.setOption(this.cpuOpt)
      this.memoryChart.setOption(this.memoryOpt)
      this.diskChart.setOption(this.diskOpt)
    },
  },
}
</script>

<style lang="scss" scoped>
.system-status {
  padding: 20px;
  .chart-item {
    background-color: #f6f9fe;
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
  }

  .title {
    color: #939395;
    margin-left: 30px;
    margin-top: 30px;
    font-size: 20px;
  }
  .base-chart {
    width: 100%;
    height: 240px;
  }
}
</style>
