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
          <div v-if="table.showColum" class="colum-list">
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
          this.$refs.tableList.offsetHeight - this.$refs.title.offsetHeight - 80
      })
    },
    async selectTable(tableName) {
      if (!Object.keys(this.tableColumn).includes(tableName)) {
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
        if (e.name == tableName) {
          e.showColum = !e.showColum
        }
      })
      this.$forceUpdate()
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
    // color: #939395;
    font-weight: bold;
    font-size: 23px;
    // border: 1px solid #d3d3d4;
    padding: 5px;
    border-radius: 10px;
    text-align: center;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: white;
    height: 35px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .name-color {
    width: 2px;
    height: 100%;
    background-color: #2b80ed;
    margin-right: 5px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .table-list-box {
    overflow: auto;
    height: 100%;
    padding: 30px;
    background-color: white;
    border-radius: 10px;
    box-sizing: border-box;

    ::v-deep .el-collapse-item {
      margin-bottom: 5px;
      border-radius: 5px;
    }

    ::v-deep .el-collapse-item__header {
      font-size: 15px;
      font-weight: bold;
      background-color: #f0f2f5;
      // border-radius: 10px;
    }

    .table-box {
      // width: 100%;
      // height: 50px;
      padding: 10px 20px;

      ::v-deep .el-divider--horizontal {
        margin: 10px 0;
      }

      .table-name {
        font-weight: bold !important;
        font-size: 20px !important;
        cursor: pointer;
      }

      .table-desc {
        font-size: 14px;
        color: #9f9f9f;
        margin-top: 5px;
      }

      .colum-list {
        // height: 100px;
      }
    }
  }
}
</style>
