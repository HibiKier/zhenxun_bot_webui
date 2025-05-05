<template>
  <div
    class="left-info-container bg-pink-50 p-4 h-full"
    ref="leftInfoContainer"
  >
    <el-row ref="firstRow">
      <el-col :span="24">
        <div class="top-text text-purple-600">
          <svg-icon icon-class="bot" class="icon-bot" />
          在线小真寻（{{ botList.length }}）
        </div>
        <div class="bot-list" :style="{ height: computedHeight + 'px' }">
          <div v-for="bot in botList" :key="bot.id" class="bot-item">
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
                    <span class="line-line pink-line"></span>
                    <span class="bot-name">{{ bot.nickname }}</span>
                  </div>
                  <div class="info-id">
                    <span class="line-line purple-line"></span>
                    <span class="purple-text">ID: {{ bot.self_id }}</span>
                  </div>
                  <div class="info-gf">
                    <div class="gf-item">
                      <svg-icon icon-class="friend" class="blue-icon" />
                      <span class="gf-value">{{ bot.friend_count }}</span>
                    </div>
                    <el-divider direction="vertical" />
                    <div class="gf-item">
                      <svg-icon icon-class="group" class="green-icon" />
                      <span class="gf-value">{{ bot.group_count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-divider class="custom-divider" />
            <div class="bot-detail-info">
              <div class="detail-row">
                <div class="message">
                  <svg-icon icon-class="call" class="pink-icon" />
                  <div class="message-content">
                    <span class="message-title">今日调用</span>
                    <span class="message-value">{{ bot.day_call }}</span>
                  </div>
                </div>
                <div class="message">
                  <svg-icon icon-class="message" class="blue-icon" />
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
                  <svg-icon icon-class="platform" class="purple-icon" />
                  <div class="message-content">
                    <span class="message-title">平台</span>
                    <span class="message-value">{{ bot.platform }}</span>
                  </div>
                </div>
                <div class="message">
                  <svg-icon icon-class="time" class="green-icon" />
                  <div class="message-content">
                    <span class="message-title">连接时长</span>
                    <span class="message-value">{{ bot.connectTime }}</span>
                  </div>
                </div>
              </div>
              <div class="connect-date">
                <svg-icon icon-class="calendar" class="yellow-icon" />
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
          <p class="base-title text-purple-600" ref="logTitle">
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
                <span class="purple-text">{{ scope.row.connect_time }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="bot_id" label="账号" align="center">
              <template slot-scope="scope">
                <span class="blue-text">{{ scope.row.bot_id }}</span>
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
              :pager-count="windowWidth < 768 ? 3 : 5"
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
      windowWidth: window.innerWidth,
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
        this.windowWidth = window.innerWidth
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
    window.removeEventListener("resize", this.calculateTableHeight)
  },
}
</script>

<style scoped>
.left-info-container {
  height: 100%;
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
}

.top-text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 8px;
  border-left: 4px solid #ec4899;
}

.icon-bot {
  margin-right: 8px;
  color: #ec4899;
}

.bot-list {
  overflow: auto;
  background-color: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.bot-item {
  margin-bottom: 20px;
  padding: 15px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.bot-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.item-ava {
  display: flex;
  align-items: center;
}

.ava-img {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  margin-right: 15px;
  border: 3px solid rgba(236, 72, 153, 0.2);
  transition: all 0.3s ease;
}

.ava-img:hover {
  transform: scale(1.05);
  border-color: #ec4899;
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
  margin-bottom: 8px;
}

.line-line {
  width: 4px;
  height: 18px;
  border-radius: 4px;
  margin-right: 10px;
}

.pink-line {
  background-color: #ec4899;
}

.purple-line {
  background-color: #a855f7;
}

.bot-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-id {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 10px;
}

.purple-text {
  color: #a855f7;
}

.info-gf {
  display: flex;
  align-items: center;
  gap: 15px;
}

.gf-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.blue-icon {
  color: #60a5fa;
  margin-right: 5px;
}

.green-icon {
  color: #4ade80;
  margin-right: 5px;
}

.gf-value {
  margin-left: 5px;
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.custom-divider {
  margin: 12px 0;
  background-color: #e5e7eb;
}

.bot-detail-info {
  padding-top: 10px;
}

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
}

.message:hover {
  background: rgba(236, 72, 153, 0.1);
}

.pink-icon {
  color: #ec4899;
  font-size: 20px;
  margin-right: 10px;
}

.blue-icon {
  color: #3b82f6;
  font-size: 20px;
  margin-right: 10px;
}

.purple-icon {
  color: #a855f7;
  font-size: 20px;
  margin-right: 10px;
}

.green-icon {
  color: #10b981;
  font-size: 20px;
  margin-right: 10px;
}

.yellow-icon {
  color: #f59e0b;
  margin-right: 8px;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-title {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
}

.message-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.connect-date {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(245, 158, 11, 0.05);
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  margin-top: 10px;
}

.connect-log {
  margin-top: 20px;
  background-color: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.base-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e5e7eb;
}

.icon-log {
  margin-right: 8px;
  color: #ec4899;
}

.log-table {
  border-radius: 8px;
  overflow: hidden;
}

.blue-text {
  color: #3b82f6;
}

.custom-tag {
  border-radius: 12px;
  padding: 0 10px;
  height: 26px;
  line-height: 26px;
  min-width: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .left-info-container {
    padding: 0 10px;
  }

  .bot-item {
    padding: 10px;
  }

  .item-ava {
    flex-direction: column;
    align-items: flex-start;
  }

  .ava-img {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .detail-row {
    flex-direction: column;
    gap: 8px;
  }

  .el-pagination button,
  .el-pagination li {
    margin: 0 2px;
  }

  .el-pagination .btn-prev,
  .el-pagination .btn-next,
  .el-pagination .number {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
  }
}
</style>
