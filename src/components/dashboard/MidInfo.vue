<template>
  <div
    ref="midInfo"
    class="mid-info text-gray-800 p-4 flex flex-col"
    :style="{ backgroundColor: 'var(--bg-color)' }"
  >
    <!-- 顶部区域 -->
    <div class="top-area" ref="topArea">
      <!-- 欢迎标题 -->
      <div
        v-if="!$isMobile()"
        ref="welcomeBox"
        class="welcome-box rounded-xl z-10 p-5 shadow-lg mb-5 transform hover:scale-105 transition-transform"
        :style="{ backgroundColor: 'var(--bg-color-secondary)' }"
      >
        <p
          class="text-2xl md:text-3xl font-bold mb-2"
          :style="{ color: 'var(--primary-color)' }"
        >
          <span :style="{ color: 'var(--primary-color-light)' }">(≧∇≦)ﾉ</span>
          Hello 欢迎来到真寻的小房间！
        </p>
        <p
          class="text-sm md:text-base"
          :style="{ color: 'var(--text-color-secondary)' }"
        >
          这是一场传奇的冒险旅途...
          <span :style="{ color: 'var(--primary-color-light)' }"
            >☆⌒(*^-゜)v</span
          >
        </p>
      </div>

      <div
        id="main"
        ref="mainContent"
        :style="{ height: mainHeight + 'px' }"
        class="overflow-auto px-0"
      >
        <div ref="mainStatus" class="overflow-auto overflow-x-visible">
          <!-- 系统状态 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div
              v-for="(item, index) in systemCards"
              :key="index"
              class="rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
              :style="{ backgroundColor: 'var(--bg-color-secondary)' }"
            >
              <div class="flex items-center justify-center mb-2">
                <svg-icon
                  :icon-class="item.icon"
                  class="w-6 h-6 mr-2"
                  :class="item.iconColor"
                />
                <span
                  class="text-sm md:text-base font-medium"
                  :style="{ color: 'var(--text-color-secondary)' }"
                  >{{ item.title }}</span
                >
              </div>
              <div class="text-center">
                <p
                  class="text-2xl md:text-3xl font-bold"
                  :class="item.textColor"
                >
                  {{ systemStatus[item.key] }}%
                </p>
              </div>
            </div>
          </div>

          <!-- 聊天统计 -->
          <div
            ref="chatCards"
            class="char-cards grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
          >
            <div
              v-for="(item, index) in chatCards"
              :key="index"
              class="rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow"
              :style="{ backgroundColor: 'var(--bg-color-secondary)' }"
            >
              <div class="text-center mb-1">
                <span
                  class="text-xs md:text-sm font-medium"
                  :style="{ color: 'var(--text-color-secondary)' }"
                  >{{ item.title }}</span
                >
              </div>
              <div class="text-center">
                <p
                  class="text-xl md:text-2xl font-bold"
                  :style="{ color: 'var(--primary-color)' }"
                >
                  {{ chatAndCall[item.key] }}
                </p>
              </div>
            </div>
          </div>

          <!-- 折叠区域 -->
          <div
            class="detail-more rounded-xl overflow-hidden shadow-lg mb-4"
            :style="{ backgroundColor: 'var(--bg-color-secondary)' }"
          >
            <el-collapse @change="handleChange" style="border: none">
              <el-collapse-item>
                <template slot="title">
                  <div
                    class="w-full text-center py-2 font-medium"
                    :style="{
                      color: 'var(--primary-color)',
                      backgroundColor: 'var(--bg-color-secondary)',
                    }"
                  >
                    <span class="mr-2">(๑•̀ㅂ•́)و✧</span>查看更多...
                  </div>
                </template>

                <!-- 详细统计 -->
                <div
                  class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4"
                  :style="{ backgroundColor: 'var(--bg-color-secondary)' }"
                  ref="collapseContent"
                >
                  <div
                    v-for="(item, index) in detailCards"
                    :key="index"
                    class="rounded-lg p-2 shadow-inner"
                    :style="{ backgroundColor: 'var(--bg-color)' }"
                  >
                    <div class="text-center mb-1">
                      <span
                        class="text-xs font-medium"
                        :style="{ color: 'var(--text-color-secondary)' }"
                        >{{ item.title }}</span
                      >
                    </div>
                    <div class="text-center">
                      <p
                        class="text-lg font-bold"
                        :style="{ color: 'var(--primary-color)' }"
                      >
                        {{ allChatAndCall[item.key] }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 图表区域 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                  <div
                    class="rounded-xl p-4 h-64"
                    :style="{ backgroundColor: 'var(--bg-color-secondary)' }"
                  >
                    <div ref="chatChart" class="w-full h-full"></div>
                  </div>
                  <div
                    class="rounded-xl p-4 h-64"
                    :style="{ backgroundColor: 'var(--bg-color-secondary)' }"
                  >
                    <div ref="callChart" class="w-full h-full"></div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>

        <!-- 日志区域 -->
        <div
          ref="logArea"
          class="log-area rounded-xl shadow-lg p-4 flex flex-col"
          :style="{
            height: logHeight + 'px',
            backgroundColor: 'var(--bg-color-secondary)',
          }"
        >
          <div
            class="title-box flex items-center justify-between mb-3 flex-shrink-0"
          >
            <p
              class="text-lg font-bold flex items-center"
              :style="{ color: 'var(--primary-color)' }"
            >
              <span class="mr-2">(◕‿◕✿)</span>后台日志
            </p>
            <span
              :style="{ color: 'var(--text-color-secondary)' }"
              class="text-xs"
              >虽然不知道为什么，但是视力+1</span
            >
          </div>
          <div
            class="log-content rounded-lg p-3 flex-1 min-h-0 overflow-hidden"
            :style="{
              height: logHeight + 'px',
              backgroundColor: 'var(--bg-color-secondary)',
            }"
          >
            <el-scrollbar class="h-full" ref="dashBoardScrollbar">
              <div
                id="clg"
                class="font-mono text-sm"
                :style="{ color: 'var(--text-color)' }"
              ></div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { default as AnsiUp } from "ansi_up"
