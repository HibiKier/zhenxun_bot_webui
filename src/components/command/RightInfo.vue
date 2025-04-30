<template>
  <div class="right-info bg-pink-50 p-2 md:p-4 h-full" ref="rightInfo">
    <!-- 机器人信息卡片 - 三行垂直布局 -->
    <div
      class="base-info bg-white rounded-xl p-3 shadow-md mb-4 border-2 border-pink-200"
    >
      <div class="space-y-2">
        <!-- 累计登录 -->
        <div class="flex items-center justify-between">
          <p
            class="text-xs font-semibold text-pink-500 uppercase tracking-wider"
          >
            累计登录
          </p>
          <p class="text-base font-bold text-purple-700">
            {{ botInfo.connect_count }}
          </p>
        </div>

        <!-- 连接时长 -->
        <div class="flex items-center justify-between">
          <p
            class="text-xs font-semibold text-pink-500 uppercase tracking-wider"
          >
            连接时长
          </p>
          <p class="text-base font-bold text-purple-700">
            {{ botInfo.connectTime }}
          </p>
        </div>

        <!-- 连接日期 -->
        <div class="flex items-center justify-between">
          <p
            class="text-xs font-semibold text-pink-500 uppercase tracking-wider"
          >
            连接日期
          </p>
          <p class="text-base font-bold text-purple-700">
            {{ botInfo.connect_date }}
          </p>
        </div>
      </div>
    </div>

    <!-- 图表区域 - 自适应高度 -->
    <div class="chart-area" :style="{ height: computedChartAreaHeight + 'px' }">
      <!-- 活跃群聊图表 -->
      <div
        class="chart-container bg-white rounded-xl p-4 shadow-md border-2 border-pink-200"
      >
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between mb-3"
        >
          <p
            class="text-base font-bold text-purple-600 mb-1 md:mb-0 flex items-center"
          >
            <i
              class="fas fa-users mr-1 text-pink-500 animate-bounce text-sm"
            ></i>
            活跃群组
          </p>

          <div class="flex flex-wrap gap-1">
            <button
              v-for="type in timeTypes"
              :key="'group' + type.value"
              @click="clickGroupType(type.value)"
              class="px-2 py-0.5 text-[10px] rounded-full transition-all duration-200"
              :class="{
                'bg-purple-500 text-white shadow-sm':
                  selectGroupType === type.value,
                'bg-pink-100 text-pink-600 hover:bg-pink-200':
                  selectGroupType !== type.value,
              }"
            >
              {{ type.label }}
            </button>
          </div>
        </div>

        <div ref="groupChart" class="w-full h-full min-h-[200px]"></div>
      </div>

      <!-- 热门插件图表 -->
      <div
        class="chart-container bg-white rounded-xl p-4 shadow-md border-2 border-pink-200"
      >
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between mb-3"
        >
          <p
            class="text-base font-bold text-purple-600 mb-1 md:mb-0 flex items-center"
          >
            <i class="fas fa-plug mr-1 text-pink-500 animate-pulse text-sm"></i>
            热门插件
          </p>

          <div class="flex flex-wrap gap-1">
            <button
              v-for="type in timeTypes"
              :key="'plugin' + type.value"
              @click="clickHotPluginType(type.value)"
              class="px-2 py-0.5 text-[10px] rounded-full transition-all duration-200"
              :class="{
                'bg-purple-500 text-white shadow-sm':
                  selectHotPluginType === type.value,
                'bg-pink-100 text-pink-600 hover:bg-pink-200':
                  selectHotPluginType !== type.value,
              }"
            >
              {{ type.label }}
            </button>
          </div>
        </div>

        <div ref="hotPluginChart" class="w-full h-full min-h-[200px]"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash"
