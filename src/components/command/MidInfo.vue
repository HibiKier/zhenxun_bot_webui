<template>
  <div ref="midInfo" class="mid-info text-gray-800 p-4 flex flex-col h-full">
    <!-- 顶部区域 -->
    <!-- <div class="top-area bg-pink-50 rounded-xl p-5 shadow-md mb-4">
      <p class="text-2xl md:text-3xl font-bold text-purple-600 mb-1">
        <span class="text-pink-500">(≧∇≦)ﾉ</span> 一位勇者的磨砺...
      </p>
      <p class="text-sm md:text-base text-gray-500">
        挥剑吧，勇者... <span class="text-pink-400">☆⌒(*^-゜)v</span>
      </p>
    </div> -->

    <!-- 消息接收区域 -->
    <div class="message-area bg-white rounded-xl shadow-md p-4 mb-4">
      <div class="title-box flex items-center mb-3">
        <p class="text-lg font-bold text-purple-600 flex items-center">
          <span class="mr-2">(◕‿◕✿)</span>消息接收
        </p>
        <span class="text-xs text-gray-500 ml-3">
          勇者结识伙伴，收到的问候，口才+1
        </span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div
          v-for="(item, key) in progressItems.chat"
          :key="key"
          class="flex flex-col items-center"
        >
          <el-progress
            type="circle"
            :percentage="getPercentageChat(key)"
            :width="progressWidth"
            :stroke-width="8"
            :color="item.color"
            :format="() => chCnt[key]"
          />
          <p class="text-sm md:text-base font-medium mt-2 text-gray-700">
            {{ item.label }}
          </p>
        </div>
      </div>
    </div>

    <!-- 功能调用区域 -->
    <div class="function-area bg-white rounded-xl shadow-md p-4 mb-4">
      <div class="title-box flex items-center mb-3">
        <p class="text-lg font-bold text-blue-600 flex items-center">
          <span class="mr-2">(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</span>功能调用
        </p>
        <span class="text-xs text-gray-500 ml-3">
          勇者磨砺自身，辛勤的汗水，力量+1
        </span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div
          v-for="(item, key) in progressItems.call"
          :key="key"
          class="flex flex-col items-center"
        >
          <el-progress
            type="circle"
            :percentage="getPercentageCall(key)"
            :width="progressWidth"
            :stroke-width="8"
            :color="item.color"
            :format="() => callCnt[key] || '0'"
          />
          <p class="text-sm md:text-base font-medium mt-2 text-gray-700">
            {{ item.label }}
          </p>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div
      class="chart-area bg-white rounded-xl shadow-md p-4 flex-1 min-h-[300px]"
    >
      <div ref="chart" class="w-full h-full"></div>
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
      progressWidth: 80,
      botInfo: null,
      chCnt: { num: 0, day: 0, week: 0, month: 0, year: 0 },
      callCnt: { num: 0, day: 0, week: 0, month: 0, year: 0 },
      progressItems: {
        chat: {
          num: { label: "总数", color: "#f97316" },
          day: { label: "一日内", color: "#ec4899" },
          week: { label: "一周内", color: "#a855f7" },
          month: { label: "一月内", color: "#3b82f6" },
          year: { label: "一年内", color: "#10b981" },
        },
        call: {
          num: { label: "总数", color: "#f97316" },
          day: { label: "一日内", color: "#ec4899" },
          week: { label: "一周内", color: "#a855f7" },
          month: { label: "一月内", color: "#3b82f6" },
          year: { label: "一年内", color: "#10b981" },
        },
      },
      ansi_up: null,
      clgDiv: null,
      chatCntInterval: null,
      callInterval: null,
      chart: null,
      chatAndCallMonth: {},
      chartOpt: {
        title: {
          text: "消息/调用统计",
          textStyle: {
            color: "#7c3aed",
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(255,255,255,0.9)",
          borderColor: "#e9d5ff",
          borderWidth: 1,
          textStyle: {
            color: "#6b21a8",
          },
        },
        legend: {
          data: ["消息统计", "调用统计"],
          textStyle: {
            color: "#6b21a8",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
          backgroundColor: "#fdf4ff",
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存图片",
              pixelRatio: 2,
            },
          },
          iconStyle: {
            borderColor: "#c084fc",
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
          axisLine: {
            lineStyle: {
              color: "#c084fc",
            },
          },
          axisLabel: {
            color: "#9333ea",
          },
        },
        yAxis: [
          {
            type: "value",
            name: "消息统计",
            axisLine: {
              lineStyle: {
                color: "#c084fc",
              },
            },
            axisLabel: {
              color: "#9333ea",
            },
            splitLine: {
              lineStyle: {
                color: "#f3e8ff",
              },
            },
          },
          {
            type: "value",
            name: "调用统计",
            position: "right",
            axisLine: {
              lineStyle: {
                color: "#c084fc",
              },
            },
            axisLabel: {
              color: "#9333ea",
            },
            splitLine: {
              lineStyle: {
                color: "#f3e8ff",
              },
            },
          },
        ],
        series: [
          {
            name: "消息统计",
            type: "line",
            smooth: true,
            data: [],
            yAxisIndex: 0,
            lineStyle: {
              width: 3,
              color: "#c084fc",
            },
            itemStyle: {
              color: "#a855f7",
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
                    color: "#e9d5ff",
                  },
                  {
                    offset: 1,
                    color: "#f3e8ff",
                  },
                ],
              },
            },
          },
          {
            name: "调用统计",
            type: "line",
            smooth: true,
            data: [],
            yAxisIndex: 1,
            lineStyle: {
              width: 3,
              color: "#f0abfc",
            },
            itemStyle: {
              color: "#d946ef",
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
                    color: "#f5d0fe",
                  },
                  {
                    offset: 1,
                    color: "#fae8ff",
                  },
                ],
              },
            },
          },
        ],
      },
    }
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
    window.removeEventListener("resize", this.handleResize)
  },
  methods: {
    handleResize() {
      const width = window.innerWidth
      this.progressWidth = width < 768 ? 70 : 90

      if (this.chart) {
        this.chart.resize()
      }
    },
    getPercentageChat(type) {
      if (this.chCnt.num == 0) return 0
      if (type == "num") return 100
      if (this.chCnt[type] == this.chCnt.num) return 100
      return (this.chCnt[type] / this.chCnt.num) * 100
    },
    getPercentageCall(type) {
      if (this.callCnt.num == 0) return 0
      if (type == "num") return 100
      if (this.callCnt[type] == this.callCnt.num) return 100
      return (this.callCnt[type] / this.callCnt.num) * 100
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

<style scoped>
.mid-info {
  background-color: #fdf2f8;
}

.top-area {
  background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%);
}

.message-area,
.function-area,
.chart-area {
  border: 1px solid #f3e8ff;
}

::v-deep .el-progress-circle {
  @apply transform hover:scale-105 transition-transform;
}

::v-deep .el-progress__text {
  @apply text-lg md:text-xl font-bold text-purple-600;
}

.chart-area {
  @apply bg-gradient-to-br from-pink-50 to-purple-50;
}

/* 自定义滚动条 */
.mid-info::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.mid-info::-webkit-scrollbar-thumb {
  @apply bg-pink-300 rounded-full;
}

.mid-info::-webkit-scrollbar-track {
  @apply bg-pink-100;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .title-box {
    @apply flex-col items-start;
  }

  .title-box span {
    @apply ml-0 mt-1;
  }

  ::v-deep .el-progress__text {
    @apply text-base;
  }
}
</style>
