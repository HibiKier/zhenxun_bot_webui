<template>
  <div class="mid-info">
    <div class="top-border">
      <div class="head">
        <p class="head-text">一位勇者的磨砺...</p>
        <p class="head-tip">挥剑吧...</p>
      </div>
    </div>
    <div class="ch-count-border">
      <div class="title-box">
        <p class="title-text">消息接收</p>
        <span class="title-tip">勇者结识伙伴，收到的问候，口才+1</span>
      </div>
      <div class="ch-count">
        <div class="circle-box">
          <el-progress
            color="#4cbeff"
            type="circle"
            :stroke-width="10"
            :percentage="getPercentage('num')"
            :width="167"
            :height="167"
            :format="
              () => {
                return String(chCnt.num)
              }
            "
          >
          </el-progress>
          <p class="ch-count-text">总数</p>
        </div>
        <div class="circle-box">
          <el-progress
            color="#5c87ff"
            type="circle"
            :stroke-width="10"
            :percentage="getPercentage('day')"
            :width="167"
            :height="167"
            :format="
              () => {
                return String(chCnt.day)
              }
            "
          >
          </el-progress>
          <p class="ch-count-text">一日内</p>
        </div>
        <div class="circle-box">
          <el-progress
            color="#af5eff"
            type="circle"
            :stroke-width="10"
            :percentage="getPercentage('week')"
            :width="167"
            :height="167"
            :format="
              () => {
                return String(chCnt.week)
              }
            "
          >
          </el-progress>
          <p class="ch-count-text">一周内</p>
        </div>
        <div class="circle-box">
          <el-progress
            color="#53ca74"
            type="circle"
            :stroke-width="10"
            :percentage="getPercentage('month')"
            :width="167"
            :height="167"
            :format="
              () => {
                return String(chCnt.month)
              }
            "
          >
          </el-progress>
          <p class="ch-count-text">一月内</p>
        </div>
        <div class="circle-box">
          <el-progress
            color="#f97d6e"
            type="circle"
            :stroke-width="10"
            :percentage="getPercentage('year')"
            :width="167"
            :height="167"
            :format="
              () => {
                return String(chCnt.year)
              }
            "
          >
          </el-progress>
          <p class="ch-count-text">一年内</p>
        </div>
      </div>
    </div>
    <div class="ch-count-border">
      <div class="title-box">
        <p class="title-text">功能调用</p>
        <span class="title-tip">勇者磨砺自身，辛勤的汗水，力量+1</span>
      </div>
      <div class="ch-count">
        <div class="circle-box">
          <el-progress
            color="#4cbeff"
            type="circle"
            :stroke-width="10"
            :percentage="getPercentage('num')"
            :width="167"
            :height="167"
            :format="
              () => {
                return String(callCnt.num)
              }
            "
          >
          </el-progress>
          <p class="ch-count-text">总数</p>
        </div>
        <div class="circle-box">
          <el-progress
            color="#5c87ff"
            type="circle"
            :stroke-width="10"
            :percentage="getPercentage('day')"
            :width="167"
            :height="167"
            :format="
              () => {
                return String(callCnt.day)
              }
            "
          >
          </el-progress>
          <p class="ch-count-text">一日内</p>
        </div>
        <div class="circle-box">
          <el-progress
            color="#af5eff"
            type="circle"
            :stroke-width="10"
            :percentage="getPercentage('week')"
            :width="167"
            :height="167"
            :format="
              () => {
                return String(callCnt.week)
              }
            "
          >
          </el-progress>
          <p class="ch-count-text">一周内</p>
        </div>
        <div class="circle-box">
          <el-progress
            color="#53ca74"
            type="circle"
            :stroke-width="10"
            :percentage="getPercentage('month')"
            :width="167"
            :height="167"
            :format="
              () => {
                return String(callCnt.month)
              }
            "
          >
          </el-progress>
          <p class="ch-count-text">一月内</p>
        </div>
        <div class="circle-box">
          <el-progress
            color="#f97d6e"
            type="circle"
            :stroke-width="10"
            :percentage="getPercentage('year')"
            :width="167"
            :height="167"
            :format="
              () => {
                return String(callCnt.year)
              }
            "
          >
          </el-progress>
          <p class="ch-count-text">一年内</p>
        </div>
      </div>
    </div>
    <div class="chart-border">
      <div ref="chart" class="chart"></div>
    </div>
  </div>
</template>

<script>
import { default as AnsiUp } from "ansi_up"
export default {
  name: "MidInfo",
  data() {
    return {
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
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
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
  },
  beforeDestroy() {
    this.destroyWebsocket()
    if (this.chatCntInterval) {
      clearInterval(this.chatCntInterval)
    }
    if (this.callInterval) {
      clearInterval(this.callInterval)
    }
  },
  methods: {
    getPercentage(type) {
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

        this.getRequest(`${this.$root.prefix}/main/get_all_ch_count`, {
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
  }
  .ch-count-border {
    border-radius: 10px;
    background-color: white;
    padding: 30px;
    margin-top: 20px;
  }
  .ch-count {
    display: flex;
    justify-content: center;
    align-items: center;

    .circle-box {
      position: relative;
      text-align: center;
      width: 167px;
      margin-right: 50px;
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
    padding: 30px;
    margin-top: 20px;
    height: 308px;
  }
  .chart {
    height: 308px;
    width: 100%;
  }
}
</style>
