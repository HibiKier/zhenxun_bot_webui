<template>
  <div class="right-info" ref="rightInfo">
    <div class="base-info" ref="baseInfo">
      <p
        class="base-title"
        :style="{ fontSize: fontSizeMana.titleText + 'px' }"
      >
        基础信息
      </p>
      <div class="base-border">
        <div class="base-info-box">
          <div class="base-info-box-item">
            <p
              class="base-info-item-text"
              :style="{ fontSize: fontSizeMana.botConfig + 'px' }"
            >
              {{ botInfo.connect_count }}
            </p>
            <p
              class="base-small-title"
              :style="{ fontSize: fontSizeMana.botConfigTip + 'px' }"
            >
              累计登录
            </p>
          </div>
          <el-divider direction="vertical" />
          <div class="base-info-box-item">
            <p
              class="base-info-item-text"
              :style="{ fontSize: fontSizeMana.botConfig + 'px' }"
            >
              {{ botInfo.connectTime }}
            </p>
            <p
              class="base-small-title"
              :style="{ fontSize: fontSizeMana.botConfigTip + 'px' }"
            >
              连接时长
            </p>
          </div>
        </div>
        <el-divider />
        <div class="base-info-box" style="margin-top: 18px">
          <div class="base-info-box-item" style="width: 100%">
            <p
              class="base-info-item-text"
              :style="{ fontSize: fontSizeMana.botConfig + 'px' }"
            >
              {{ botInfo.connect_date }}
            </p>
            <p
              class="base-small-title"
              :style="{ fontSize: fontSizeMana.botConfigTip + 'px' }"
            >
              连接日期
            </p>
          </div>
        </div>
      </div>
    </div>
    <div :style="{ height: computedChartBorderHeight + 'px' }">
      <div
        class="base-border"
        :style="{
          marginTop: '18px',
          fontSize: fontSizeMana.chartTip + 'px',
          height: chartDivHeight + 'px',
        }"
      >
        <div class="active-group">
          <div style="height: 40px">
            <p
              class="base-title"
              :style="{
                fontSize: fontSizeMana.titleText + 'px',
                marginTop: '5px',
                float: 'left',
              }"
            >
              活跃群聊
            </p>
            <div class="btn-group">
              <el-button
                type="text"
                :class="{ 'select-query-type': selectGroupType == 'all' }"
                @click="clickGroupType('all')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >ALL</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectGroupType == 'day' }"
                @click="clickGroupType('day')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >DAY</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectGroupType == 'week' }"
                @click="clickGroupType('week')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >WEEK</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectGroupType == 'month' }"
                @click="clickGroupType('month')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >MONTH</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectGroupType == 'year' }"
                @click="clickGroupType('year')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >YEAR</el-button
              >
            </div>
          </div>
          <div class="group-chart">
            <div
              ref="groupChart"
              class="base-chart"
              :style="{ height: computedChartHeight + 'px' }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="base-border"
        :style="{
          marginTop: '18px',
          fontSize: fontSizeMana.chartTip + 'px',
          height: chartDivHeight + 'px',
        }"
      >
        <div class="hot-plugin">
          <div style="height: 40px">
            <p
              class="base-title"
              :style="{
                fontSize: fontSizeMana.titleText + 'px',
                marginTop: '5px',
                float: 'left',
              }"
            >
              热门插件
            </p>
            <div class="btn-group">
              <el-button
                type="text"
                :class="{ 'select-query-type': selectHotPluginType == 'all' }"
                @click="clickHotPluginType('all')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >ALL</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectHotPluginType == 'day' }"
                @click="clickHotPluginType('day')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >DAY</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectHotPluginType == 'week' }"
                @click="clickHotPluginType('week')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >WEEK</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectHotPluginType == 'month' }"
                @click="clickHotPluginType('month')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >MONTH</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectHotPluginType == 'year' }"
                @click="clickHotPluginType('year')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >YEAR</el-button
              >
            </div>
          </div>
          <div>
            <div
              ref="hotPluginChart"
              class="base-chart"
              :style="{ height: computedChartHeight + 'px' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFontSize, getConvertSize } from "@/utils/utils"