import { mapGetters } from "vuex"
export default {
  name: "MidInfo",
  data() {
    return {
      systemCards: [
        {
          icon: "cpu",
          title: "CPU",
          key: "cpu",
          iconColor: "text-blue-500",
          textColor: "text-blue-600",
        },
        {
          icon: "memory",
          title: "MEMORY",
          key: "memory",
          iconColor: "text-green-500",
          textColor: "text-green-600",
        },
        {
          icon: "disk",
          title: "DISK",
          key: "disk",
          iconColor: "text-yellow-500",
          textColor: "text-yellow-600",
        },
      ],
      chatCards: [
        { title: "消息总数", key: "chat_num" },
        { title: "今日消息", key: "chat_day" },
        { title: "调用总数", key: "call_num" },
        { title: "今日调用", key: "call_day" },
      ],
      detailCards: [
        { title: "一周内消息", key: "chat_week" },
        { title: "一月内消息", key: "chat_month" },
        { title: "一年内消息", key: "chat_year" },
        { title: "一周内调用", key: "call_week" },
        { title: "一月内调用", key: "call_month" },
        { title: "一年内调用", key: "call_year" },
      ],
      windowHeight: window.innerHeight,
      botInfo: null,
      statusWs: null,
      chatAndCall: { chat_num: 0, chat_day: 0, call_num: 0, call_day: 0 },
      allChatAndCall: {
        chat_week: 0,
        chat_month: 0,
        chat_year: 0,
        call_week: 0,
        call_month: 0,
        call_year: 0,
      },
      chatAndCallAll: {},
      chatAndCallMonth: { chat: [], call: [], date: [] },
      logWs: null,
      ansi_up: null,
      clgDiv: null,
      chatCntInterval: null,
      chatChart: null,
      callChart: null,
      chartOpt: {
        title: {
          text: "30天内记录次数",
          left: "center",
          textStyle: { color: "var(--primary-color)" },
          subtextStyle: { color: "var(--text-color-secondary)" },
        },
        xAxis: {
          type: "category",
          name: "日期",
          data: [],
          axisLine: { lineStyle: { color: "var(--text-color-secondary)" } },
          axisLabel: { color: "var(--text-color-secondary)" },
        },
        yAxis: {
          type: "value",
          name: "次数",
          axisLine: { lineStyle: { color: "var(--text-color-secondary)" } },
          axisLabel: { color: "var(--text-color-secondary)" },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "var(--bg-color-secondary)",
          borderColor: "var(--border-color)",
          textStyle: { color: "var(--text-color)" },
        },
        series: [
          {
            data: [],
            type: "line",
            smooth: true,
            lineStyle: { color: "var(--primary-color-light)" },
            itemStyle: { color: "var(--primary-color)" },
          },
        ],
        backgroundColor: "var(--bg-color)",
      },
      mainHeight: 0,
      logHeight: 0,
      resizeObserver: null,
    }
  },
  computed: {
    ...mapGetters({
      systemStatus: "getWsStatusData",
    }),
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.clgDiv = document.getElementById("clg")
    this.ansi_up = new AnsiUp()
    this.getChatAndCallCount()
    this.chatCntInterval = setInterval(() => {
      this.getChatAndCallCount(true)
    }, 30000)
    this.chatChart = this.$echarts.init(this.$refs.chatChart)
    this.callChart = this.$echarts.init(this.$refs.callChart)
    this.$store.dispatch("initLogSocket", this.logCallable)
    this.calculateMainHeight()
    this.setupResizeObserver()
    window.addEventListener("resize", this.calculateMainHeight)

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          this.getMonthChatAndCallCount()
        }
      })
    })
    observer.observe(document.documentElement, { attributes: true })
  },
  beforeDestroy() {
    this.destroyWebsocket()
    if (this.chatCntInterval) {
      clearInterval(this.chatCntInterval)
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
    window.removeEventListener("resize", this.calculateMainHeight)
  },
  methods: {
    calculateMainHeight() {
      this.$nextTick(() => {
        // 获取容器总高度
        const midInfoHeight = this.$refs.midInfo?.offsetHeight || 0

        // 获取上方所有元素的高度
        const welcomeBoxHeight = this.$refs.welcomeBox?.offsetHeight || 0
        const systemCardsHeight = this.$refs.systemCards?.offsetHeight || 0
        const chatCardsHeight = this.$refs.chatCards?.offsetHeight || 0
        const collapseHeaderHeight = 48 // 折叠面板标题固定高度

        // 计算剩余可用高度
        const usedHeight =
          welcomeBoxHeight +
          systemCardsHeight +
          chatCardsHeight +
          collapseHeaderHeight

        // 添加额外的margin/padding补偿（移动端可能需要调整这个值）
        const mobileCompensation = this.$isMobile() ? 20 : 0

        // 设置主内容区高度
        this.mainHeight = Math.max(
          midInfoHeight - usedHeight - mobileCompensation + 85,
          200
        )

        // 设置日志区高度（减去标题和padding）
        this.logHeight = Math.max(this.mainHeight - 280, 100)

        // 如果是移动设备，使用更紧凑的布局
        if (this.$isMobile()) {
          this.mainHeight = Math.max(this.mainHeight, 500)
          this.logHeight = Math.max(this.mainHeight * 0.4, 250)
        }
      })
    },

    setupResizeObserver() {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateMainHeight()
        if (this.chatChart) this.chatChart.resize()
        if (this.callChart) this.callChart.resize()
      })

      // 观察所有可能影响布局的元素
      if (this.$refs.midInfo) this.resizeObserver.observe(this.$refs.midInfo)
      if (this.$refs.welcomeBox)
        this.resizeObserver.observe(this.$refs.welcomeBox)
      if (this.$refs.systemCards)
        this.resizeObserver.observe(this.$refs.systemCards)
      if (this.$refs.chatCards)
        this.resizeObserver.observe(this.$refs.chatCards)
    },

    handleResize() {
      this.windowHeight = window.innerHeight
      if (this.chatChart) this.chatChart.resize()
      if (this.callChart) this.callChart.resize()
    },
    handleChange(a) {
      if (a.length) {
        this.getMonthChatAndCallCount()
        this.getAllChatAndCallCount()
      }
    },
    getAllChatAndCallCount() {
      var loading = this.getLoading(".char-cards")
      this.getRequest(
        `${this.$root.prefix}/dashboard/get_all_chat_and_call_count`
      ).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.allChatAndCall = resp.data
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    getMonthChatAndCallCount() {
      var loading = this.getLoading(".detail-more")
      this.getRequest(
        `${this.$root.prefix}/dashboard/get_chat_and_call_month`
      ).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.chatAndCallMonth = resp.data
            const chatOpt = JSON.parse(JSON.stringify(this.chartOpt))
            const callOpt = JSON.parse(JSON.stringify(this.chartOpt))
            chatOpt.xAxis.data = this.chatAndCallMonth.date
            callOpt.xAxis.data = this.chatAndCallMonth.date
            chatOpt.title.text = "聊天记录"
            callOpt.title.text = "调用记录"
            chatOpt.series[0].data = this.chatAndCallMonth.chat
            callOpt.series[0].data = this.chatAndCallMonth.call

            // 获取当前主题的实际颜色值
            const computedStyle = getComputedStyle(document.documentElement)
            const primaryColor = computedStyle
              .getPropertyValue("--primary-color")
              .trim()
            const primaryColorLight = computedStyle
              .getPropertyValue("--primary-color-light")
              .trim()
            const textColor = computedStyle
              .getPropertyValue("--text-color")
              .trim()
            const textColorSecondary = computedStyle
              .getPropertyValue("--text-color-secondary")
              .trim()
            const bgColor = computedStyle.getPropertyValue("--bg-color").trim()
            const bgColorSecondary = computedStyle
              .getPropertyValue("--bg-color-secondary")
              .trim()
            const borderColor = computedStyle
              .getPropertyValue("--border-color")
              .trim()

            // 更新图表配置中的颜色
            const updateChartColors = (opt) => {
              opt.title.textStyle.color = primaryColor
              opt.title.subtextStyle.color = textColorSecondary
              opt.xAxis.axisLine.lineStyle.color = textColorSecondary
              opt.xAxis.axisLabel.color = textColorSecondary
              opt.yAxis.axisLine.lineStyle.color = textColorSecondary
              opt.yAxis.axisLabel.color = textColorSecondary
              opt.tooltip.backgroundColor = bgColorSecondary
              opt.tooltip.borderColor = borderColor
              opt.tooltip.textStyle.color = textColor
              opt.series[0].lineStyle.color = primaryColorLight
              opt.series[0].itemStyle.color = primaryColor
              opt.backgroundColor = bgColor
            }

            updateChartColors(chatOpt)
            updateChartColors(callOpt)

            this.chatChart.setOption(chatOpt)
            this.callChart.setOption(callOpt)
            this.chatChart.resize()
            this.callChart.resize()
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    getChatAndCallCount(no_loading) {
      if (!no_loading) {
        var loading = this.getLoading(".ch-count")
      }
      this.getRequest(
        `${this.$root.prefix}/dashboard/get_chat_and_call_count`
      ).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            if (loading) this.$message.warning(resp.warning)
          } else {
            if (loading) this.$message.success(resp.info)
            this.chatAndCall = resp.data
          }
        } else {
          if (loading) this.$message.error(resp.info)
        }
        if (loading) loading.close()
      })
    },
    statusWsOnmessage(event) {
      this.systemStatus = JSON.parse(event.data)
    },
    logCallable(data) {
      let log = this.ansi_up.ansi_to_html(data)
      log = log.replace("color:rgb(0,0,187)", "color:rgb(55,186,255)")
      let childDom = document.createElement("div")
      childDom.innerHTML = log

      this.clgDiv.appendChild(childDom)
      let children = this.clgDiv.children

      if (children.length > 150) {
        this.clgDiv.removeChild(children[0])
      }

      this.$nextTick(() => {
        if (this.$refs["dashBoardScrollbar"]) {
          const div = this.$refs["dashBoardScrollbar"].$refs["wrap"]
          div.scrollTop = div.scrollHeight
        }
      })
    },
    destroyWebsocket() {
      window.removeEventListener("resize", this.handleResize)
    },
  },
}
</script>

