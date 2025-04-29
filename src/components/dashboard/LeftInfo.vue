<template>
  <div class="left-info">
    <el-row>
      <el-col :span="24">
        <div class="top-text">
          <svg-icon icon-class="bot" class="mr-2 text-pink-500" />
          在线小真寻（{{ botList.length }}）
        </div>
        <div class="bot-list" :style="{ height: computedHeight + 'px' }">
          <div v-for="bot in botList" :key="bot.id" class="bot-item">
            <div style="width: 100%">
              <div class="item-ava">
                <el-image
                  :src="bot.ava_url"
                  class="ava-img main-ava"
                  style="width: 100px; height: 100px"
                  :preview-src-list="[bot.ava_url]"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div class="item-info">
                  <div class="info-name">
                    <span class="line-line bg-pink-400"></span>
                    <span class="bot-name">{{ bot.nickname }} </span>
                    <span
                      v-if="bot.is_online"
                      class="status-badge bg-green-400"
                    >
                      <i class="el-icon-success mr-1"></i>在线
                    </span>
                    <span v-else class="status-badge bg-gray-400">
                      <i class="el-icon-error mr-1"></i>离线
                    </span>
                  </div>
                  <div class="info-id">
                    <span class="line-line bg-purple-400"></span>
                    <span class="text-purple-500">ID: {{ bot.self_id }}</span>
                  </div>
                  <div class="info-gf">
                    <div class="gf-item">
                      <svg-icon icon-class="friend" class="text-blue-400" />
                      <span class="gf-value">{{ bot.friend_count }}</span>
                    </div>
                    <el-divider direction="vertical" />
                    <div class="gf-item">
                      <svg-icon icon-class="group" class="text-green-400" />
                      <span class="gf-value">{{ bot.group_count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-divider class="divider-custom" />
            <div class="bot-detail-info">
              <div class="detail-row">
                <div class="message">
                  <svg-icon
                    icon-class="call"
                    class="icon-custom text-pink-500"
                  />
                  <div class="message-content">
                    <span class="message-title">今日调用</span>
                    <span class="message-value">{{ bot.day_call }}</span>
                  </div>
                </div>
                <div class="message">
                  <svg-icon
                    icon-class="message"
                    class="icon-custom text-blue-500"
                  />
                  <div class="message-content">
                    <span class="message-title">今日消息</span>
                    <span class="message-value">{{
                      bot.received_messages
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="detail-row">
                <div class="message">
                  <svg-icon
                    icon-class="platform"
                    class="icon-custom text-purple-500"
                  />
                  <div class="message-content">
                    <span class="message-title">平台</span>
                    <span class="message-value">{{ bot.platform }}</span>
                  </div>
                </div>
                <div class="message">
                  <svg-icon
                    icon-class="time"
                    class="icon-custom text-green-500"
                  />
                  <div class="message-content">
                    <span class="message-title">连接时长</span>
                    <span class="message-value">{{ bot.connectTime }}</span>
                  </div>
                </div>
              </div>
              <div class="connect-date">
                <svg-icon icon-class="calendar" class="mr-2 text-yellow-500" />
                <span>连接日期: {{ bot.connect_date }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="connect-log" ref="connectLog">
          <p class="base-title">
            <svg-icon icon-class="log" class="mr-2 text-pink-500" />
            连接日志
          </p>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            height="230"
            class="log-table"
          >
            <el-table-column
              prop="connect_time"
              label="日期"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <span class="text-purple-500">{{
                  scope.row.connect_time
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="bot_id" label="账号" align="center">
              <template slot-scope="scope">
                <span class="text-blue-500">{{ scope.row.bot_id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="typeStr" label="类型" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.type == 1 ? 'success' : 'danger'"
                  effect="dark"
                  class="tag-custom"
                >
                  <svg-icon
                    :icon-class="scope.row.type == 1 ? 'success' : 'error'"
                    class="mr-1"
                  />
                  {{ scope.row.typeStr }}
                </el-tag>
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
              background
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
      let secondTime = parseInt(endTime)
      let min = 0
      let h = 0
      let result = ""
      if (secondTime > 60) {
        min = parseInt(secondTime / 60)
        secondTime = parseInt(secondTime % 60)
        if (min > 60) {
          h = parseInt(min / 60)
          min = parseInt(min % 60)
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
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
}

.top-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin: 15px 0;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.bot-list {
  overflow: auto;
  background-color: var(--bg-color-secondary);
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--primary-color);
    border-radius: 3px;
  }
}

.bot-item {
  margin-bottom: 20px;
  padding: 15px;
  background: var(--bg-color);
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  .item-ava {
    display: flex;
    align-items: center;
  }

  .ava-img {
    border-radius: 12px;
    margin-right: 15px;
    flex-shrink: 0;
    border: 3px solid rgba(236, 72, 153, 0.2);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      border-color: var(--primary-color);
    }
  }

  .item-info {
    flex-grow: 1;
    min-width: 0;
  }

  .info-name {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    position: relative;

    .line-line {
      width: 4px;
      height: 18px;
      border-radius: 4px;
      margin-right: 10px;
    }

    .bot-name {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 10px;
    }

    .status-badge {
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
      color: white;
      display: inline-flex;
      align-items: center;
    }
  }

  .info-id {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 10px;

    .line-line {
      width: 4px;
      height: 14px;
      border-radius: 4px;
      margin-right: 10px;
    }
  }

  .info-gf {
    display: flex;
    align-items: center;
    gap: 15px;

    .gf-item {
      display: flex;
      align-items: center;
      font-size: 14px;

      .gf-value {
        margin-left: 5px;
        font-weight: 600;
        font-size: 16px;
        color: var(--text-color);
      }
    }

    ::v-deep .el-divider--vertical {
      background-color: var(--border-color);
      height: 1.2em;
    }
  }

  .divider-custom {
    margin: 12px 0;
    background-color: var(--border-color-light);
  }

  .bot-detail-info {
    .detail-row {
      display: flex;
      gap: 15px;
      margin-bottom: 12px;
    }

    .message {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background: rgba(236, 72, 153, 0.05);
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(236, 72, 153, 0.1);
      }

      .icon-custom {
        font-size: 20px;
        margin-right: 10px;
      }

      .message-content {
        display: flex;
        flex-direction: column;
      }

      .message-title {
        font-size: 12px;
        color: var(--text-color-secondary);
        margin-bottom: 2px;
      }

      .message-value {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-color);
      }
    }

    .connect-date {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background: rgba(255, 193, 7, 0.05);
      border-radius: 8px;
      font-size: 14px;
      color: var(--text-color);
      margin-top: 10px;
    }
  }
}

.connect-log {
  margin-top: 20px;
  background-color: var(--bg-color-secondary);
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  .base-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 1px dashed var(--border-color-light);
  }

  .pagination {
    margin-top: 15px;
    display: flex;
    justify-content: center;
  }

  .log-table {
    ::v-deep {
      th.el-table__cell {
        background-color: rgba(236, 72, 153, 0.1) !important;
        color: var(--text-color);
        font-weight: 600;
      }

      .el-table__row {
        background-color: var(--bg-color);

        &:hover {
          background-color: rgba(236, 72, 153, 0.05) !important;
        }
      }

      .el-table--border {
        border-radius: 8px;
        overflow: hidden;
      }

      .el-tag {
        border-radius: 12px;
        padding: 0 10px;
        height: 26px;
        line-height: 26px;
      }
    }
  }
}

.tag-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

@media (max-width: 768px) {
  .left-info {
    padding: 0 10px;
  }

  .bot-item {
    padding: 10px;
  }

  .item-ava {
    flex-direction: column;
    align-items: flex-start !important;

    .ava-img {
      margin-right: 0;
      margin-bottom: 10px;
    }
  }

  .detail-row {
    flex-direction: column;
    gap: 8px !important;
  }
}
</style>
