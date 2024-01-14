<template>
  <div class="cmd-main">
    <div class="btn-group">
      <my-button
        icon="play-black"
        class="btn"
        :width="40"
        :height="32"
        @click="execSql"
        content="执行"
      />
      <my-button
        icon="delete-black"
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
          icon="notebook-black"
          class="btn"
          :width="40"
          :height="32"
          content="常用SQL"
        />
      </el-popover>

      <!-- <my-button
        icon="copy-black"
        class="btn"
        :width="40"
        :height="32"
      /> -->
    </div>
    <div class="cmd-main-box">
      <div class="cmd">
        <el-input
          v-model="sqlMessage"
          :rows="20"
          type="textarea"
          resize="none"
        ></el-input>
      </div>
      <div class="history">
        <p class="title">历史记录</p>
        <div class="history-box">
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
    </div>
    <el-divider></el-divider>
    <div class="result-box" ref="resultBox">
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
        <el-table :data="resultData" border :height="tableHeight">
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
    }
  },
  mounted() {
    this.getSqlLog()
    this.getCommonSql()
    this.tableHeight = this.$refs.resultBox.clientHeight
  },
  methods: {
    getCommonSql() {
      this.postRequest("database/get_common_sql").then((resp) => {
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
      })
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
      // 执行sql
      this.postRequest("database/exec_sql", {
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
      })
    },
    getSqlLog() {
      // 获取sql日志
      this.postRequest("database/get_sql_log", {
        index: this.historyIndex,
        size: 7,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            console.log("get_sql_log", resp)
            this.historyTotal = resp.data.total
            this.historyList = resp.data.data
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
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
  border-radius: 5px;
  margin-top: 5px;
  cursor: pointer;
}

.cmd-main {
  padding: 30px;
  height: calc(100% - 60px);
  width: calc(100% - 60px);

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
    display: flex;
    .cmd {
      width: calc(100% - 460px);
    }
    .history {
      width: 450px;
      margin-left: 10px;
      border: 1px solid #d3d3d4;
      border-radius: 5px;
      padding: 20px;
      background-color: #fff;

      .history-box {
        overflow: auto;
        height: 315px;

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
    height: calc(100% - 520px);
    min-height: 460px;
    overflow: auto;

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
  }
}
</style>
