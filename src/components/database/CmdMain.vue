<template>
  <div
    class="cmd-main p-4 md:p-6 bg-gradient-to-br from-pink-50 to-purple-50"
    ref="cmdMain"
  >
    <!-- 按钮组 - 使用MyButton组件 -->
    <div class="btn-group flex flex-wrap gap-2 mb-4" ref="btnGroup">
      <my-button
        icon="play"
        text="执行"
        type="success"
        :rounded="windowWidth < 768 ? 'md' : 'lg'"
        :width="windowWidth < 768 ? 80 : 100"
        :height="36"
        glow
        @click="execSql"
      />

      <my-button
        icon="delete"
        text="清空"
        type="danger"
        :rounded="windowWidth < 768 ? 'md' : 'lg'"
        :width="windowWidth < 768 ? 80 : 100"
        :height="36"
        @click="sqlMessage = ''"
      />

      <el-popover
        placement="right"
        width="400"
        trigger="click"
        popper-class="anime-popover"
      >
        <div class="p-4 bg-white rounded-xl shadow-lg border-2 border-pink-200">
          <p
            class="small-title text-center text-purple-600 font-bold mb-3 border-b-2 border-pink-200 pb-2"
          >
            常用SQL <span class="text-pink-400">(◕‿◕✿)</span>
          </p>
          <div class="max-h-60 overflow-y-auto pr-2">
            <el-tooltip
              v-for="(n, i) in commonSqlList"
              :key="i"
              effect="dark"
              :content="n.remark"
              placement="top-start"
            >
              <div
                class="common-sql-item p-3 mb-2 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 hover:border-pink-300 transition-all cursor-pointer"
                @click="copyHistory(n.sql)"
              >
                <p class="text-sm text-purple-800 font-mono">{{ n.sql }}</p>
              </div>
            </el-tooltip>
          </div>
        </div>

        <my-button
          slot="reference"
          icon="notebook"
          text="常用SQL"
          type="warning"
          :rounded="windowWidth < 768 ? 'md' : 'lg'"
          :width="windowWidth < 768 ? 80 : 100"
          :height="36"
        />
      </el-popover>
    </div>

    <!-- 主内容区域 -->
    <div
      class="cmd-main-box bg-white rounded-xl shadow-lg p-4 md:p-6 border-2 border-pink-200"
      ref="cmdMainBox"
    >
      <el-row :gutter="16">
        <el-col :span="24" :md="12">
          <div class="cmd h-full">
            <el-input
              v-model="sqlMessage"
              :rows="10"
              type="textarea"
              resize="none"
              class="anime-textarea"
              :style="{ height: sizeMana.inputHeight + 'px' }"
              placeholder="输入SQL命令... ✍(◔◡◔)"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="24" :md="12" class="mt-4 md:mt-0">
          <div
            class="history h-full flex flex-col border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-b from-blue-50 to-purple-50"
          >
            <p
              class="title text-center text-blue-600 font-bold mb-3 border-b-2 border-blue-200 pb-2"
            >
              历史记录 <span class="text-purple-400">(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</span>
            </p>
            <div
              class="history-box flex-grow overflow-y-auto"
              :style="{ height: sizeMana.topHeight + 12 + 'px' }"
            >
              <div
                v-for="(n, index) in historyList"
                :key="index"
                class="history-item p-3 mb-2 rounded-lg bg-white border border-blue-100 hover:border-blue-300 transition-all cursor-pointer"
                @click="copyHistory(n.sql)"
              >
                <p class="text-sm text-blue-800 font-mono">{{ n.sql }}</p>
              </div>
            </div>
            <div class="pagination mt-3">
              <el-pagination
                layout="prev, pager, next"
                :total="historyTotal"
                @current-change="getSqlLog"
                :current-page.sync="historyIndex"
                class="anime-pagination"
                small
                :pager-count="windowWidth < 768 ? 3 : 5"
              ></el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 分割线 - 可爱风格 -->
    <div class="my-4 relative">
      <div
        class="h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-full"
      ></div>
      <div
        class="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-pink-500 font-bold"
      >
        ✨ 执行结果 ✨
      </div>
    </div>

    <!-- 结果区域 -->
    <div
      class="result-box bg-white rounded-xl shadow-lg p-4 md:p-6 border-2 border-purple-200"
      ref="resultBox"
      :style="{ height: sizeMana.resultHeight + 'px' }"
    >
      <p
        v-if="info"
        class="error-info p-4 rounded-lg bg-red-100 border-2 border-red-200 text-red-600"
      >
        {{ info }}
      </p>
      <div
        v-else-if="!resultData.length"
        class="empty h-full flex items-center justify-center"
      >
        <el-empty
          :image-size="windowWidth < 768 ? 200 : 350"
          :image="require('../../assets/image/empty.png')"
          description="空空如也 ┐(ﾟ～ﾟ)┌ "
          class="anime-empty"
        ></el-empty>
      </div>
      <template v-else>
        <el-table
          :data="resultData"
          border
          :height="sizeMana.resultHeight"
          class="anime-table"
        >
          <el-table-column
            v-for="c in columns"
            :label="c"
            :key="c"
            :prop="c"
            :formatter="formatBoolean"
          ></el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
import MyButton from "../ui/MyButton.vue"
export default {
  components: { MyButton },
  name: "CmdMain",
  data() {
    return {
      sqlMessage: null,
      historyList: [],
      historyIndex: 1,
      historyTotal: 0,
      resultData: [],
      info: null,
      columns: [],
      commonSqlList: [],
      sizeMana: {
        topHeight: 90,
        inputHeight: 90,
        resultHeight: 90,
      },
      windowWidth: window.innerWidth,
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.getSqlLog()
    this.handleResize()
    if (this.$store.state.botType == "zhenxun") {
      this.getCommonSql()
    }
    this.windowWidth = window.innerWidth
    window.addEventListener("resize", this.updateWindowWidth)
  },
  methods: {
    updateWindowWidth() {
      this.windowWidth = window.innerWidth
    },
    handleResize() {
      this.$nextTick(() => {
        this.sizeMana.topHeight =
          this.$refs.cmdMainBox.offsetHeight -
          (this.windowWidth < 768 ? 160 : 132)
        this.sizeMana.inputHeight = this.$refs.cmdMainBox.offsetHeight

        this.sizeMana.resultHeight =
          this.$refs.cmdMain.offsetHeight -
          this.$refs.btnGroup.offsetHeight -
          this.$refs.cmdMainBox.offsetHeight -
          (this.windowWidth < 768 ? 100 : 165)
      })
    },
    getCommonSql() {
      this.getRequest(`${this.$root.prefix}/database/get_common_sql`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.commonSqlList = resp.data
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    copyHistory(n) {
      this.$message.success({
        message: "复制成功 (●ˊωˋ●)",
        customClass: "anime-message",
      })
      this.sqlMessage = n
    },
    formatBoolean(row, i, cellValue) {
      return cellValue + ""
    },
    execSql() {
      if (!this.sqlMessage || !this.sqlMessage.trim()) {
        this.$message.warning({
          message: "请输入SQL命令哦 (｡•́︿•̀｡)",
          customClass: "anime-message",
        })
        return
      }
      const loading = this.getLoading(".result-box")
      this.postRequest(`${this.$root.prefix}/database/exec_sql`, {
        sql: this.sqlMessage,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning({
              message: resp.warning,
              customClass: "anime-message",
            })
            this.info = resp.warning
          } else {
            this.info = ""
            this.resultData = []
            this.columns = []
            this.$message.success({
              message: resp.info,
              customClass: "anime-message",
            })
            if (resp.data && resp.data.length) {
              this.columns = Object.keys(resp.data[0])
            }
            this.resultData = resp.data
            if (!this.sqlMessage.toLowerCase().startsWith("select")) {
              this.info = "执行成功! ✧*。٩(ˊωˋ*)و✧*。"
            }
          }
          this.getSqlLog()
        } else {
          this.$message.error({
            message: resp.info,
            customClass: "anime-message",
          })
        }
        loading.close()
      })
    },
    getSqlLog() {
      const loading = this.getLoading(".history")
      this.postRequest(`${this.$root.prefix}/database/get_sql_log`, {
        index: this.historyIndex,
        size: 7,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning({
              message: resp.warning,
              customClass: "anime-message",
            })
          } else {
            this.$message.success({
              message: resp.info,
              customClass: "anime-message",
            })
            this.historyTotal = resp.data.total
            this.historyList = resp.data.data
          }
        } else {
          this.$message.error({
            message: resp.info,
            customClass: "anime-message",
          })
        }
        loading.close()
      })
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
    window.removeEventListener("resize", this.updateWindowWidth)
  },
}
</script>

<style scoped>
/* 响应式调整 */
@media (max-width: 768px) {
  .cmd-main {
    padding: 1rem !important;
  }

  .cmd-main-box {
    height: auto !important;
  }

  .result-box {
    margin-top: 1rem !important;
  }

  ::v-deep .anime-empty .el-empty__image {
    width: 200px !important;
    height: 200px !important;
  }
}

/* 动画效果 */
.common-sql-item:hover,
.history-item:hover {
  transform: translateX(4px);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.common-sql-item,
.history-item {
  transition: all 0.3s ease;
}
</style>
