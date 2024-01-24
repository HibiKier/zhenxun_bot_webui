<template>
  <div class="mid-info">
    <div class="head">
      <p class="head-text">Hello 欢迎来到真寻的小房间！</p>
      <p class="head-tip">这是一场传奇的冒险旅途...</p>
    </div>
    <div class="system-status">
      <div class="system-status-item">
        <svg-icon icon-class="cpu" class="system-status-icon" />
        <span class="system-status-tip">CPU</span>
        <span class="system-status-text">{{ systemStatus.cpu }}%</span>
      </div>
      <div class="system-status-item">
        <svg-icon icon-class="memory" class="system-status-icon" />
        <span class="system-status-tip">MEMORY</span>
        <span class="system-status-text">{{ systemStatus.memory }}%</span>
      </div>
      <div class="system-status-item">
        <svg-icon icon-class="disk" class="system-status-icon" />
        <span class="system-status-tip">DISK</span>
        <span class="system-status-text">{{ systemStatus.disk }}%</span>
      </div>
    </div>
    <el-divider />
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
    <el-divider />
    <div class="title-box">
      <p class="title-text">后台日志</p>
      <span class="title-tip">虽然不知道为什么，但是视力+1</span>
    </div>
    <div class="center-log">
      <el-scrollbar style="height: 100%" ref="scr">
        <div id="clg"></div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { default as AnsiUp } from "ansi_up"
import { getPort } from "@/utils/api"
export default {
  name: "MidInfo",
  data() {
    return {
      botInfo: null,
      statusWs: null,
      systemStatus: {
        cpu: 0,
        memory: 0,
        disk: 0,
      },
      chCnt: { num: 0, day: 0, week: 0, month: 0, year: 0 },
      logWs: null,
      ansi_up: null,
      clgDiv: null,
    }
  },
  created() {
    const host = location.host.split(":")[0] || ""
    const port = getPort() || window.location.port
    this.botInfo = this.$store.state.botInfo || {}
    this.STATUS_WS_URL = `ws://${host}:${port}/zhenxun/socket/system_status` // 系统状态ws
    this.LOG_WS_URL = `ws://${host}:${port}/zhenxun/socket/logs` // 日志ws
  },
  mounted() {
    this.clgDiv = document.getElementById("clg")
    this.ansi_up = new AnsiUp()
    this.initSystemStatusWebSocket()
    this.initLogWebSocket()
    this.getChCount(this.botInfo.self_id)
  },
  beforeDestroy() {
    this.destroyWebsocket()
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
    getChCount(bot_id) {
      // 获取聊天历史记录数量
      if (bot_id) {
        const loading = this.getLoading(".ch-count")

        this.getRequest(`${this.$root.prefix}/main/get_all_ch_count`, {
          bot_id,
        }).then((resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.chCnt = resp.data
            }
          } else {
            this.$message.error(resp.info)
          }
          loading.close()
        })
      }
    },
    initLogWebSocket() {
      if (!this.logWs) {
        const loading = this.getLoading(".center-log")
        this.logWs = new WebSocket(this.LOG_WS_URL)
        this.logWs.onopen = () => {
          console.log("Log WebSocket 已连接...")
        }
        this.logWs.onmessage = this.logWsOnmessage
        this.logWs.onclose = () => {
          this.$message.warning("Log WebSocket 已断开...")
        }
        loading.close()
      }
    },
    logWsOnmessage(event) {
      let log = this.ansi_up.ansi_to_html(event.data)
      log = log.replace("color:rgb(0,0,187)", "color:rgb(55,186,255)")

      let childDom = document.createElement("div")
      childDom.innerHTML = log
      this.clgDiv.appendChild(childDom)

      this.$nextTick(() => {
        // 滚动条至底部
        const div = this.$refs["scr"].$refs["wrap"]
        div.scrollTop = div.scrollHeight
      })
    },
    initSystemStatusWebSocket() {
      if (!this.statusWs) {
        this.statusWs = new WebSocket(this.STATUS_WS_URL)
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
      this.systemStatus = JSON.parse(event.data)
    },
    destroyWebsocket() {
      if (this.statusWs && this.statusWs.readyState === WebSocket.OPEN) {
        this.statusWs.close()
      }
      if (this.logWs && this.logWs.readyState === WebSocket.OPEN) {
        this.logWs.close()
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
  padding-left: 40px;
  padding-top: 40px;

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

  .system-status {
    display: flex;
    margin-top: 50px;

    .system-status-item {
      display: flex;
      justify-content: center;
      align-items: center;

      .system-status-text {
        font-size: 20px;
        margin-right: 70px;
      }

      .system-status-icon {
        width: 30px;
        height: 30px;
        margin-right: 5px;
      }

      .system-status-tip {
        font-size: 20px;
        color: #b8bac0;
        margin-right: 15px;
      }
    }
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

  .center-log {
    height: 310px;
    width: 99%;
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
</style>
