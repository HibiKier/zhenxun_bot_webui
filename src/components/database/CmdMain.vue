<template>
  <div class="cmd-main" ref="cmdMain">
    <div class="btn-group" ref="btnGroup">
      <my-button
        icon="play"
        class="btn"
        :width="40"
        :height="32"
        @click="execSql"
        content="执行"
      />
      <my-button
        icon="delete"
        content="删除"
        class="btn"
        :width="40"
        :height="32"
        @click="
          () => {
            sqlMessage = ''
          }
        "
      />
      <el-popover placement="right" width="400" trigger="click">
        <div>
          <p class="small-title">常用sql</p>
          <el-tooltip
            v-for="(n, i) in commonSqlList"
            :key="i"
            class="item"
            effect="dark"
            :content="n.remark"
            placement="top-start"
          >
            <div class="common-sql-item" @click="copyHistory(n.sql)">
              <p>{{ n.sql }}</p>
            </div>
          </el-tooltip>
        </div>
        <my-button
          slot="reference"
          icon="notebook"
          class="btn"
          :width="40"
          :height="32"
          content="常用SQL"
        />
      </el-popover>
    </div>
    <div class="cmd-main-box" ref="cmdMainBox">
      <el-row>
        <el-col :span="12">
          <div class="cmd">
            <el-input
              v-model="sqlMessage"
              :rows="10"
              type="textarea"
              resize="none"
              :style="{ height: sizeMana.inputHeight + 'px' }"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="history">
            <p class="title">历史记录</p>
            <div
              class="history-box"
              :style="{ height: sizeMana.topHeight + 'px' }"
            >
              <div
                v-for="(n, index) in historyList"
                :key="index"
                class="history-item"
                @click="copyHistory(n.sql)"
              >
                <p>{{ n.sql }}</p>
              </div>
            </div>
            <div class="pagination">
              <el-pagination
                layout="prev, pager, next"
                :total="historyTotal"
                @current-change="getSqlLog"
                :current-page.sync="historyIndex"
              >
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-divider></el-divider>
    <div
      class="result-box"
      ref="resultBox"
      :style="{ height: sizeMana.resultHeight + 'px' }"
    >
      <p v-if="info" class="error-info">
        {{ info }}
      </p>
      <div v-else-if="!resultData.length" class="empty">
        <el-empty
          :image-size="350"
          :image="require('../../assets/image/empty.png')"
          description="空空如也 ┐(ﾟ～ﾟ)┌ "
        ></el-empty>
      </div>
      <template v-else>
        <el-table :data="resultData" border :height="sizeMana.resultHeight">
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
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.getSqlLog()
    this.handleResize()
    if (this.$store.state.botType == "zhenxun") {
      this.getCommonSql()
    }
  },
  methods: {
    handleResize() {
      this.sizeMana.topHeight = this.$refs.cmdMainBox.offsetHeight - 132
      this.sizeMana.inputHeight = this.$refs.cmdMainBox.offsetHeight
      this.sizeMana.resultHeight =
        this.$refs.cmdMain.offsetHeight -
        this.$refs.btnGroup.offsetHeight -
        this.$refs.cmdMainBox.offsetHeight -
        80
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
      this.$message.success("复制成功")
      this.sqlMessage = n
    },
    formatBoolean(row, i, cellValue) {
      return cellValue + ""
    },
    execSql() {
      if (!this.sqlMessage || !this.sqlMessage.trim()) {
        return
      }
      const loading = this.getLoading(".result-box")
      // 执行sql
      this.postRequest(`${this.$root.prefix}/database/exec_sql`, {
        sql: this.sqlMessage,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
            this.info = resp.warning
          } else {
            this.info = ""
            this.resultData = []
            this.columns = []
            this.$message.success(resp.info)
            if (resp.data && resp.data.length) {
              this.columns = Object.keys(resp.data[0])
            }
            this.resultData = resp.data
            if (!this.sqlMessage.toLowerCase().startsWith("select")) {
              this.info = "执行成功!"
            }
          }
          this.getSqlLog()
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    getSqlLog() {
      // 获取sql日志
      const loading = this.getLoading(".history")
      this.postRequest(`${this.$root.prefix}/database/get_sql_log`, {
        index: this.historyIndex,
        size: 7,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.historyTotal = resp.data.total
            this.historyList = resp.data.data
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style lang="scss" scoped>
.small-title {
  font-size: 14px;
  color: #939395;
  text-align: center;
  border: 1px solid #d3d3d4;
  padding: 5px;
  border-radius: 10px;
  margin: 5px;
}

.common-sql-item {
  border: 1px solid #d3d3d4;
  padding: 10px;
  border-radius: 10px;
  margin-top: 5px;
  cursor: pointer;
}

.cmd-main {
  padding: 30px 30px 0 30px;
  box-sizing: border-box;

  .btn-group {
    display: flex;
    margin-bottom: 5px;
    .btn {
      margin-right: 5px;
    }
  }
  .title {
    font-size: 20px;
    color: #939395;
    text-align: center;
    border: 1px solid #d3d3d4;
    padding: 5px;
    border-radius: 10px;
    margin: 10px;
  }
  .cmd-main-box {
    height: 40%;
    .cmd {
      /deep/ .el-textarea__inner {
        border-radius: 10px;
      }
    }

    /deep/ textarea {
      height: 100%;
    }

    .history {
      box-sizing: border-box;
      margin-left: 10px;
      border: 1px solid #d3d3d4;
      border-radius: 10px;
      padding: 20px;
      background-color: #fff;

      .history-box {
        overflow: auto;
        height: 90px;

        .history-item {
          border: 1px solid #d3d3d4;
          padding: 10px;
          border-radius: 5px;
          margin-top: 5px;
          cursor: pointer;
        }
      }

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .result-box {
    background-color: #fff;
    width: 100%;
    overflow: auto;
    border-radius: 10px;

    .error-info {
      margin: 24px;
    }

    .empty {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /deep/ .el-empty {
      box-sizing: border-box;
    }
  }
}
</style>
