<template>
  <div class="main">
    <div class="title">插件商店</div>
    <div class="filter">
      <div class="search-input">
        <el-input
          v-model="search"
          placeholder="搜索..."
          style="width: 30%"
        ></el-input>
      </div>
      <div class="search-tag">
        <div
          class="search-tag-item"
          @mouseover="mouseover"
          @mouseout="mouseout"
        >
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <svg-icon
                :icon-class="authorIcon"
                style="margin-right: 10px"
              />作者
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(v, i) in authorList"
                :key="i"
                :command="v"
                >{{ v }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="table-border">
      <el-table
        :data="filterTableData"
        stripe
        height="100%"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="50"> </el-table-column>
        <el-table-column prop="name" label="名称" width="200px">
          <template slot-scope="scope">
            <div class="name-border">
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
              <a
                v-if="scope.row.github_url"
                :href="scope.row.github_url"
                target="_blank"
              >
                <svg-icon class="github-icon" icon-class="github" />
              </a>
              <span
                class="is-install"
                v-if="installModule.includes(scope.row.module)"
                >已安装</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="200px">
        </el-table-column>
        <el-table-column prop="version" label="版本" width="120px">
        </el-table-column>
        <el-table-column prop="plugin_type" label="插件类型" width="120px">
        </el-table-column>
        <el-table-column prop="description" label="简介"> </el-table-column>
        <el-table-column label="操作" min-width="140px">
          <template slot-scope="scope">
            <div style="display: flex">
              <my-button
                text="README"
                icon="readme"
                :iconWidth="23"
                :iconHeight="23"
                height="30"
                width="100"
                @click="handleReadme(scope.$index, scope.row)"
                class="handle-btn"
                :disabled="true"
              />
              <my-button
                text="安装"
                icon="download"
                :iconWidth="23"
                :iconHeight="23"
                height="30"
                width="100"
                @click="handleInstall(scope.$index, scope.row)"
                class="handle-btn"
                :disabled="installModule.includes(scope.row.module)"
              />
              <my-button
                text="更新"
                icon="update"
                :iconWidth="23"
                :iconHeight="23"
                height="30"
                width="100"
                @click="handleUpdate(scope.$index, scope.row)"
                class="handle-btn"
                :disabled="!installModule.includes(scope.row.module)"
              />
              <my-button
                text="移除"
                icon="remove"
                :iconWidth="23"
                :iconHeight="23"
                height="30"
                width="100"
                @click="handleRemove(scope.$index, scope.row)"
                class="handle-btn"
                :disabled="!installModule.includes(scope.row.module)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import MyButton from "../ui/MyButton.vue"
export default {
  components: { MyButton },
  name: "StoreTemplate",
  data() {
    return {
      handleType: null,
      authorIcon: "author-red",
      authorList: [],
      tableData: [],
      search: "",
      installModule: [],
    }
  },
  computed: {
    filterTableData() {
      const search = this.search.trim()
      if (search) {
        return this.tableData.filter((v) => {
          return v.author.includes(search) || v.name.includes(search)
        })
      } else {
        return this.tableData
      }
    },
  },
  mounted() {
    this.getPluginList()
  },
  methods: {
    handleReadme(i, data) {},
    handleUpdate(i, data) {
      this.$confirm("确认要执行此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var loading = this.getLoading(".table-border")
        this.postRequest(`${this.$root.prefix}/store/update_plugin`, {
          id: data.id,
        }).then((resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.getPluginList()
            }
          } else {
            this.$message.error(resp.info)
          }
          loading.close()
        })
      })
    },
    handleRemove(i, data) {
      this.$confirm("确认要执行此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var loading = this.getLoading(".table-border")
        this.postRequest(`${this.$root.prefix}/store/remove_plugin`, {
          id: data.id,
        }).then((resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.getPluginList()
            }
          } else {
            this.$message.error(resp.info)
          }
          loading.close()
        })
      })
    },
    handleInstall(i, data) {
      this.$confirm("确认要执行此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var loading = this.getLoading(".table-border")
        this.postRequest(`${this.$root.prefix}/store/install_plugin`, {
          id: data.id,
        }).then((resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.getPluginList()
            }
          } else {
            this.$message.error(resp.info)
          }
          loading.close()
        })
      })
    },
    handleCommand(s) {
      this.search = s
    },
    getPluginList() {
      var loading = this.getLoading(".table-border")
      this.getRequest(`${this.$root.prefix}/store/get_plugin_store`).then(
        (resp) => {
          loading.close()
          if (resp && resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info || "获取插件商店列表成功！")
              this.tableData = Array.isArray(resp.data.plugin_list) ? resp.data.plugin_list : []
              this.installModule = resp.data.install_module || []
              this.authorList = []
              if (Array.isArray(resp.data.plugin_list)) {
                for (let v of resp.data.plugin_list) {
                  if (v && v.author && !this.authorList.includes(v.author)) {
                    this.authorList.push(v.author)
                  }
                }
              }
            }
          } else {
            const errorMsg = resp ? resp.info : "无法获取插件商店列表，请检查网络连接或后端服务。";
            this.$message.error(errorMsg || "获取插件商店列表失败");
            this.tableData = [];
            this.installModule = [];
            this.authorList = [];
          }
        }
      ).catch(error => {
          loading.close();
          this.$message.error(`获取插件商店列表时出错: ${error.message || error}`);
          console.error("[StoreTemplate Error] getPluginList catch:", error);
          this.tableData = [];
          this.installModule = [];
          this.authorList = [];
      });
    },
    mouseover() {
      this.authorIcon = "author-white"
    },
    mouseout() {
      this.authorIcon = "author-red"
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  border-radius: 10px;
  height: 100%;

  .title {
    font-size: 40px;
    font-family: "fzrzFont";
    width: 100%;
    text-align: center;
  }

  .table-border {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    height: calc(100% - 205px);

    .name-border {
      display: flex;
      //   justify-content: center;
      align-items: center;
    }

    .github-icon {
      width: 25px;
      height: 25px;
      margin-left: 10px;
      cursor: pointer;
    }

    /deep/ .button-class {
      font-size: 14px;
    }

    .is-install {
      background-color: #3cc07d;
      color: white;
      padding: 2px 5px;
      border-radius: 5px;
      margin-left: 10px;
    }
  }

  .handle-btn {
    margin-right: 10px;
  }

  .filter {
    padding: 20px, 0;
    width: 100%;

    .search-input {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      /deep/ .el-input__inner {
        //   background-color: #f2f2f2;
        border-radius: 50px;
      }
    }

    .search-tag {
      margin-top: 35px;

      .search-tag-item {
        border-radius: 10px;
        background-color: white;
        height: 30px;
        width: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        border: 1px solid #ed6b6b;
        color: #ed6b6b;
        cursor: pointer;
      }

      .search-tag-item:hover {
        background-color: #ed6b6b;
        /deep/ .el-dropdown {
          color: white;
        }
      }

      /deep/ .el-dropdown {
        font-size: 15px;
        color: #ed6b6b;
      }
    }
  }
}
/deep/ .el-dropdown-menu__item {
  font-weight: 600;
}
</style>