export default {
  name: "RightInfo",
  data() {
    return {
      fontSizeMana: {
        botConfig: 25,
        botConfigTip: 13,
        titleText: 20,
        chartTip: 15,
      },
      chartHeight: 0,
      chartDivHeight: 0,
      chartBorderHeight: 0,
      tableData: [
        { date: "2025/10/3", ip: "0.0.0.0", time: "11:45:14" },
        { date: "2025/10/2", ip: "127.0.0.1", time: "11:45:14" },
      ],
      botInfo: null,
      botConfig: {},
      selectGroupType: "all",
      selectHotPluginType: "all",
      groupChart: null,
      hotPluginChart: null,
      groupCntInterval: null, //活跃数量定时器
      chartOpt: {
        grid: {
          top: "10%", // 控制数据表距离画布顶部的距离
          bottom: "20%", // 控制数据表距离画布底部的距禿
          left: "15%", // 控制数据表距离画布左侧的距离
          right: "15%", // 控制数据表距离画布右侧的距离
        },
        tooltip: {}, // 工具提示组件
        xAxis: {
          type: "category",
          name: "",
          data: null,
          axisLabel: {
            interval: 0, //强制显示所有标签
            rotate: 10,
          },
        }, // X轴
        yAxis: { type: "value" }, // Y轴
        series: [
          {
            type: "bar", // 柱状图系列
            barWidth: "40%", // 柱子宽度
            label: { show: true }, // 标签展示
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: (params) => {
                  var colorList = [
                    "#855BD7",
                    "#4B6FB8",
                    "#0F6E43",
                    "#B69C2B",
                    "#2588BB",
                    "#BB612D",
                    "#1D9394",
                    "#C24545",
                  ]
                  return colorList[params.dataIndex]
                },
              },
            },
            emphasis: { focus: "series" }, // 高亮效果
            data: null, // 数据源
          },
        ],
      },
    }
  },
  computed: {
    computedChartHeight() {
      if (!this.chartHeight) {
        this.handleResize()
      }
      return this.chartHeight
    },
    computedChartDivHeight() {
      if (!this.chartDivHeight) {
        this.handleResize()
      }
      return this.chartDivHeight
    },
    computedChartBorderHeight() {
      if (!this.chartBorderHeight) {
        this.handleResize()
      }
      return this.chartBorderHeight
    },
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
    if (this.botInfo) {
      this.botConfig = this.botInfo.config || {}
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.handleResize()
    if (this.botInfo) {
      if (this.botInfo.connect_time) {
        this.botInfo.connectTime = "00:00"
        this.conTime = new Date().getTime() / 1000
        if (!this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setInterval(() => {
          const time = Math.floor(new Date().getTime() / 1000)
          this.botInfo.connectTime = this.formateSeconds(
            time - this.botInfo.connect_time
          )
          this.$forceUpdate()
        }, 1000)
      }
    }
    this.groupChart = this.$echarts.init(this.$refs.groupChart)
    this.hotPluginChart = this.$echarts.init(this.$refs.hotPluginChart)
    this.getActiveGroupData()
    this.getHotPlugin()
    this.groupCntInterval = setInterval(() => {
      this.getActiveGroupData(this.selectGroupType, true)
    }, 25000)
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
    if (this.groupCntInterval) {
      clearInterval(this.groupCntInterval)
    }
  },
  methods: {
    handleResize() {
      this.initFontSize()
      this.$nextTick(() => {
        setTimeout(() => {
          this.chartBorderHeight =
            this.$refs.rightInfo.offsetHeight -
            this.$refs.baseInfo.offsetHeight -
            18
          this.chartDivHeight = (this.chartBorderHeight - 16) / 2
          this.chartHeight = this.chartDivHeight - 82
          this.groupChart.resize()
          this.hotPluginChart.resize()
        }, 500)
      })
    },
    initFontSize() {
      this.fontSizeMana.botConfig = getFontSize(26, 29)
      this.fontSizeMana.botConfigTip = getFontSize(13, 16)
      this.fontSizeMana.titleText = getFontSize(15, 18)
      this.fontSizeMana.chartTip = getFontSize(12, 15)
    },
    clickGroupType(type) {
      this.selectGroupType = type
      this.getActiveGroupData(type)
    },
    getActiveGroupData(date_type, no_loading) {
      if (date_type == "all") {
        date_type = null
      }
      if (!no_loading) {
        var loading = this.getLoading(".active-group")
      }

      this.getRequest(`${this.$root.prefix}/main/get_active_group`, {
        date_type: date_type,
        bot_id: this.botInfo.self_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            if (loading) {
              this.$message.warning(resp.info)
            }
          } else {
            if (loading) {
              this.$message.success(resp.info)
            }
            const tmpOpt = JSON.parse(JSON.stringify(this.chartOpt))
            const group_list = []
            const data = resp.data.map((e) => {
              group_list.push(e.name)
              return {
                name: e.group_id,
                value: e.chat_num,
              }
            })
            tmpOpt.xAxis.name = "群聊"
            tmpOpt.xAxis.data = group_list
            tmpOpt.series[0].data = data
            this.groupChart.setOption(tmpOpt)
          }
        } else {
          if (loading) {
            this.$message.error(resp.info)
          }
        }
        if (loading) {
          loading.close()
        }
      })
    },
    clickHotPluginType(type) {
      this.selectHotPluginType = type
      if (type == "all") {
        type = null
      }
      this.getHotPlugin(type)
    },
    getHotPlugin(date_type) {
      const loading = this.getLoading(".hot-plugin")
      this.getRequest(`${this.$root.prefix}/main/get_hot_plugin`, {
        date_type: date_type,
        bot_id: this.botInfo.self_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.info)
          } else {
            this.$message.success(resp.info)
            const tmpOpt = JSON.parse(JSON.stringify(this.chartOpt))
            const hotPluginList = []
            const data = resp.data.map((e) => {
              hotPluginList.push(e.name)
              return {
                name: e.name,
                value: e.count,
              }
            })
            tmpOpt.xAxis.name = "插件"
            tmpOpt.xAxis.data = hotPluginList
            tmpOpt.series[0].data = data
            this.hotPluginChart.setOption(tmpOpt)
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    formateSeconds(endTime) {
      let secondTime = parseInt(endTime) //将传入的秒的值转化为Number
      let min = 0 // 初始化分
      let h = 0 // 初始化小时
      let result = ""
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60) //获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60) //获取秒数，秒数取佘，得到整数秒数
        if (min > 60) {
          //如果分钟大于60，将分钟转换成小时
          h = parseInt(min / 60) //获取小时，获取分钟除以60，得到整数小时
          min = parseInt(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
        }
      }
      result = `${h.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}:${secondTime.toString().padStart(2, "0")}`
      return result
    },
  },
}
</script>

