<template>
  <div
    class="cmd-main p-4 h-full"
    ref="cmdMain"
    :style="{ background: 'var(--el-bg-color)' }"
  >
    <!-- 按钮组 - 使用MyButton组件 -->
    <div class="btn-group flex flex-wrap gap-2 mb-4" ref="btnGroup">
      <my-button
        icon="exec"
        text="执行"
        type="success"
        :rounded="$isMobile() ? 'md' : 'lg'"
        :width="$isMobile() ? 80 : 100"
        :height="36"
        glow
        @click="execSql"
      />

      <my-button
        icon="clear4"
        text="清空"
        type="danger"
        :rounded="$isMobile() ? 'md' : 'lg'"
        :width="$isMobile() ? 80 : 100"
        :height="36"
        @click="sqlMessage = ''"
      />

      <el-popover
        placement="right"
        width="400"
        trigger="click"
        popper-class="anime-popover"
      >
        <div
          class="p-4 rounded-xl"
          :style="{
            background: 'var(--el-bg-color)',
            boxShadow: 'var(--el-box-shadow-light)',
            border: '1px solid var(--el-border-color-light)',
          }"
        >
          <p
            class="small-title text-center font-bold mb-3 border-b-2 pb-2"
            :style="{
              color: 'var(--el-color-primary)',
              borderColor: 'var(--el-color-primary-light-7)',
            }"
          >
            常用SQL
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
                class="common-sql-item p-3 mb-2 rounded-lg border transition-all cursor-pointer"
                :style="{
                  background: 'var(--el-fill-color-light)',
                  border: '1px solid var(--el-border-color-light)',
                  color: 'var(--el-color-primary)',
                }"
                @click="copyHistory(n.sql)"
              >
                <p
                  class="text-sm font-mono"
                  :style="{ color: 'var(--el-color-primary)' }"
                >
                  {{ n.sql }}
                </p>
              </div>
            </el-tooltip>
          </div>
        </div>

        <my-button
          slot="reference"
          icon="text"
          text="常用SQL"
          type="warning"
          :rounded="$isMobile() ? 'md' : 'lg'"
          :width="$isMobile() ? 120 : 100"
          :height="36"
        />
      </el-popover>
    </div>
    <!-- 主内容区域 -->
    <div
      class="cmd-main-box rounded-xl"
      ref="cmdMainBox"
      :style="{
        background: 'var(--el-bg-color-overlay)',
        boxShadow: 'var(--el-box-shadow-light)',
        border: '1px solid var(--el-color-primary-light-7)',
        height: sizeMana.mainBoxHeight + 'px',
        padding: '1.5rem',
      }"
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
              :style="{ height: sizeMana.inputHeight - 50 + 'px' }"
              placeholder="输入SQL命令... ✍(◔◡◔)"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="24" :md="12" class="mt-4 md:mt-0">
          <div
            class="history h-full flex flex-col rounded-xl p-4"
            :style="{
              border: '1px solid var(--el-color-primary-light-7)',
              background: 'var(--el-fill-color-light)',
            }"
          >
            <p
              class="title text-center font-bold mb-3 border-b-2 pb-2"
              :style="{
                color: 'var(--el-color-primary)',
                borderColor: 'var(--el-color-primary-light-7)',
              }"
            >
              历史记录
              <span :style="{ color: 'var(--el-color-primary-light-5)' }"
                >(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</span
              >
            </p>
            <div
              class="history-box flex-grow overflow-y-auto"
              :style="{ height: sizeMana.topHeight - 40 + 'px' }"
            >
              <div
                v-for="(n, index) in historyList"
                :key="index"
                class="history-item p-3 mb-2 rounded-lg border transition-all cursor-pointer"
                :style="{
                  background: 'var(--el-bg-color)',
                  border: '1px solid var(--el-border-color-light)',
                  color: 'var(--el-color-primary)',
                }"
                @click="copyHistory(n.sql)"
              >
                <p
                  class="text-sm font-mono"
                  :style="{ color: 'var(--el-color-primary)' }"
                >
                  {{ n.sql }}
                </p>
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
                :pager-count="$isMobile() ? 3 : 5"
              ></el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 分割线 - 主题色 -->
    <div class="my-4 relative">
      <div
        class="h-1 rounded-full"
        :style="{
          background:
            'linear-gradient(90deg, var(--el-color-primary-light-7), var(--el-color-primary-light-5), var(--el-color-primary))',
        }"
      ></div>
      <div
        class="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 font-bold"
        :style="{
          background: 'var(--el-bg-color)',
          color: 'var(--el-color-primary)',
        }"
      >
        执行结果
      </div>
    </div>

    <!-- 结果区域 -->
    <div
      class="result-box rounded-xl mt-4"
      ref="resultBox"
      :style="{
        background: 'var(--el-bg-color-overlay)',
        boxShadow: 'var(--el-box-shadow-light)',
        border: '1px solid var(--el-color-primary-light-7)',
        height: sizeMana.resultHeight + 40 + 'px',
        overflow: 'auto',
        padding: '1.5rem',
      }"
    >
      <p
        v-if="info"
        class="error-info p-4 rounded-lg"
        :style="{
          background: 'var(--el-color-danger-light-9)',
          border: '1px solid var(--el-color-danger-light-5)',
          color: 'var(--el-color-danger)',
        }"
      >
        {{ info }}
      </p>
      <div
        v-else-if="!resultData.length"
        class="empty h-full flex items-center justify-center"
      >
        <el-empty
          :image-size="$isMobile() ? 200 : 350"
          :image="require('../../assets/image/empty.png')"
          description="空空如也 ┐(ﾟ～ﾟ)┌ "
          class="anime-empty"
        ></el-empty>
      </div>
      <template v-else>
        <el-table
          :data="resultData"
          border
          :height="sizeMana.resultHeight - 13"
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
      maxResultHeight: 0,
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
        const cmdMainHeight = this.$refs.cmdMain.offsetHeight
        const btnGroupHeight = this.$refs.btnGroup.offsetHeight
        const spacing = this.$isMobile() ? 100 : 120

        // 计算可用总高度（减去按钮组和间距）
        const availableHeight = cmdMainHeight - btnGroupHeight - spacing

        // 计算1:2比例的高度
        const desiredMainHeight = availableHeight * 0.33
        const desiredResultHeight = availableHeight - desiredMainHeight

        // 设置主内容区域高度（最小200px）
        this.sizeMana.mainBoxHeight = Math.max(desiredMainHeight, 280)

        // 计算实际可用的结果区域高度
        const remainingHeight =
          cmdMainHeight - btnGroupHeight - this.sizeMana.mainBoxHeight - spacing

        // 设置结果区域高度（不超过剩余空间，最小400px）
        this.sizeMana.resultHeight = Math.max(
          Math.min(desiredResultHeight, remainingHeight),
          100
        )

        // 更新最大结果高度限制
        this.maxResultHeight = remainingHeight

        // 调整内部元素高度
        this.sizeMana.topHeight =
          this.sizeMana.mainBoxHeight - (this.$isMobile() ? 160 : 132)
        this.sizeMana.inputHeight = this.sizeMana.mainBoxHeight
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
    height: auto !important;
    overflow-y: auto;
  }

  .cmd-main-box {
    height: auto !important;
    margin-bottom: 1rem;
  }

  .result-box {
    margin-top: 1rem !important;
    height: auto !important;
    max-height: 500px;
    overflow-y: auto;
  }

  ::v-deep .anime-empty .el-empty__image {
    width: 200px !important;
    height: 200px !important;
  }

  ::v-deep .anime-table {
    width: 100%;
    overflow-x: auto;
  }

  ::v-deep .anime-table .el-table__body-wrapper {
    overflow-x: auto;
  }

  .history-box {
    max-height: 300px;
    overflow-y: auto;
  }
}

/* 动画效果 */
.common-sql-item:hover,
.history-item:hover {
  transform: translateX(4px);
  box-shadow: var(--el-box-shadow-light);
}

.common-sql-item,
.history-item {
  transition: all 0.3s ease;
}
</style>
