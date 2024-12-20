<template>
  <div class="mid-info" :style="{ height: computedHeight + 'px' }">
    <div class="top-area-info" ref="topAreaInfo">
      <div class="head">
        <p
          class="head-text"
          :style="{ fontSize: fontSizeMana.headText + 'px' }"
        >
          Hello 欢迎来到真寻的小房间！
        </p>
        <p class="head-tip" :style="{ fontSize: fontSizeMana.titleTip + 'px' }">
          这是一场传奇的冒险旅途...
        </p>
      </div>
      <div class="top-area-info">
        <div class="system-status">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="system-status-border">
                <div class="system-status-item">
                  <svg-icon icon-class="cpu" class="system-status-icon" />
                  <span
                    class="system-status-tip"
                    :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                    >CPU</span
                  >
                </div>
                <div
                  class="system-status-text"
                  :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                >
                  <p>{{ systemStatus.cpu }}%</p>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="system-status-border">
                <div class="system-status-item">
                  <svg-icon icon-class="memory" class="system-status-icon" />
                  <span
                    class="system-status-tip"
                    :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                    >MEMORY</span
                  >
                </div>
                <div
                  class="system-status-text"
                  :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                >
                  <p>{{ systemStatus.memory }}%</p>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="system-status-border">
                <div class="system-status-item">
                  <svg-icon icon-class="disk" class="system-status-icon" />
                  <span
                    class="system-status-tip"
                    :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                    >DISK</span
                  >
                </div>
                <div
                  class="system-status-text"
                  :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                >
                  <p>{{ systemStatus.disk }}%</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="chat-count">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="chat-count-border">
                <div class="chat-count-item">
                  <span
                    class="chat-count-status-tip"
                    :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                    >消息总数:</span
                  >
                </div>
                <div
                  class="chat-count-status-text"
                  :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                >
                  <p>{{ chatAndCall.chat_num }}</p>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="chat-count-border">
                <div class="chat-count-item">
                  <span
                    class="chat-count-status-tip"
                    :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                    >今日消息:</span
                  >
                </div>
                <div
                  class="chat-count-status-text"
                  :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                >
                  <p>{{ chatAndCall.chat_day }}</p>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="chat-count-border">
                <div class="chat-count-item">
                  <span
                    class="chat-count-status-tip"
                    :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                    >调用总数:</span
                  >
                </div>
                <div
                  class="chat-count-status-text"
                  :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                >
                  <p>{{ chatAndCall.call_num }}</p>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="chat-count-border">
                <div class="chat-count-item">
                  <span
                    class="chat-count-status-tip"
                    :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                    >今日调用:</span
                  >
                </div>
                <div
                  class="chat-count-status-text"
                  :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                >
                  <p>{{ chatAndCall.call_day }}</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-collapse @change="handleChange" style="border-top: none">
          <el-collapse-item title="查看更多...">
            <div class="detail-count">
              <el-row :gutter="10">
                <el-col :span="4">
                  <div class="chat-count-border">
                    <div class="chat-count-item">
                      <span
                        class="chat-count-status-tip"
                        :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                        >一周内消息:</span
                      >
                    </div>
                    <div
                      class="chat-count-status-text"
                      :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                    >
                      <p>{{ allChatAndCall.chat_week }}</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="chat-count-border">
                    <div class="chat-count-item">
                      <span
                        class="chat-count-status-tip"
                        :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                        >一月内消息:</span
                      >
                    </div>
                    <div
                      class="chat-count-status-text"
                      :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                    >
                      <p>{{ allChatAndCall.chat_month }}</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="chat-count-border">
                    <div class="chat-count-item">
                      <span
                        class="chat-count-status-tip"
                        :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                        >一年内消息:</span
                      >
                    </div>
                    <div
                      class="chat-count-status-text"
                      :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                    >
                      <p>{{ allChatAndCall.chat_year }}</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="chat-count-border">
                    <div class="chat-count-item">
                      <span
                        class="chat-count-status-tip"
                        :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                        >一周内调用:</span
                      >
                    </div>
                    <div
                      class="chat-count-status-text"
                      :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                    >
                      <p>{{ allChatAndCall.call_week }}</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="chat-count-border">
                    <div class="chat-count-item">
                      <span
                        class="chat-count-status-tip"
                        :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                        >一月内调用:</span
                      >
                    </div>
                    <div
                      class="chat-count-status-text"
                      :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                    >
                      <p>{{ allChatAndCall.call_month }}</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="chat-count-border">
                    <div class="chat-count-item">
                      <span
                        class="chat-count-status-tip"
                        :style="{ fontSize: fontSizeMana.statusTip + 'px' }"
                        >一年内调用:</span
                      >
                    </div>
                    <div
                      class="chat-count-status-text"
                      :style="{ fontSize: fontSizeMana.statusText + 'px' }"
                    >
                      <p>{{ allChatAndCall.call_year }}</p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="chart">
              <div ref="chatChart" class="base-chart"></div>
              <div
                ref="callChart"
                class="base-chart"
                style="margin-left: 40px"
              ></div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div
      class="log-border"
      :style="{ height: computedCenterLogBorderHeight + 'px' }"
    >
      <div class="title-box" ref="titleBox">
        <p
          class="title-text"
          :style="{ fontSize: fontSizeMana.titleText + 'px' }"
        >
          后台日志
        </p>
        <span
          class="title-tip"
          :style="{ fontSize: fontSizeMana.titleTip + 'px' }"
          >虽然不知道为什么，但是视力+1</span
        >
      </div>
      <div
        class="center-log"
        :style="{ height: computedCenterLogHeight + 'px' }"
      >
        <el-scrollbar style="height: 100%" ref="dashBoardScrollbar">
          <div id="clg"></div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { default as AnsiUp } from "ansi_up"
