<template>
  <div class="left-info">
    <el-row>
      <el-col :span="24">
        <div class="top-text">在线小真寻（{{ botList.length }}）</div>
        <div class="bot-list" :style="{ height: computedHeight + 'px' }">
          <div v-for="bot in botList" :key="bot.id" class="bot-item">
            <div style="width: 100%">
              <div class="item-ava">
                <el-image
                  :src="bot.ava_url"
                  class="ava-img main-ava"
                  style="width: 100px; height: 90px"
                />
                <div class="item-info">
                  <div class="info-name">
                    <span
                      class="line-line"
                      style="background-color: var(--success-color)"
                    ></span>
                    <span class="bot-name">{{ bot.nickname }} </span>
                  </div>
                  <div class="info-id">
                    <span
                      class="line-line"
                      style="background-color: var(--primary-color)"
                    ></span
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
                      style="
                        display: flex;
                        align-items: center;
                        margin-left: 5px;
                      "
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
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="connect-log" ref="connectLog">
          <p class="base-title">连接日志</p>
          <el-table
            :data="tableData"
            border
            style="width: 100%; height: 233px"
            :cell-style="{ 'text-align': 'center' }"
            height="230"
          >
            <el-table-column prop="connect_time" label="日期">
            </el-table-column>
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
          <div class="pagination">
            <el-pagination
              layout="prev, pager, next"
              :total="historyTotal"
              @current-change="getConnectLog"
              :current-page.sync="historyIndex"
              :pager-count="5"
            >
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
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
      botListHeight: 0,
    }
  },
  computed: {
    computedHeight() {
      if (!this.botListHeight) {
        this.handleResize()
      }

      return this.botListHeight
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.getBotList()
    this.getConnectLog()
    this.handleResize()
  },
  methods: {
    handleResize() {
      this.$nextTick(() => {
        this.botListHeight =
          window.innerHeight - this.$refs.connectLog.offsetHeight - 170
      })
    },
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
    window.removeEventListener("resize", this.handleResize)
    if (this.conTimes) {
      for (let timer of this.conTimes) {
        clearInterval(timer)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.left-info {
  padding: 0 20px;
  height: 100%;
  background-color: var(--bg-color);
}

.top-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 10px 0;
}

.bot-list {
  overflow: auto;
  background-color: var(--bg-color-secondary);
  padding: 15px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-lighter);
}

.bot-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color-light);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .item-ava {
    display: flex;
    align-items: center;
  }

  .ava-img {
    border-radius: 8px;
    margin-right: 15px;
    flex-shrink: 0;
  }

  .item-info {
    flex-grow: 1;
    min-width: 0;
  }

  .info-name {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    .line-line {
      width: 3px;
      height: 16px;
      border-radius: 3px;
      margin-right: 8px;
      background-color: var(--success-color);
    }
    .bot-name {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .info-id {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: var(--text-color-secondary);
    margin-bottom: 8px;
    .line-line {
       width: 3px;
       height: 12px;
       border-radius: 3px;
       margin-right: 8px;
       background-color: var(--primary-color);
    }
  }

  .info-gf {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: var(--text-color-secondary);

    .info-gf-title {
        // Style as needed
    }
    
    ::v-deep .el-divider--vertical {
        background-color: var(--border-color);
        height: 1.2em;
    }
    
    span {
       font-size: 16px !important;
       color: var(--text-color);
    }
  }

  .bot-detail-info {
    margin-top: 10px;
    .message {
        flex: 1;
        color: var(--text-color-secondary);
        font-size: 13px;
    }
    .bottom-icon {
        margin-right: 5px;
        vertical-align: -2px;
    }
    .bottom-text-value {
        display: inline-block;
        margin-left: 5px;
        font-weight: 600;
        color: var(--text-color);
        font-size: 14px;
    }
  }
}

.connect-log {
  margin-top: 20px;
  background-color: var(--bg-color-secondary);
  padding: 15px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-lighter);

  .base-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 10px;
  }

  .pagination {
      margin-top: 15px;
      text-align: center;
  }

  ::v-deep .el-table,
  ::v-deep .el-table__expanded-cell {
    background-color: transparent; /* Use parent background */
  }

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent;
    color: var(--text-color-regular);
    border-color: var(--border-color-light);
  }

  ::v-deep .el-table--border::after,
  ::v-deep .el-table--group::after,
  ::v-deep .el-table::before {
      background-color: var(--border-color-light);
  }

  ::v-deep .el-table th.is-leaf,
  ::v-deep .el-table td {
      border-bottom: 1px solid var(--border-color-light);
  }

  ::v-deep .el-table--border th,
  ::v-deep .el-table--border td {
      border-right: 1px solid var(--border-color-light);
  }

  ::v-deep .el-table thead {
      color: var(--text-color-primary);
  }

  ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: var(--bg-color); /* Slightly darker background on hover */
  }

  ::v-deep .el-pagination {
    color: var(--text-color-regular);
  }

  ::v-deep .el-pagination button,
  ::v-deep .el-pager li {
    background: var(--bg-color-secondary);
    color: var(--text-color-regular);
    &:hover {
      color: var(--primary-color);
    }
    &:focus {
      outline: none; /* Optional: remove focus outline if desired */
    }
  }

  ::v-deep .el-pager li.active {
    background: var(--primary-color);
    color: white;
    &:hover {
       color: white;
    }
  }

  ::v-deep .el-pagination button:disabled {
     color: var(--text-color-placeholder);
     background-color: var(--bg-color);
     cursor: not-allowed;
     &:hover {
       color: var(--text-color-placeholder);
     }
  }
}
</style>
