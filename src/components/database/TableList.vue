<template>
  <div class="table-list" ref="tableList">
    <one-mark text="风灵月影的魔法" style="margin-top: 10px" />
    <p class="title" ref="title">数据表</p>
    <div class="table-list-box" :style="{ height: computedHeight + 'px' }">
      <el-collapse
        v-model="activeName"
        accordion
        :key="reloadKey"
        @change="selectTable"
      >
        <el-collapse-item
          v-for="table in tableList"
          :key="table.name"
          :name="table.name"
        >
          <template slot="title">
            <div class="name-color"></div>
            <p class="table-name">{{ table.name }}：</p>
            <p class="table-desc">{{ table.desc || "-" }}</p>
          </template>
          <div v-if="table.showColum" class="column-list">
            <el-table :data="tableColumn[table.name]" border>
              <el-table-column
                label="名称"
                prop="column_name"
              ></el-table-column>
              <el-table-column label="类型" prop="data_type"></el-table-column>
              <el-table-column
                width="80"
                label="最大长度"
                prop="max_length"
              ></el-table-column>
              <el-table-column
                width="80"
                label="是否为空"
                prop="is_nullable"
              ></el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import OneMark from "../ui/OneMark.vue"
export default {
  components: { OneMark },
  name: "TableList",
  data() {
    return {
      activeName: null,
      tableList: [],
      tableColumn: {},
      reloadKey: 0,
      tableHeight: 300,
    }
  },
  computed: {
    computedHeight() {
      return this.tableHeight
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.getTableList()
    this.handleResize()
  },
  methods: {
    handleResize() {
      this.$nextTick(() => {
        this.tableHeight =
          this.$refs.tableList.offsetHeight - this.$refs.title.offsetHeight - 90
      })
    },
    async selectTable(tableName) {
      if (
        tableName &&
        !this.tableColumn[tableName] &&
        !Object.keys(this.tableColumn).includes(tableName)
      ) {
        const resp = await this.getRequest(
          `${this.$root.prefix}/database/get_table_column`,
          {
            table_name: tableName,
          }
        )
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.tableColumn[tableName] = resp.data
            this.reloadKey++
          }
        } else {
          this.$message.error(resp.info)
        }
      }
      this.tableList.forEach((e) => {
        if (!tableName) {
          e.showColum = false
        } else if (e.name == tableName) {
          e.showColum = !e.showColum
        }
      })
    },
    getTableList() {
      const loading = this.getLoading(".table-list-box")
      this.getRequest(`${this.$root.prefix}/database/get_table_list`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.tableList = resp.data
            }
          } else {
            this.$message.error(resp.info)
          }
          loading.close()
        }
      )
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style lang="scss" scoped>
.table-list {
  height: calc(100% - 214px);
  padding: 0 30px;

  .title {
    font-weight: bold;
    font-size: 23px;
    padding: 5px;
    border-radius: 10px;
    text-align: center;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: var(--bg-color-secondary);
    height: 35px;
    box-shadow: var(--el-box-shadow-light);
  }

  .name-color {
    width: 2px;
    height: 100%;
    background-color: var(--primary-color);
    margin-right: 5px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .table-list-box {
    overflow: auto;
    height: 100%;
    padding: 30px;
    background-color: var(--bg-color-secondary);
    border-radius: 10px;
    box-sizing: border-box;

    ::v-deep .el-collapse-item {
      margin-bottom: 5px;
      border-radius: 5px;
    }

    ::v-deep .el-collapse-item__header {
      font-size: 15px;
      font-weight: bold;
      background-color: var(--bg-color-hover);
      color: var(--el-text-color-primary);
      border-bottom: 1px solid var(--el-border-color-light);
    }

    ::v-deep .el-collapse-item__wrap {
      background-color: var(--bg-color-secondary);
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }

    ::v-deep .el-collapse-item__content {
      padding-bottom: 15px;
      padding-left: 15px;
      padding-right: 15px;
      color: var(--el-text-color-primary);
    }

    .table-box {
      padding: 10px 20px;

      ::v-deep .el-divider--horizontal {
        margin: 10px 0;
      }

      .table-name {
        font-weight: bold !important;
        font-size: 20px !important;
        cursor: pointer;
        color: var(--el-text-color-primary);
      }

      .table-desc {
        font-size: 14px;
        color: var(--el-text-color-regular);
        margin-top: 5px;
      }

      .column-list {
        // height: 100px;
      }
    }
  }
}

/* 添加 Element UI 表格主题化样式 */
.table-list-box ::v-deep .el-table,
.table-list-box ::v-deep .el-table__expanded-cell {
  background-color: transparent; /* 使表格背景透明以继承父级背景 */
}

.table-list-box ::v-deep .el-table th,
.table-list-box ::v-deep .el-table tr,
.table-list-box ::v-deep .el-table td {
  background-color: transparent !important; /* 强制单元格背景透明 */
  color: var(--el-text-color-regular); /* 使用主题文本颜色 */
  border-color: var(--el-border-color-light) !important; /* 使用主题边框颜色，添加 important */
}

/* 覆盖表头背景和文字颜色 */
.table-list-box ::v-deep .el-table th {
  background-color: var(--el-fill-color-lighter) !important;
  color: var(--el-text-color-primary);
}


/* 覆盖斑马纹背景色 */
.table-list-box ::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: var(--el-fill-color-lighter) !important;
}

/* 覆盖鼠标悬停行的背景色 */
.table-list-box ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: var(--el-table-row-hover-bg-color) !important;
}

/* 覆盖表格边框颜色 */
.table-list-box ::v-deep .el-table--border::after,
.table-list-box ::v-deep .el-table--group::after,
.table-list-box ::v-deep .el-table::before {
    background-color: var(--el-border-color-light) !important; /* 添加 important */
}
.table-list-box ::v-deep .el-table--border th.is-leaf,
.table-list-box ::v-deep .el-table--border td {
    border-bottom: 1px solid var(--el-border-color-light) !important; /* 添加 important */
}
.table-list-box ::v-deep .el-table--border th,
.table-list-box ::v-deep .el-table--border td {
    border-right: 1px solid var(--el-border-color-light) !important; /* 添加 important */
}
/* --- */

</style>
