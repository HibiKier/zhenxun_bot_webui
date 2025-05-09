<template>
  <div class="table-list h-full w-full p-4" ref="tableList">
    <div class="title-container mb-4">
      <p
        class="title text-2xl md:text-3xl font-bold text-purple-600"
        ref="title"
      >
        数据表
      </p>
    </div>

    <div
      class="table-list-box bg-white rounded-xl shadow-lg md:p-6"
      :style="{ height: computedHeight + 'px', overflow: 'auto' }"
    >
      <el-collapse
        v-model="activeName"
        accordion
        :key="reloadKey"
        @change="selectTable"
        class="anime-collapse"
      >
        <el-collapse-item
          v-for="table in tableList"
          :key="table.name"
          :name="table.name"
          class="mb-3 anime-collapse-item"
        >
          <template slot="title">
            <div
              class="name-color bg-gradient-to-b from-pink-400 to-purple-500"
            ></div>
            <div class="flex flex-col md:flex-row md:items-center">
              <p class="table-name text-purple-600 font-bold">
                {{ table.name }}：
              </p>
              <p class="table-desc text-gray-500 text-sm md:ml-2">
                {{ table.desc || "-" }}
              </p>
            </div>
          </template>

          <div v-if="table.showColum" class="column-list mt-3">
            <el-table
              :data="tableColumn[table.name]"
              border
              class="anime-table"
            >
              <el-table-column
                label="名称"
                prop="column_name"
                class-name="cute-column"
              ></el-table-column>
              <el-table-column
                label="类型"
                prop="data_type"
                class-name="cute-column"
              ></el-table-column>
              <el-table-column
                width="80"
                label="最大长度"
                prop="max_length"
                class-name="cute-column"
              ></el-table-column>
              <el-table-column
                width="80"
                label="是否为空"
                prop="is_nullable"
                class-name="cute-column"
              ></el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
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
          this.$refs.tableList.offsetHeight - this.$refs.title.offsetHeight - 20
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
          { table_name: tableName }
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

<style scoped>
/* 二次元可爱风格样式 */
.table-list {
  background-image: radial-gradient(
    circle at 10% 20%,
    rgba(255, 200, 239, 0.1) 0%,
    rgba(255, 255, 255, 0.9) 90%
  );
}

.title {
  position: relative;
  display: inline-block;
  padding-bottom: 5px;
}

.title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ec4899, #a855f7);
  border-radius: 3px;
}

.name-color {
  width: 3px;
  height: 24px;
  margin-right: 10px;
  border-radius: 3px;
}

.table-list-box {
  border: 1px solid rgba(236, 72, 153, 0.2);
  position: relative;
  overflow: hidden;
}

.table-list-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #ec4899, #a855f7, #60a5fa);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .table-list {
    padding: 1rem;
    height: auto !important;
  }

  .table-list-box {
    padding: 1rem;
    height: auto !important;
    max-height: 500px;
    overflow-y: auto;
  }

  .title {
    font-size: 1.5rem;
  }

  ::v-deep .anime-table {
    width: 100%;
    overflow-x: auto;
  }

  ::v-deep .anime-table .el-table__body-wrapper {
    overflow-x: auto;
  }
}

/* 自定义Element UI组件样式 */
::v-deep .anime-collapse {
  border: none;
}

::v-deep .anime-collapse-item {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px !important;
  margin-bottom: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(236, 72, 153, 0.1) !important;
}

::v-deep .anime-collapse-item__header {
  background-color: rgba(248, 231, 239, 0.5) !important;
  border-radius: 8px !important;
  padding: 12px 16px !important;
  font-size: 16px !important;
  color: #6b21a8 !important;
  border-bottom: none !important;
}

::v-deep .anime-collapse-item__wrap {
  background-color: transparent !important;
  border-bottom-left-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
  border: none !important;
}

::v-deep .anime-collapse-item__content {
  padding: 16px !important;
  color: #4c1d95 !important;
}

::v-deep .anime-table {
  --el-table-border-color: rgba(236, 72, 153, 0.2) !important;
  --el-table-header-bg-color: rgba(248, 231, 239, 0.5) !important;
  --el-table-tr-bg-color: rgba(255, 255, 255, 0.8) !important;
  --el-table-row-hover-bg-color: rgba(236, 72, 153, 0.1) !important;
  border-radius: 8px !important;
  overflow: hidden !important;
}

::v-deep .anime-table th {
  color: #6b21a8 !important;
  font-weight: bold !important;
}

::v-deep .anime-table td {
  color: #4c1d95 !important;
}

::v-deep .cute-column .cell {
  padding: 8px 12px !important;
}
</style>
