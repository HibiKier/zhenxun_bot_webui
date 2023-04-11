<template>
  <div class="main-border">
    <div class="center-border">
      <div class="top-info">
        <div class="info-item">
          <div class="gf-item">
            <svg-icon icon-class="friend" />
            <span class="gf-text">好友</span>
            <span>{{ botInfo.friend_count }}</span>
          </div>
          <el-divider></el-divider>
          <div class="gf-item">
            <svg-icon icon-class="group" />
            <span>群聊数量</span>
            <span>{{ botInfo.group_count }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="msg-item">
            <!-- <svg-icon icon-class="friend" /> -->
            <span>接收消息</span>
            <span>{{ botInfo.received_messages }}</span>
          </div>
          <div class="msg-item">
            <!-- <svg-icon icon-class="group" /> -->
            <span>日接收消息</span>
            <span>{{ botInfo.received_messages_day }}</span>
          </div>
          <div class="msg-item">
            <!-- <svg-icon icon-class="group" /> -->
            <span>周接收消息</span>
            <span>{{ botInfo.received_messages_week }}</span>
          </div>
          <div class="msg-item">
            <!-- <svg-icon icon-class="group" /> -->
            <span>月接收消息</span>
            <span>{{ botInfo.received_messages_month }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="msg-item">
            <!-- <svg-icon icon-class="friend" /> -->
            <span>加载插件</span>
            <span>{{ botInfo.plugin_count }}</span>
          </div>
          <div class="msg-item">
            <!-- <svg-icon icon-class="group" /> -->
            <span>加载成功</span>
            <span>{{ botInfo.success_plugin_count }}</span>
          </div>
          <div class="msg-item">
            <!-- <svg-icon icon-class="group" /> -->
            <span>加载失败</span>
            <span>{{ botInfo.fail_plugin_count }}</span>
          </div>
        </div>
      </div>
      <div class="center-log">
        <el-scrollbar style="height: 100%" ref="scr" >
          <div id="clg" ></div>
          <!-- <p v-for="(log, index) in logs" :key="index">
            {{ log }}
          </p> -->
        </el-scrollbar>
      </div>
    </div>
    <div class="right-manage">
      <div
        v-for="bot in botList"
        :key="bot.self_id"
        :class="{ 'bot-border': true, active: bot.is_select }"
      >
        <el-image :src="bot.ava_url" class="ava-img" />
        <div class="bot-name">
          <p>{{ bot.nickname }}</p>
          <span class="self-id">{{ bot.self_id }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { default as AnsiUp } from "ansi_up"

export default {
  name: "MainCommand",

  data() {
    return {
      botList: [],
      botInfo: {},
      ws: null,
      logs: [],
      logTxt: "",
      ansi_up: null,
      clgDiv: null
    }
  },
  mounted() {
    this.clgDiv = document.getElementById("clg");
    this.ansi_up = new AnsiUp()
    this.WS_URL = "ws://localhost:8080/logs"
    this.getBotInfo()
    this.initWebSocket()
  },
  methods: {
    initWebSocket() {
      this.ws = new WebSocket(this.WS_URL)
      this.ws.onopen = this.wsOnopen
      this.ws.onmessage = this.wsOnmessage
      this.ws.onerror = this.wsOnerror
      this.ws.onclose = this.wsClose
    },
    wsOnopen() {
      console.log("WebSocket 已连接")
    },
    wsOnmessage(event) {
      const log = this.ansi_up.ansi_to_html(event.data)
      let childDom = document.createElement("div")
      childDom.innerHTML = log
      this.clgDiv.appendChild(childDom)

      this.$nextTick(() => {
        // 滚动条至底部
        const div = this.$refs["scr"].$refs["wrap"]
        console.log(div)
        div.scrollTop = div.scrollHeight
      })
    },
    wsOnerror() {},
    // 连接关闭后的回调
    wsClose() {},
    // 向服务器发送数据
    wsSend(data) {
      console.log("clickkk", data)
    },
    getBotInfo(self_id = "") {
      this.getRequest("/zhenxun/api/get_bot_info?self_id=" + self_id).then(
        (resp) => {
          if (resp.suc) {
            this.$message.success(resp.info)
            this.botList = resp.data
            for (const bot of this.botList) {
              if (bot.is_select) {
                this.botInfo = bot
                break
              }
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.main-border {
  background-color: #edf0f3;
  width: 100%;
  height: 100%;
  position: relative;
  float: left;

  .self-id {
    color: #abb0ae;
    font-size: small;
  }

  .bot-name {
    margin-left: 60px;
    margin-top: 4px;
  }

  .ava-img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    float: left;
    margin-left: 10px;
  }

  .bot-border {
    width: 100%;
    height: 50px;
    align-items: center;
    float: left;
    padding-top: 5px;
  }

  .bot-border:hover {
    background-color: #e4e3e5;
    cursor: pointer;
  }

  .active {
    background-color: #e4e3e5;
  }

  .center-border {
    height: 100%;
    width: calc(100% - 311px);
    float: left;

    .top-info {
      // background-color: #fff;
      height: 20%;
      align-content: center;
      justify-content: center;
      display: flex;

      .info-item {
        width: 200px;
        height: 180px;
        // background-color: #edf0f3;
        background-color: #fff;
        margin: auto 10px;
        border-radius: 10px;

        .svg-icon {
          width: 35px;
          height: 35px;
          margin-top: 10px;
        }

        .gf-item {
          height: 50%;
          justify-content: center;
          align-content: center;
          display: flex;

          .gf-text {
            // font-size: 30px;
            // font-weight: 600;
          }
        }

        .msg-item {
        }

        /deep/ .el-divider--horizontal {
          margin: 0;
        }
      }
    }

    .center-log {
      height: 600px;
      width: 99%;
      background-color: #24292f;
      border-radius: 10px;
      padding: 10px;
      white-space: pre-wrap;

      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }

  .right-manage {
    height: 100%;
    width: 280px;
    background-color: #fff;
    position: absolute;
    right: 10px;
  }
}
</style>
