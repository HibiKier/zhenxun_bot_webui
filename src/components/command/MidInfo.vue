<template>
  <div ref="midInfo" class="mid-info text-gray-800 p-4 flex flex-col h-full">
    <!-- 消息接收区域 -->
    <div
      class="message-area bg-white rounded-xl shadow-md p-4 mb-4"
      :style="{ height: areaHeight + 'px' }"
    >
      <div class="title-box flex items-center mb-3">
        <p class="text-md font-bold text-purple-600 flex items-center">
          <span class="mr-2">(◕‿◕✿)</span>消息接收
        </p>
        <span class="text-xs text-gray-500 ml-3">
          勇者结识伙伴，收到的问候，口才+1
        </span>
      </div>

      <div
        class="grid grid-cols-2 md:grid-cols-5 gap-3"
        :style="{ height: areaHeight - 80 + 'px' }"
      >
        <div
          v-for="(item, key) in progressItems.chat"
          :key="key"
          class="flex flex-col p-1 justify-center"
        >
          <div
            class="progress-container flex-col w-full flex justify-center items-center"
          >
            <div
              class="progress-container w-full flex justify-center items-center"
            >
              <el-progress
                type="circle"
                :percentage="getPercentageChat(key)"
                :width="progressWidth"
                :stroke-width="strokeWidth"
                :color="item.color"
                :format="() => String(chCnt[key])"
                :style="{
                  '--progress-font-size': fontSize + 'px',
                  'max-width': '100%',
                }"
              />
            </div>
            <p
              class="text-sm font-medium mt-2 text-gray-700 text-center truncate w-full"
            >
              {{ item.label }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能调用区域 -->
    <div
      class="function-area bg-white rounded-xl shadow-md p-4 mb-4"
      :style="{ height: areaHeight + 'px' }"
    >
      <div class="title-box flex items-center mb-3">
        <p class="text-md font-bold text-blue-600 flex items-center">
          <span class="mr-2">(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</span>功能调用
        </p>
        <span class="text-xs text-gray-500 ml-3">
          勇者磨砺自身，辛勤的汗水，力量+1
        </span>
      </div>

      <div
        class="grid grid-cols-2 md:grid-cols-5 gap-3"
        :style="{ height: areaHeight - 80 + 'px' }"
      >
        <div
          v-for="(item, key) in progressItems.chat"
          :key="key"
          class="flex flex-col p-1 justify-center"
        >
          <div
            class="progress-container flex-col w-full flex justify-center items-center"
          >
            <div
              class="progress-container w-full flex justify-center items-center"
            >
              <!-- 添加 items-center 和 flex-grow -->
              <el-progress
                type="circle"
                :percentage="getPercentageCall(key)"
                :width="progressWidth"
                :stroke-width="strokeWidth"
                :color="item.color"
                :format="() => String(callCnt[key])"
                :style="{
                  '--progress-font-size': fontSize + 'px',
                  'max-width': '100%',
                }"
              />
            </div>
            <p
              class="text-sm font-medium mt-2 text-gray-700 text-center truncate w-full"
            >
              {{ item.label }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div
      class="chart-area bg-white rounded-xl shadow-md p-4 flex-1 min-h-[100px]"
      ref="chartArea"
      :style="{ height: computedChartHeight + 'px' }"
    >
      <div
        ref="chart"
        class="w-full h-full"
        :style="{ height: computedChartHeight - 20 + 'px' }"
      ></div>
    </div>
  </div>
</template>

<script>
import { default as AnsiUp } from 'ansi_up'
export default {
  name: 'MidInfo',
  data() {
    return {
      progressWidth: 80,
      strokeWidth: 8,
      fontSize: 14,
      areaHeight: 300,
      chartBorderHeight: 0,
      botInfo: null,
      chCnt: { num: 0, day: 0, week: 0, month: 0, year: 0 },
      callCnt: { num: 0, day: 0, week: 0, month: 0, year: 0 },
      progressItems: {
        chat: {
          num: { label: '总数', color: '#f97316' },
          day: { label: '一日内', color: '#ec4899' },
          week: { label: '一周内', color: '#a855f7' },
          month: { label: '一月内', color: '#3b82f6' },
          year: { label: '一年内', color: '#10b981' },
        },
        call: {
          num: { label: '总数', color: '#f97316' },
          day: { label: '一日内', color: '#ec4899' },
          week: { label: '一周内', color: '#a855f7' },
          month: { label: '一月内', color: '#3b82f6' },
          year: { label: '一年内', color: '#10b981' },
        },
      },
      chatCntInterval: null,
      callInterval: null,
      chart: null,
      chatAndCallMonth: {},
      chartOpt: {
        title: {
          text: '消息/调用统计',
          textStyle: {
            color: '#7c3aed',
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderColor: '#e9d5ff',
          borderWidth: 1,
          textStyle: {
            color: '#6b21a8',
            fontSize: 14,
          },
        },
        legend: {
          data: ['消息统计', '调用统计'],
          textStyle: {
            color: '#6b21a8',
            fontSize: 14,
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
          backgroundColor: '#fdf4ff',
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: '保存图片',
              pixelRatio: 2,
            },
          },
          iconStyle: {
            borderColor: '#c084fc',
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#c084fc',
            },
          },
          axisLabel: {
            color: '#9333ea',
            fontSize: 12,
          },
        },
        yAxis: [
          {
            type: 'value',
            name: '消息统计',
            axisLine: {
              lineStyle: {
                color: '#c084fc',
              },
            },
            axisLabel: {
              color: '#9333ea',
              fontSize: 12,
            },
            splitLine: {
              lineStyle: {
                color: '#f3e8ff',
              },
            },
          },
          {
            type: 'value',
            name: '调用统计',
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#c084fc',
              },
            },
            axisLabel: {
              color: '#9333ea',
              fontSize: 12,
            },
            splitLine: {
              lineStyle: {
                color: '#f3e8ff',
              },
            },
          },
        ],
        series: [
          {
            name: '消息统计',
            type: 'line',
            smooth: true,
            data: [],
            yAxisIndex: 0,
            lineStyle: {
              width: 3,
              color: '#c084fc',
            },
            itemStyle: {
              color: '#a855f7',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#e9d5ff',
                  },
                  {
                    offset: 1,
                    color: '#f3e8ff',
                  },
                ],
              },
            },
          },
          {
            name: '调用统计',
            type: 'line',
            smooth: true,
            data: [],
            yAxisIndex: 1,
            lineStyle: {
              width: 3,
              color: '#f0abfc',
            },
            itemStyle: {
              color: '#d946ef',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#f5d0fe',
                  },
                  {
                    offset: 1,
                    color: '#fae8ff',
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
    window.addEventListener('resize', this.handleResize)
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
  computed: {
    computedChartHeight() {
      if (!this.chartBorderHeight) {
        this.handleResize()
      }
      return this.chartBorderHeight
    },
  },
  beforeDestroy() {
    if (this.chatCntInterval) {
      clearInterval(this.chatCntInterval)
    }
    if (this.callInterval) {
      clearInterval(this.callInterval)
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    updateAreaHeight() {
      if (this.$isMobile()) {
        // 移动端使用固定高度
        this.areaHeight = 500
      } else {
        // 桌面端保持原有动态计算逻辑
        const height = window.innerHeight
        this.areaHeight = height * 0.2
        if (height > 1080) {
          this.areaHeight = height * 0.25
        }
        if (height > 1440) {
          this.areaHeight = height * 0.3
        }
        // 确保最小高度
        this.areaHeight = Math.max(this.areaHeight, 200)
      }
    },

    handleResize() {
      const width = window.innerWidth
      const height = window.innerHeight

      // 进度条大小调整逻辑保持不变
      if (width < 640) {
        this.progressWidth = Math.min(70, Math.max(50, width * 0.15))
        this.strokeWidth = 6
        this.fontSize = 10
      } else if (width < 1024) {
        this.progressWidth = 75
        this.strokeWidth = 7
        this.fontSize = 12
      } else {
        this.progressWidth = 90
        this.strokeWidth = 8
        this.fontSize = 14
      }

      // 高分辨率适配
      if (height > 1080) {
        this.progressWidth = Math.floor(height * 0.15)
        this.strokeWidth = Math.floor(this.progressWidth * 0.2)
        this.fontSize = Math.floor(this.progressWidth * 0.15)
      }

      // 确保最小和最大值
      this.progressWidth = Math.max(50, Math.min(this.progressWidth, 120))
      this.strokeWidth = Math.max(6, Math.min(this.strokeWidth, 12))
      this.fontSize = Math.max(10, Math.min(this.fontSize, 18))

      // 调用更新高度方法
      this.updateAreaHeight()

      this.$nextTick(() => {
        this.chartBorderHeight =
          this.$refs.midInfo.offsetHeight - this.areaHeight * 2 - 100
        this.chartBorderHeight = Math.max(this.chartBorderHeight, 180)

        this.chart.resize()
      })
    },
    getPercentageChat(type) {
      if (this.chCnt.num == 0) return 0
      if (type == 'num') return 100
      if (this.chCnt[type] == this.chCnt.num) return 100
      return (this.chCnt[type] / this.chCnt.num) * 100
    },
    getPercentageCall(type) {
      if (this.callCnt.num == 0) return 0
      if (type == 'num') return 100
      if (this.callCnt[type] == this.callCnt.num) return 100
      return (this.callCnt[type] / this.callCnt.num) * 100
    },
    getMonthChatAndCallCount(bot_id) {
      var loading = this.getLoading('.chart')
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
          var loading = this.getLoading('.ch-count')
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
          var loading = this.getLoading('.ch-count')
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

.message-area,
.function-area,
.chart-area {
  border: 1px solid #f3e8ff;
  transition: height 0.3s ease, font-size 0.3s ease;
}

.chart-area {
  background: linear-gradient(to bottom right, #fdf2ff, #f5f3ff);
}

.title-box {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.text-md {
  font-size: 1rem;
  line-height: 1.5;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.5;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1.5;
}

.progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 移动端响应式样式 */
@media (max-width: 640px) {
  .message-area,
  .function-area {
    padding: 12px;
  }

  .title-box {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .title-box span {
    margin-left: 0;
    margin-top: 4px;
    width: 100%;
  }

  .progress-container {
    min-width: 60px;
    max-width: 80px;
  }

  .grid-cols-2 {
    gap: 8px;
  }
}

/* 平板响应式样式 */
@media (max-width: 1024px) and (min-width: 641px) {
  .message-area,
  .function-area {
    padding: 12px;
  }
}

/* 自定义滚动条 */
.mid-info::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.mid-info::-webkit-scrollbar-thumb {
  background-color: #f9a8d4;
  border-radius: 9999px;
}

.mid-info::-webkit-scrollbar-track {
  background-color: #fce7f3;
}

/* 打印样式 */
@media print {
  .mid-info {
    background-color: white !important;
  }

  .message-area,
  .function-area,
  .chart-area {
    border: 1px solid #ddd !important;
    box-shadow: none !important;
  }
}
</style>