<style scoped>
.mid-info {
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
}

/* 欢迎标题 */
.welcome-box p.text-2xl {
  font-size: var(--font-size-xxl);
  line-height: var(--line-height-dense);
}

.welcome-box p.text-sm {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

/* 系统卡片 */
.system-cards .text-sm {
  font-size: var(--font-size-xs);
}

.system-cards .text-2xl {
  font-size: var(--font-size-xl);
}

/* 聊天统计卡片 */
.chat-cards .text-xs {
  font-size: var(--font-size-xxs);
}

.chat-cards .text-xl {
  font-size: var(--font-size-lg);
}

/* 详细统计卡片 */
.detail-cards .text-xs {
  font-size: var(--font-size-xxs);
}

.detail-cards .text-lg {
  font-size: var(--font-size-sm);
}

/* 日志区域 */
.log-area .text-lg {
  font-size: var(--font-size-md);
}

.log-area .text-xs {
  font-size: var(--font-size-xxs);
}

/* 代码日志 */
#clg {
  font-size: var(--font-size-code);
  line-height: var(--line-height-normal);
}

/* 折叠面板标题 */
::v-deep .el-collapse-item__header {
  font-size: var(--font-size-sm);
  background-color: var(--bg-color-secondary) !important;
}

::v-deep .el-collapse-item__content {
  background-color: var(--bg-color-secondary) !important;
}

/* 响应式微调 */
@media (max-width: 480px) {
  .welcome-box p.text-2xl {
    font-size: var(--font-size-xl);
  }

  .system-cards .text-2xl {
    font-size: var(--font-size-lg);
  }

  .chat-cards .text-xl {
    font-size: var(--font-size-md);
  }

  /* 小屏幕增加行高 */
  #clg {
    line-height: var(--line-height-loose);
  }
}

/* 超大屏幕优化 */
@media (min-width: 1920px) {
  .welcome-box p.text-2xl {
    letter-spacing: 0.02em;
  }

  .log-area {
    font-size: var(--font-size-sm);
  }
}
</style>