<style lang="scss" scoped>
.right-info {
  padding: 0 20px;
  box-sizing: border-box;

  .base-border {
    border-radius: 10px;
    padding: 20px;
    background-color: white;
    box-sizing: border-box;
  }
  ::v-deep .el-divider--horizontal {
    margin: 10px 0;
  }

  .config-small-title {
    color: #afb2b9;
    font-size: 13px;
  }

  .btn-group {
    float: right;
  }

  .base-title {
    color: #939395;
  }
  .base-chart {
    width: 100%;
    height: 298px;
  }

  .active-group {
    // display: flex;

    .el-button {
      color: #a3a6af;
    }
  }
  .select-query-type {
    font-weight: bold;
    color: #262729;
  }
  .hot-plugin {
    .el-button {
      color: #a3a6af;
    }
  }

  .base-info {
    box-sizing: border-box;
    border-radius: 10px;
    background-color: white;
    padding: 20px;

    .base-border {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    ::v-deep .el-divider--horizontal {
      margin: 0;
    }

    .base-info-box {
      display: flex;

      ::v-deep .el-divider--vertical {
        margin: 0;
        height: 73px;
      }

      .base-info-box-item {
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        width: 150px;

        .base-small-title {
          color: #aaacb3;
        }

        .base-info-item-text {
          font-size: 25px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