import { mapGetters } from "vuex"
import { getHeaderHeight, getFontSize } from "@/utils/utils"
export default {
  name: "MidInfo",
  data() {
    return {
      fontSizeMana: {
        headText: 27,
        statusText: 35,
        statusTip: 20,
        titleText: 17,
        titleTip: 12,
      },
      centerLogHeight: 0,
      centerLogBorderHeight: 0,
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
      chatCntInterval: null, //聊天数量定时器
      chatChart: null,
      callChart: null,
      chartOpt: {
        title: {
          text: "ECharts 示例标题", // 主标题文本
          subtext: "30天内记录次数", // 副标题文本
          left: "center", // 标题水平位置
          textStyle: {
            // 主标题样式
            color: "#2C3E50",
          },
        },
        xAxis: {
          type: "category",
          name: "日期",
          data: [],
        },
        yAxis: {
          type: "value",
          name: "次数",
        },
        tooltip: {
          trigger: "axis",
        },
        series: [
          {
            data: [],
            type: "line",
            smooth: true,
          },
        ],
      },
    }
  },
  computed: {
    computedCenterLogBorderHeight() {
      if (!this.centerLogBorderHeight) {
        this.handleResize()
      }
      return this.centerLogBorderHeight
    },
    computedCenterLogHeight() {
      if (!this.centerLogHeight) {
        this.handleResize()
      }
      return this.centerLogHeight
    },
    computedHeight() {
      return this.windowHeight - getHeaderHeight()
    },
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
    this.initFontSize()
    this.$store.dispatch("initLogSocket", this.logCallable)
  },
  beforeDestroy() {
    this.destroyWebsocket()
    if (this.chatCntInterval) {
      clearInterval(this.chatCntInterval)
    }
  },
  methods: {
    initFontSize() {
      this.fontSizeMana.headText = getFontSize(27)
      this.fontSizeMana.statusText = getFontSize(35)
      this.fontSizeMana.statusTip = getFontSize(20)
      this.fontSizeMana.titleText = getFontSize(17)
      this.fontSizeMana.titleTip = getFontSize(12)
    },
    handleResize() {
      this.windowHeight = window.innerHeight
      this.initFontSize()
      this.$nextTick(() => {
        this.centerLogBorderHeight =
          window.innerHeight -
          this.$refs.topAreaInfo.offsetHeight -
          getHeaderHeight() -
          20
        this.centerLogHeight =
          this.centerLogBorderHeight -
          this.$refs.titleBox.offsetHeight -
          getHeaderHeight() -
          20
      })
    },
    handleChange(a) {
      if (a.length) {
        this.getMonthChatAndCallCount()
        this.getAllChatAndCallCount()
      }
    },
    getAllChatAndCallCount() {
      var loading = this.getLoading(".detail-count")
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
      var loading = this.getLoading(".chart")
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
      // 获取聊天历史记录数量
      if (!no_loading) {
        var loading = this.getLoading(".ch-count")
      }
      this.getRequest(
        `${this.$root.prefix}/dashboard/get_chat_and_call_count`
      ).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            if (loading) {
              this.$message.warning(resp.warning)
            }
          } else {
            if (loading) {
              this.$message.success(resp.info)
            }
            this.chatAndCall = resp.data
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
        // 滚动条至底部
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

<style lang="scss" scoped>
::v-deep .el-divider--horizontal {
  margin: 74px 0;
}

.mid-info {
  border-radius: 10px;

  .top-area-info {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
  }

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

  /deep/ .el-collapse-item__header {
    font-size: 14px;
    border-bottom: none;
    float: right;
    height: 30px;
    margin-top: 8px;
    color: #a4a6ab;
  }

  /deep/ .el-collapse-item__header .el-collapse-item__arrow {
    display: none;
  }

  /deep/ .el-collapse-item__content {
    margin-top: 20px;
  }

  /deep/ .el-collapse-item__wrap {
    width: 100%;
  }

  .system-status {
    margin-top: 50px;
    background-color: white;

    .system-status-border {
      background-color: #f5f6f8;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .system-status-item {
        display: flex;
        align-items: center;

        .system-status-icon {
          width: 30px;
          height: 30px;
          margin-right: 5px;
        }

        .system-status-tip {
          font-size: 20px;
          color: #a4a6ab;
          margin-right: 15px;
        }
      }

      .system-status-text {
        font-size: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .chat-count {
    margin-top: 15px;

    .chat-count-border {
      background-color: #f5f6f8;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .chat-count-status-tip {
        color: #a4a6ab;
        font-size: 20px;
      }

      .chat-count-status-text {
        font-size: 35px;
        // margin-left: 20px;
        margin-top: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .detail-count {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;

    .chat-count-border {
      background-color: #f5f6f8;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .chat-count-status-tip {
        color: #a4a6ab;
        font-size: 20px;
      }

      .chat-count-status-text {
        font-size: 35px;
        // margin-left: 20px;
        // margin-top: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .title-box {
    margin-top: 5px;
    margin-bottom: 30px;
    display: flex;

    .title-text {
      // font-size: 17px;
    }
    .title-tip {
      color: #acafb8;
      font-size: 12px;
      margin-top: 6px;
      margin-left: 25px;
    }
  }

  .log-border {
    background-color: white;
    padding: 30px;
    margin-top: 20px;
    border-radius: 10px;
    box-sizing: border-box;

    .center-log {
      background-color: #282c34;
      border-radius: 10px;
      padding: 10px;
      white-space: pre-wrap;
      color: #ffffff;

      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }

  .chart {
    display: flex;
    height: 500px;
    padding: 30px;
    justify-content: space-between;

    .base-chart {
      width: 100%;
      height: 500px;
    }

    canvas {
      width: 100%;
    }
  }

  /deep/ .el-collapse {
    border: none;
  }

  /deep/ .el-collapse-item__content {
    margin-bottom: 0;
  }
}
</style>
