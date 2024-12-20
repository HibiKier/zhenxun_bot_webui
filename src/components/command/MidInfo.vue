<template>
  <div class="mid-info" ref="midInfo">
    <div class="top-border" ref="topBorder">
      <div class="head">
        <p
          class="head-text"
          :style="{ fontSize: fontSizeMana.headText + 'px' }"
        >
          一位勇者的磨砺...
        </p>
        <p class="head-tip" :style="{ fontSize: fontSizeMana.headTip + 'px' }">
          挥剑吧，勇者...
        </p>
      </div>
    </div>
    <div class="ch-count-border" ref="chCountBorder">
      <div class="title-box">
        <p
          class="title-text"
          :style="{ fontSize: fontSizeMana.titleText + 'px' }"
        >
          消息接收
        </p>
        <span
          class="title-tip"
          :style="{ fontSize: fontSizeMana.titleTip + 'px' }"
          >勇者结识伙伴，收到的问候，口才+1</span
        >
      </div>
      <div class="ch-count">
        <el-row :gutter="10" style="margin-left: -25px">
          <el-col :span="5">
            <div class="circle-box">
              <el-progress
                color="#4cbeff"
                type="circle"
                :stroke-width="10"
                :percentage="getPercentageChat('num')"
                :width="progressWidth"
                :height="progressWidth"
                :format="
                  () => {
                    return String(chCnt.num)
                  }
                "
              >
              </el-progress>
              <p
                class="ch-count-text"
                :style="{ fontSize: fontSizeMana.countText + 'px' }"
              >
                总数
              </p>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="circle-box">
              <el-progress
                color="#5c87ff"
                type="circle"
                :stroke-width="10"
                :percentage="getPercentageChat('day')"
                :width="progressWidth"
                :height="progressWidth"
                :format="
                  () => {
                    return String(chCnt.day)
                  }
                "
              >
              </el-progress>
              <p
                class="ch-count-text"
                :style="{ fontSize: fontSizeMana.countText + 'px' }"
              >
                一日内
              </p>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="circle-box">
              <el-progress
                color="#af5eff"
                type="circle"
                :stroke-width="10"
                :percentage="getPercentageChat('week')"
                :width="progressWidth"
                :height="progressWidth"
                :format="
                  () => {
                    return String(chCnt.week)
                  }
                "
              >
              </el-progress>
              <p
                class="ch-count-text"
                :style="{ fontSize: fontSizeMana.countText + 'px' }"
              >
                一周内
              </p>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="circle-box">
              <el-progress
                color="#53ca74"
                type="circle"
                :stroke-width="10"
                :percentage="getPercentageChat('month')"
                :width="progressWidth"
                :height="progressWidth"
                :format="
                  () => {
                    return String(chCnt.month)
                  }
                "
              >
              </el-progress>
              <p
                class="ch-count-text"
                :style="{ fontSize: fontSizeMana.countText + 'px' }"
              >
                一月内
              </p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="circle-box">
              <el-progress
                color="#f97d6e"
                type="circle"
                :stroke-width="10"
                :percentage="getPercentageChat('year')"
                :width="progressWidth"
                :height="progressWidth"
                :format="
                  () => {
                    return String(chCnt.year)
                  }
                "
              >
              </el-progress>
              <p
                class="ch-count-text"
                :style="{ fontSize: fontSizeMana.countText + 'px' }"
              >
                一年内
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="ch-count-border" ref="countBorder">
      <div class="title-box">
        <p
          class="title-text"
          :style="{ fontSize: fontSizeMana.titleText + 'px' }"
        >
          功能调用
        </p>
        <span
          class="title-tip"
          :style="{ fontSize: fontSizeMana.titleTip + 'px' }"
          >勇者磨砺自身，辛勤的汗水，力量+1</span
        >
      </div>
      <div class="ch-count">
        <el-row :gutter="10" style="margin-left: -25px">
          <el-col :span="5">
            <div class="circle-box">
              <el-progress
                color="#4cbeff"
                type="circle"
                :stroke-width="10"
                :percentage="getPercentageCall('num')"
                :width="progressWidth"
                :height="progressWidth"
                :format="
                  () => {
                    return String(callCnt.num)
                  }
                "
              >
              </el-progress>
              <p
                class="ch-count-text"
                :style="{ fontSize: fontSizeMana.countText + 'px' }"
              >
                总数
              </p>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="circle-box">
              <el-progress
                color="#5c87ff"
                type="circle"
                :stroke-width="10"
                :percentage="getPercentageCall('day')"
                :width="progressWidth"
                :height="progressWidth"
                :format="
                  () => {
                    return String(callCnt.day)
                  }
                "
              >
              </el-progress>
              <p
                class="ch-count-text"
                :style="{ fontSize: fontSizeMana.countText + 'px' }"
              >
                一日内
              </p>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="circle-box">
              <el-progress
                color="#af5eff"
                type="circle"
                :stroke-width="10"
                :percentage="getPercentageCall('week')"
                :width="progressWidth"
                :height="progressWidth"
                :format="
                  () => {
                    return String(callCnt.week)
                  }
                "
              >
              </el-progress>
              <p
                class="ch-count-text"
                :style="{ fontSize: fontSizeMana.countText + 'px' }"
              >
                一周内
              </p>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="circle-box">
              <el-progress
                color="#53ca74"
                type="circle"
                :stroke-width="10"
                :percentage="getPercentageCall('month')"
                :width="progressWidth"
                :height="progressWidth"
                :format="
                  () => {
                    return String(callCnt.month)
                  }
                "
              >
              </el-progress>
              <p
                class="ch-count-text"
                :style="{ fontSize: fontSizeMana.countText + 'px' }"
              >
                一月内
              </p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="circle-box">
              <el-progress
                color="#f97d6e"
                type="circle"
                :stroke-width="10"
                :percentage="getPercentageCall('year')"
                :width="progressWidth"
                :height="progressWidth"
                :format="
                  () => {
                    return String(callCnt.year)
                  }
                "
              >
              </el-progress>
              <p
                class="ch-count-text"
                :style="{ fontSize: fontSizeMana.countText + 'px' }"
              >
                一年内
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="chart-border" :style="{ height: chartBorderHeight + 'px' }">
      <div
        ref="chart"
        class="chart"
        :style="{ height: computedChartHeight + 'px' }"
      ></div>
    </div>
  </div>
