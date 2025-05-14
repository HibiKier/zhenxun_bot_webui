<template>
  <div
    class="left-info-container p-4 h-full"
    ref="leftInfoContainer"
    :style="{ backgroundColor: 'var(--el-fill-color-light)' }"
  >
    <el-row ref="firstRow">
      <el-col :span="24">
        <div
          class="top-text flex items-center"
          :style="{ color: 'var(--el-color-primary)' }"
        >
          <svg-icon icon-class="bot" class="icon-bot" />
          在线小真寻（{{ botList.length }}）
        </div>
        <div
          class="bot-list"
          :style="{
            height: computedHeight + 'px',
            backgroundColor: 'var(--el-bg-color)',
          }"
        >
          <div
            v-for="bot in botList"
            :key="bot.id"
            class="bot-item"
            :style="{ backgroundColor: 'var(--el-bg-color)' }"
          >
            <div style="width: 100%">
              <div class="item-ava">
                <el-image
                  :src="bot.ava_url"
                  class="ava-img"
                  :preview-src-list="[bot.ava_url]"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div class="item-info">
                  <div class="info-name">
                    <span
                      class="line-line"
                      :style="{ backgroundColor: 'var(--el-color-primary)' }"
                    ></span>
                    <span
                      class="bot-name"
                      :style="{ color: 'var(--el-text-color-primary)' }"
                      >{{ bot.nickname }}</span
                    >
                  </div>
                  <div class="info-id">
                    <span
                      class="line-line"
                      :style="{
                        backgroundColor: 'var(--el-color-primary-light-3)',
                      }"
                    ></span>
                    <span
                      class="purple-text"
                      :style="{ color: 'var(--el-color-primary-light-3)' }"
                      >ID: {{ bot.self_id }}</span
                    >
                  </div>
                </div>
              </div>
              <div
                class="info-gf rounded-lg p-3 shadow-sm mt-3"
                :style="{ backgroundColor: 'var(--el-bg-color)' }"
              >
                <div class="flex space-x-3">
                  <div
                    class="gf-item flex-1 flex items-center justify-between rounded-md p-2"
                    :style="{ backgroundColor: 'var(--el-fill-color-lighter)' }"
                  >
                    <div class="flex items-center">
                      <svg-icon
                        icon-class="friend"
                        class="blue-icon mr-2"
                        color="var(--el-color-primary)"
                      />
                      <span
                        class="text-gray-600"
                        :style="{ color: 'var(--el-text-color-regular)' }"
                        >好友</span
                      >
                    </div>
                    <span
                      class="gf-value font-semibold"
                      :style="{ color: 'var(--el-color-primary)' }"
                      >{{ bot.friend_count }}</span
                    >
                  </div>
                  <div
                    class="gf-item flex-1 flex items-center justify-between rounded-md p-2"
                    :style="{ backgroundColor: 'var(--el-fill-color-lighter)' }"
                  >
                    <div class="flex items-center">
                      <svg-icon
                        icon-class="group"
                        class="green-icon mr-2"
                        color="var(--el-color-success)"
                      />
                      <span
                        class="text-gray-600"
                        :style="{ color: 'var(--el-text-color-regular)' }"
                        >群组</span
                      >
                    </div>
                    <span
                      class="gf-value font-semibold"
                      :style="{ color: 'var(--el-color-success)' }"
                      >{{ bot.group_count }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <el-divider class="custom-divider" />
            <div class="bot-detail-info">
              <div class="detail-row">
                <div
                  class="message"
                  :style="{ backgroundColor: 'var(--el-fill-color-lighter)' }"
                >
                  <svg-icon
                    icon-class="call"
                    class="pink-icon"
                    color="var(--el-color-primary)"
                  />
                  <div class="message-content">
                    <span
                      class="message-title"
                      :style="{ color: 'var(--el-text-color-secondary)' }"
                      >今日调用</span
                    >
                    <span
                      class="message-value"
                      :style="{ color: 'var(--el-text-color-primary)' }"
                      >{{ bot.day_call }}</span
                    >
                  </div>
                </div>
                <div
                  class="message"
                  :style="{ backgroundColor: 'var(--el-fill-color-lighter)' }"
                >
                  <svg-icon
                    icon-class="message1"
                    class="pink-icon"
                    color="var(--el-color-primary)"
                  />
                  <div class="message-content">
                    <span
                      class="message-title"
                      :style="{ color: 'var(--el-text-color-secondary)' }"
                      >今日消息</span
                    >
                    <span
                      class="message-value"
                      :style="{ color: 'var(--el-text-color-primary)' }"
                      >{{ bot.received_messages }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="detail-row">
                <div
                  class="message"
                  :style="{ backgroundColor: 'var(--el-fill-color-lighter)' }"
                >
                  <svg-icon
                    icon-class="platform"
                    class="pink-icon"
                    color="var(--el-color-primary)"
                  />
                  <div class="message-content">
                    <span
                      class="message-title"
                      :style="{ color: 'var(--el-text-color-secondary)' }"
                      >所属平台</span
                    >
                    <span
                      class="message-value"
                      :style="{ color: 'var(--el-text-color-primary)' }"
                      >{{ bot.platform }}</span
                    >
                  </div>
                </div>
                <div
                  class="message"
                  :style="{ backgroundColor: 'var(--el-fill-color-lighter)' }"
                >
                  <svg-icon
                    icon-class="time"
                    class="pink-icon"
                    color="var(--el-color-primary)"
                  />
                  <div class="message-content">
                    <span
                      class="message-title"
                      :style="{ color: 'var(--el-text-color-secondary)' }"
                      >连接时长</span
                    >
                    <span
                      class="message-value"
                      :style="{ color: 'var(--el-text-color-primary)' }"
                      >{{ bot.connectTime }}</span
                    >
                  </div>
                </div>
              </div>
              <div
                class="connect-date"
                :style="{ backgroundColor: 'var(--el-fill-color-lighter)' }"
              >
                <svg-icon
                  icon-class="calendar"
                  class="yellow-icon"
                  :style="{ color: 'var(--el-color-warning)' }"
                />
                <span :style="{ color: 'var(--el-text-color-primary)' }"
                  >连接日期: {{ bot.connect_date }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div
          class="connect-log"
          ref="connectLog"
          :style="{ backgroundColor: 'var(--el-bg-color)' }"
        >
          <p
            class="base-title flex items-center"
            ref="logTitle"
            :style="{ color: 'var(--el-color-primary)' }"
          >
            <svg-icon icon-class="log" class="icon-log" />
            连接日志
          </p>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            :height="tableHeight"
            class="log-table"
          >
            <el-table-column
              prop="connect_time"
              label="日期"
              min-width="100"
              align="center"
            >
              <template slot-scope="scope">
                <span :style="{ color: 'var(--el-color-primary-light-3)' }">{{
                  scope.row.connect_time
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="bot_id" label="账号" align="center">
              <template slot-scope="scope">
                <span :style="{ color: 'var(--el-color-primary)' }">{{
                  scope.row.bot_id
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="typeStr"
              label="类型"
              align="center"
              min-width="90px"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.type == 1 ? 'success' : 'danger'"
                  effect="dark"
                  class="custom-tag"
                >
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
              class="anime-pagination"
              background
              small
              :pager-count="$isMobile() ? 3 : 5"
            />
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
      tableHeight: 230, // 默认高度
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
    window.addEventListener("resize", this.calculateTableHeight)
    window.addEventListener("resize", this.handleResize)
    this.getBotList()
    this.getConnectLog()
    this.handleResize()
  },
  methods: {
    formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M"
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K"
      }
      return num.toString()
    },
    calculateTableHeight() {
      this.$nextTick(() => {
        // 获取父容器总高度
        const containerHeight = this.$refs.leftInfoContainer.clientHeight

        // 获取第一个el-row的高度
        const firstRowHeight = this.$refs.firstRow.$el.clientHeight

        // 获取日志标题高度
        const logTitleHeight = this.$refs.logTitle.clientHeight

        // 获取connect-log的padding和margin
        const connectLog = this.$refs.connectLog
        const connectLogStyle = window.getComputedStyle(connectLog)
        const paddingTop = parseFloat(connectLogStyle.paddingTop)
        const paddingBottom = parseFloat(connectLogStyle.paddingBottom)
        const marginTop = parseFloat(connectLogStyle.marginTop)

        // 计算剩余可用高度
        const availableHeight =
          containerHeight -
          firstRowHeight -
          logTitleHeight -
          paddingTop -
          paddingBottom -
          marginTop -
          90 // 40是分页和额外间距的估计值

        // 设置最小高度限制
        this.tableHeight = availableHeight
      })
    },
    handleResize() {
      this.$nextTick(() => {
        this.calculateTableHeight()
        this.botListHeight =
          window.innerHeight - this.$refs.connectLog.offsetHeight - 170
        this.botListHeight = Math.max(this.botListHeight, 300)
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
    window.removeEventListener("resize", this.calculateTableHeight)
  },
}
</script>

<style scoped>
.left-info-container {
  height: 100%;
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
  font-size: var(--font-size-md);
}

.top-text {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  border-left: 4px solid var(--el-color-primary);
}

.icon-bot {
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
  color: var(--el-color-primary);
}

.bot-list {
  overflow: auto;
  padding: 1em;
  border-radius: 0.75em;
  box-shadow: var(--el-box-shadow-light);
}

.bot-item {
  margin-bottom: 1.25em;
  padding: 1em;
  border-radius: 0.625em;
  box-shadow: var(--el-box-shadow-lighter);
  transition: all 0.3s ease;
}

.bot-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--el-box-shadow-light);
}

.item-ava {
  display: flex;
  align-items: flex-start;
}

.ava-img {
  width: 6.25em;
  height: 6.25em;
  border-radius: 0.75em;
  margin-right: 1em;
  border: 0.1875em solid var(--el-color-primary-light-8);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.ava-img:hover {
  transform: scale(1.05);
  border-color: var(--el-color-primary);
}

.image-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.item-info {
  flex-grow: 1;
  min-width: 0;
}

.info-name {
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
}

.line-line {
  width: 0.25em;
  height: 1.125em;
  border-radius: 0.25em;
  margin-right: 0.625em;
}

.bot-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-id {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  margin-bottom: 0.625em;
}

.info-gf {
  width: 100%;
}

.gf-item {
  font-size: var(--font-size-sm);
  width: 100%;
  transition: all 0.3s ease;
}

.gf-item:hover {
  transform: translateY(-1px);
  box-shadow: var(--el-box-shadow-lighter);
}

.gf-value {
  font-weight: 600;
  font-size: var(--font-size-md);
}

.custom-divider {
  margin: 0.75em 0;
  background-color: var(--el-border-color-light);
}

.bot-detail-info {
  padding-top: 0.625em;
}

.detail-row {
  display: flex;
  gap: 1em;
  margin-bottom: 0.75em;
}

.message {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.5em 0.75em;
  border-radius: 0.5em;
  transition: all 0.3s ease;
}

.message:hover {
  background: var(--el-fill-color-light);
}

.pink-icon,
.purple-icon {
  width: 1.25em;
  height: 1.25em;
  margin-right: 0.625em;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-title {
  font-size: var(--font-size-sm);
  margin-bottom: 0.125em;
}

.message-value {
  font-size: var(--font-size-md);
  font-weight: 600;
}

.connect-date {
  display: flex;
  align-items: center;
  padding: 0.5em 0.75em;
  border-radius: 0.5em;
  font-size: var(--font-size-sm);
  margin-top: 0.625em;
}

.connect-log {
  margin-top: 1.1em;
  padding: 1em;
  border-radius: 0.75em;
  box-shadow: var(--el-box-shadow-light);
  box-sizing: border-box;
}

.base-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  padding-bottom: 0.5em;
  border-bottom: 1px dashed var(--el-border-color-light);
}

.icon-log {
  margin-right: 0.5em;
  color: var(--el-color-primary);
  width: 1em;
  height: 1em;
}

.log-table {
  border-radius: 0.5em;
  overflow: hidden;
}

.custom-tag {
  border-radius: 0.75em;
  padding: 0 0.625em;
  height: 1.625em;
  line-height: 1.625em;
  min-width: 3.75em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pagination {
  margin-top: 1em;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .left-info-container {
    padding: 0.625em 0.625em 1.25em;
  }

  .bot-item {
    padding: 0.625em;
  }

  .item-ava {
    flex-direction: column;
    align-items: flex-start;
  }

  .ava-img {
    width: 5em;
    height: 5em;
    margin-right: 0;
    margin-bottom: 0.625em;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.5em;
  }

  .el-pagination button,
  .el-pagination li {
    margin: 0 0.125em;
  }

  .el-pagination .btn-prev,
  .el-pagination .btn-next,
  .el-pagination .number {
    min-width: 1.75em;
    height: 1.75em;
    line-height: 1.75em;
  }
}

@media (max-width: 480px) {
  .left-info-container {
    padding: 0.75em 0.5em 1.5em;
  }

  .ava-img {
    width: 4em;
    height: 4em;
  }

  .message {
    padding: 0.375em 0.5em;
  }

  .connect-log {
    padding: 0.75em;
  }
}
</style>
