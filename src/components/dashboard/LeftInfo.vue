<template>
  <div class="left-info">
    <div class="top-text">在线小真寻</div>
    <div class="bot-list">
      <div v-for="bot in botList" :key="bot.id" class="bot-item">
        <div style="width: 100%">
          <div class="item-ava">
            <el-image
              :src="bot.ava_url"
              class="ava-img main-ava"
              style="width: 100px; height: 100px"
            />
            <div class="item-info">
              <div class="info-name">
                <span
                  class="line-line"
                  style="background-color: #15bb00"
                ></span>
                <span class="bot-name">{{ bot.nickname }} </span>
              </div>
              <div class="info-id">
                <span class="line-line" style="background-color: #5c87ff"></span
                >{{ bot.self_id }}
              </div>
              <div class="info-gf">
                <div style="display: flex; align-items: center">
                  <span class="info-gf-title">好友:</span>
                  <span style="margin-left: 5px; font-size: 20px">{{
                    bot.friend_count
                  }}</span>
                </div>
                <el-divider direction="vertical" />
                <div
                  style="display: flex; align-items: center; margin-left: 5px"
                >
                  <span class="info-gf-title">群组:</span>
                  <span style="margin-left: 5px; font-size: 20px">{{
                    bot.group_count
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-divider />
        <div class="bot-detail-info">
          <div style="display: flex">
            <div class="message">
              <svg-icon icon-class="call" class="bottom-icon" /><span
                class="bottom-text"
                >今日调用:
                <p class="bottom-text-value">{{ bot.day_call }}</p></span
              >
            </div>
            <div class="message">
              <svg-icon icon-class="message" class="bottom-icon" /><span
                class="bottom-text"
                >今日消息:
                <p class="bottom-text-value">
                  {{ bot.received_messages }}
                </p></span
              >
            </div>
          </div>
          <div style="display: flex; margin-top: 10px">
            <div class="message">
              <svg-icon icon-class="platform" class="bottom-icon" /><span
                class="bottom-text"
                >平台:
                <p class="bottom-text-value">{{ bot.platform }}</p></span
              >
            </div>
            <div class="message">
              <svg-icon icon-class="time" class="bottom-icon" /><span
                class="bottom-text"
                >连接时长:
                <p class="bottom-text-value">{{ bot.connectTime }}</p></span
              >
            </div>
          </div>
          <div class="message" style="font-weight: 600; margin-top: 10px">
            连接日期:
            <p class="bottom-text-value">{{ bot.connect_date }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="connect-log">
      <p class="base-title">连接日志</p>
      <el-table
        :data="tableData"
        border
        style="width: 100%; height: 233px"
        :cell-style="{ 'text-align': 'center' }"
        height="230"
      >
        <el-table-column prop="connect_time" label="日期"> </el-table-column>
        <el-table-column prop="bot_id	" label="账号">
          <template slot-scope="scope">
            <span>{{ scope.row.bot_id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="typeStr" label="类型">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.type == 1 ? 'primary' : 'danger'"
              disable-transitions
              >{{ scope.row.typeStr }}</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="float: right">
        <el-pagination
          layout="prev, pager, next"
          :total="historyTotal"
          @current-change="getConnectLog"
          :current-page.sync="historyIndex"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from "../SvgIcon/SvgIcon.vue"

export default {
  name: "LeftInfo",
  components: { SvgIcon },
  data() {
    return {
      tableData: [],
      botList: [],
      conTimes: [],
      historyIndex: 1,
      historyTotal: 0,
    }
  },
  mounted() {
    this.getBotList()
    this.getConnectLog()
  },
  methods: {
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
    addInterval(bot) {
      var timerId = setInterval(() => {
        const time = Math.floor(new Date().getTime() / 1000)
        bot.connectTime = this.formateSeconds(time - bot.connect_time)
        this.$forceUpdate()

        // 任务代码
      }, 1000)
      this.conTimes.push(timerId)
    },
    getConnectLog() {
      var loading = this.getLoading(".connect-log")
      this.postRequest(`${this.$root.prefix}/dashboard/get_connect_log`, {
        index: this.historyIndex,
        size: 5,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.tableData = resp.data.data
            this.historyTotal = resp.data.total
            for (let v of this.tableData) {
              v.typeStr = v.type == 1 ? "连接" : "断开"
            }
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    getBotList() {
      var loading = this.getLoading(".bot-list")
      this.getRequest(`${this.$root.prefix}/dashboard/get_bot_list`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.botList = resp.data
              for (let bot of this.botList) {
                bot.connectTime = "00:00"
                this.addInterval(bot)
              }
            }
          } else {
            this.$message.error(resp.info)
          }
          loading.close()
        }
      )
    },
  },
  beforeDestroy() {
    if (this.conTimes) {
      for (let timer of this.conTimes) {
        clearInterval(timer)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-divider--horizontal {
  margin: 17px 0 0 0;
}

.left-info {
  // background-color: #f4f5fa;
  height: 100%;
  padding: 0 10px;
  // min-height: 1080px;

  .top-text {
    width: 100%;
    background-color: white;
    margin-bottom: 15px;
    height: 50px;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;
    font-size: 25px;
    font-weight: 500;
    font-family: "fzrzFont";
    border-radius: 10px;
  }

  .line-line {
    width: 2px;
    background-color: #15bb00;
    margin-right: 10px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .bot-list {
    overflow: auto;
    height: calc(70% - 82px);
  }

  .bot-item {
    height: 310px;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    .item-ava {
      display: flex;
    }

    .ava-img {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      margin-top: 20px;
      margin-left: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .item-info {
      margin-left: 20px;
      margin-top: 21px;

      .info-name {
        font-size: 30px;
        font-weight: 700;
        display: flex;
      }

      .bot-name {
        white-space: nowrap; /* 防止文字换行 */
        overflow: hidden; /* 隐藏溢出的文字 */
        text-overflow: ellipsis; /* 显示省略号 */
        width: 200px; /* 设置宽度，超出部分会显示省略号 */
      }

      .info-id {
        height: 20px;
        display: flex;
        margin-top: 10px;
        font-size: 19px;
        font-weight: 500;
        color: #bfbac0;
      }

      .info-gf {
        display: flex;
        margin-top: 17px;
        font-weight: 600;

        ::v-deep .el-divider--vertical {
          margin: 0, 10px;
          height: 26px;
        }

        .info-gf-title {
          color: #b8bac0;
          font-size: 17px;
        }

        .info-gf-icon {
          width: 30px;
        }
      }
    }

    .bot-detail-info {
      padding: 20px;

      .bottom-icon {
        width: 25px;
        height: 25px;
        margin-right: 5px;
      }

      .message {
        display: flex;
        align-items: center;
        // background-color: #f4f5fa;
        width: 100%;
        height: 40px;
        color: #b8bac0;
        // box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.75);

        .bottom-text {
          font-size: 15px;
          font-weight: 600;
        }

        .bottom-text-value {
          color: #2c3e50;
          margin-left: 10px;
          font-size: 20px;
        }
      }
    }
  }

  .connect-log {
    height: 298px;
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    .base-title {
      color: #939395;
      margin-bottom: 30px;
    }
  }
}
</style>