</template>

<script>
import { default as AnsiUp } from "ansi_up"
import { getFontSize } from "@/utils/utils"
export default {
  name: "MidInfo",
  data() {
    return {
      fontSizeMana: {
        headText: 27,
        headTip: 12,
        titleText: 17,
        titleTip: 12,
        countText: 18,
      },
      chartHeight: 308,
      chartBorderHeight: 310,
      progressWidth: 167,
      botInfo: null,
      chCnt: { num: 0, day: 0, week: 0, month: 0, year: 0 },
      callCnt: { num: 0, day: 0, week: 0, month: 0, year: 0 },
      ansi_up: null,
      clgDiv: null,
      chatCntInterval: null, //聊天数量定时器
      callInterval: null,
      chart: null,
      chatAndCallMonth: {},
      chartOpt: {
        title: {
          text: "消息/调用统计",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["消息统计", "调用统计"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
        },
        yAxis: [
          {
            type: "value",
            name: "消息统计",
          },
          {
            type: "value",
            name: "调用统计",
            position: "right",
          },
        ],
        series: [
          {
            name: "消息统计",
            type: "line",
            // stack: "Total",
            data: [],
            yAxisIndex: 0,
          },
          {
            name: "调用统计",
            type: "line",
            // stack: "Total",
            data: [],
            yAxisIndex: 1,
          },
        ],
      },
    }
  },
  computed: {
    computedChartBorderHeight() {
      if (!this.chartBorderHeight) {
        this.handleResize()
      }
      return this.chartBorderHeight
    },
    computedChartHeight() {
      if (!this.chartHeight) {
        this.handleResize()
      }
      return this.chartHeight
    },
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.clgDiv = document.getElementById("clg")
    this.ansi_up = new AnsiUp()
    this.getChCount(this.botInfo.self_id)
    this.getCallCount(this.botInfo.self_id)
    this.getMonthChatAndCallCount(this.botInfo.self_id)
    this.chatCntInterval = setInterval(() => {
      this.getChCount(this.botInfo.self_id, true)
    }, 30000)
    this.chart = this.$echarts.init(this.$refs.chart)
    this.callInterval = setInterval(() => {
      this.getCallCount(this.botInfo.self_id, true)
    }, 30000)
    this.chart = this.$echarts.init(this.$refs.chart)
    this.handleResize()
  },
  beforeDestroy() {
    if (this.chatCntInterval) {
      clearInterval(this.chatCntInterval)
    }
    if (this.callInterval) {
      clearInterval(this.callInterval)
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
  },
  methods: {
    handleResize() {
      this.initFontSize()
      const width = this.$refs.countBorder.offsetWidth - 200
      this.progressWidth = width / 5

      this.chartBorderHeight =
        this.$refs.midInfo.offsetHeight -
        this.$refs.topBorder.offsetHeight -
        this.$refs.chCountBorder.offsetHeight -
        this.$refs.countBorder.offsetHeight -
        30
      if (this.chartBorderHeight < 310) {
        this.chartBorderHeight = 310
      }
      this.chartHeight = this.chartBorderHeight - 80

      this.chart.resize()
    },
    initFontSize() {
      this.fontSizeMana.headText = getFontSize(27)
      this.fontSizeMana.headTip = getFontSize(12)
      this.fontSizeMana.titleText = getFontSize(19)
      this.fontSizeMana.titleTip = getFontSize(12)
      this.fontSizeMana.countText = getFontSize(18)
    },
    getPercentageChat(type) {
      if (this.chCnt.num == 0) {
        return 0
      }
      if (type == "num") {
        return 100
      }
      if (this.chCnt[type] == this.chCnt.num) {
        return 100
      }
      return (this.chCnt[type] / this.chCnt.num) * 100
    },
    getPercentageCall(type) {
      if (this.callCnt.num == 0) {
        return 0
      }
      if (type == "num") {
        return 100
      }
      if (this.callCnt[type] == this.callCnt.num) {
        return 100
      }
      return (this.callCnt[type] / this.callCnt.num) * 100
    },
    formatProcess() {
      return this.chCnt.num
    },
    getMonthChatAndCallCount(bot_id) {
      var loading = this.getLoading(".chart")
      this.getRequest(
        `${this.$root.prefix}/dashboard/get_chat_and_call_month`,
        { bot_id: bot_id }
      ).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.chatAndCallMonth = resp.data
            const chartOpt = JSON.parse(JSON.stringify(this.chartOpt))
            chartOpt.xAxis.data = this.chatAndCallMonth.date
            chartOpt.series[0].data = this.chatAndCallMonth.chat
            chartOpt.series[1].data = this.chatAndCallMonth.call
            this.chart.setOption(chartOpt)
            this.chart.resize()
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    getChCount(bot_id, no_loading) {
      // 获取聊天历史记录数量
      if (bot_id) {
        if (!no_loading) {
          var loading = this.getLoading(".ch-count")
        }

        this.getRequest(`${this.$root.prefix}/main/get_all_chat_count`, {
          bot_id,
        }).then((resp) => {
          if (resp.suc) {
            if (resp.warning) {
              if (loading) {
                this.$message.warning(resp.warning)
              }
            } else {
              if (loading) {
                this.$message.success(resp.info)
              }
              this.chCnt = resp.data
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
      }
    },
    getCallCount(bot_id, no_loading) {
      // 获取聊天历史记录数量
      if (bot_id) {
        if (!no_loading) {
          var loading = this.getLoading(".ch-count")
        }

        this.getRequest(`${this.$root.prefix}/main/get_all_call_count`, {
          bot_id,
        }).then((resp) => {
          if (resp.suc) {
            if (resp.warning) {
              if (loading) {
                this.$message.warning(resp.warning)
              }
            } else {
              if (loading) {
                this.$message.success(resp.info)
              }
              this.callCnt = resp.data
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
      }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-divider--horizontal {
  margin: 74px 0;
}

.mid-info {
  overflow-y: auto;

  .head {
    .head-text {
      font-size: 27px;
      font-weight: bold;
    }

    .head-tip {
      color: #b8bac0;
      font-size: 12px;
      margin-top: 13px;
    }
  }

  .top-border {
    background-color: white;
    padding: 10px 30px;
    border-radius: 10px;
    box-sizing: border-box;
  }
  .ch-count-border {
    border-radius: 10px;
    background-color: white;
    padding: 30px;
    margin-top: 20px;
    overflow: auto;
    box-sizing: border-box;
  }

  .ch-count {
    .circle-box {
      position: relative;
      text-align: center;
    }

    .ch-count-text {
      font-size: 18px;
      margin-top: 10px;
    }

    ::v-deep .el-progress__text {
      font-size: 40px !important;
      font-weight: bold;
    }
  }

  .title-box {
    margin-top: 5px;
    margin-bottom: 30px;
    display: flex;

    .title-text {
      font-size: 17px;
    }
    .title-tip {
      color: #acafb8;
      font-size: 12px;
      margin-top: 6px;
      margin-left: 25px;
    }
  }

  .chart-border {
    border-radius: 10px;
    background-color: white;
    padding: 30px 30px 0 30px;
    margin-top: 20px;
    height: 308px;
    box-sizing: border-box;
  }
  .chart {
    height: 308px;
    width: 100%;
  }
}
</style>