export default {
  name: "RightInfo",
  data() {
    return {
      timeTypes: [
        { label: "全部", value: "all" },
        { label: "日", value: "day" },
        { label: "周", value: "week" },
        { label: "月", value: "month" },
        { label: "年", value: "year" },
      ],
      chartAreaHeight: 0,
      botInfo: {
        connect_count: 42,
        connectTime: "12:34:56",
        connect_date: "2023-10-15",
        connect_time: Date.now() / 1000 - 45296, // 示例数据
        self_id: "123456",
      },
      selectGroupType: "all",
      selectHotPluginType: "all",
      groupChart: null,
      hotPluginChart: null,
      groupCntInterval: null,
      timer: null,
      chartOpt: {
        grid: {
          top: "15%",
          bottom: "10%",
          left: "20%",
          right: "20%",
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            rotate: 30,
            fontSize: 10,
          },
        },
        yAxis: { type: "value" },
        series: [
          {
            type: "bar",
            data: [120, 200, 150, 80, 70],
            itemStyle: {
              color: "#ec4899",
              borderRadius: [4, 4, 0, 0],
            },
          },
        ],
      },
    }
  },
  computed: {
    computedChartAreaHeight() {
      if (!this.chartAreaHeight) {
        this.calculateHeights()
      }
      return this.chartAreaHeight
    },
    computedChartHeight() {
      console.log("this.chartAreaHeight", this.chartAreaHeight)

      return this.chartAreaHeight - 10
    },
  },
  mounted() {
    this.initCharts()
    this.setupResizeListener()
    this.startTimers()
    this.groupCntInterval = setInterval(() => {
      this.getActiveGroupData(this.selectGroupType, true)
    }, 25000)
  },
  beforeDestroy() {
    this.cleanup()
  },
  methods: {
    initCharts() {
      this.groupChart = this.$echarts.init(this.$refs.groupChart)
      this.hotPluginChart = this.$echarts.init(this.$refs.hotPluginChart)
      this.getActiveGroupData()
      this.getHotPlugin()
    },
    calculateHeights() {
      this.$nextTick(() => {
        if (this.$refs.rightInfo) {
          const infoHeight =
            this.$refs.rightInfo.querySelector(".base-info").offsetHeight
          this.chartAreaHeight =
            this.$refs.rightInfo.offsetHeight - infoHeight - 48 // 减去padding和margin
        }
      })
    },

    setupResizeListener() {
      const resizeHandler = debounce(() => {
        this.$nextTick(() => {
          this.groupChart?.resize()
          this.hotPluginChart?.resize()
        })
      }, 200)
      window.addEventListener("resize", resizeHandler)
      this.$once("hook:beforeDestroy", () => {
        window.removeEventListener("resize", resizeHandler)
      })
    },

    startTimers() {
      // 连接时间计时器
      if (this.botInfo.connect_time) {
        this.updateConnectTime()
        this.timer = setInterval(this.updateConnectTime, 1000)
      }

      // 数据刷新定时器
      this.groupCntInterval = setInterval(() => {
        this.getActiveGroupData(this.selectGroupType, true)
      }, 25000)
    },

    updateConnectTime() {
      const now = Math.floor(Date.now() / 1000)
      this.botInfo.connectTime = this.formatSeconds(
        now - this.botInfo.connect_time
      )
    },

    formatSeconds(seconds) {
      const h = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, "0")
      const m = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, "0")
      const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0")
      return `${h}:${m}:${s}`
    },

    cleanup() {
      if (this.groupCntInterval) clearInterval(this.groupCntInterval)
      if (this.timer) clearInterval(this.timer)
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
            tmpOpt.xAxis.name = "群组"
            tmpOpt.xAxis.data = group_list
            tmpOpt.series[0].data = data
            tmpOpt.series[0].series = "#a855f7"

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
      this.getHotPlugin(type === "all" ? null : type)
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
  },
}
</script>

<style scoped>
.right-info {
  scrollbar-width: thin;
  scrollbar-color: #d8b4fe #f5f3ff;
}

.right-info::-webkit-scrollbar {
  width: 6px;
}

.right-info::-webkit-scrollbar-track {
  background: #f5f3ff;
  border-radius: 10px;
}

.right-info::-webkit-scrollbar-thumb {
  background-color: #d8b4fe;
  border-radius: 10px;
}

.chart-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-container {
  flex: 1;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.base-info {
  transition: all 0.3s ease;
}

.base-info div:not(:last-child) {
  border-bottom: 1px dashed #f3e8ff;
  padding-bottom: 8px;
}

.base-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
}

button {
  transition: all 0.2s ease;
}

button:hover {
  transform: scale(1.05);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .right-info {
    padding: 0.75rem;
  }

  .base-info {
    padding: 0.75rem;
  }

  .chart-container {
    padding: 0.75rem;
  }
}
</style>
