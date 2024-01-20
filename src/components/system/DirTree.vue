<template>
  <div class="main">
    <div class="mid-info">
      <div class="mid-box">
        <one-mark text="这是一个标记的魔法" style="margin-top: 10px" />
        <div style="margin-left: 10px; margin-bottom: 20px">
          <span v-for="(path, i) in pathList" :key="i">
            <span class="path-item" @click="clickPath(i)">{{ path }}</span> /
          </span>
        </div>
        <div class="chart-box">
          <div ref="resourcesChart" class="base-chart"></div>
        </div>
      </div>
    </div>
    <div class="main-tree">
      <p class="tree-title">目录结构树</p>
      <el-tree
        ref="tree"
        :data="treeData"
        :props="props"
        :load="loadNode"
        lazy
        class="tree-class"
        :key="treeKey"
        :default-expanded-keys="defaultExpandedKeys"
        node-key="full_path"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span
            ><svg-icon
              :iconClass="getIcon(data)"
              path="vscode-icons"
              style="margin-right: 5px"
            />{{ node.label }}</span
          >
          <span>
            <el-popover placement="right" width="100" trigger="click">
              <template v-if="data.is_file">
                <p class="pop-select">查看</p>
                <p class="pop-select" @click="showRename(data)">重命名</p>
                <div class="rename-input" v-if="data.showRename">
                  <el-input v-model="data.rename"></el-input
                  ><my-button
                    text="确定"
                    :height="30"
                    :width="50"
                    @click="rename(data, 'file')"
                  />
                </div>
                <p
                  class="pop-select"
                  style="margin-bottom: 0"
                  @click="deleteFile(data)"
                >
                  删除
                </p>
              </template>
              <template v-else>
                <p class="pop-select" @click="showCreate(data)">新建文件</p>
                <div class="rename-input" v-if="data.showCreate">
                  <el-input v-model="data.createName"></el-input
                  ><my-button
                    text="确定"
                    :height="30"
                    :width="50"
                    @click="addFile(data)"
                  />
                </div>
                <p class="pop-select" @click="showRename(data)">重命名</p>
                <div class="rename-input" v-if="data.showRename">
                  <el-input v-model="data.rename"></el-input
                  ><my-button
                    text="确定"
                    :height="30"
                    :width="50"
                    @click="rename(data, 'folder')"
                  />
                </div>
                <p
                  class="pop-select"
                  style="margin-bottom: 0"
                  @click="deleteFolder(data)"
                >
                  删除
                </p>
              </template>
              <svg-icon
                :iconClass="data.is_file ? 'file-settings' : 'folder-settings'"
                slot="reference"
              />
            </el-popover>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import SvgIcon from "../SvgIcon/SvgIcon.vue"
import MyButton from "../ui/MyButton.vue"
// import { v4 } from "uuid"
import OneMark from "../ui/OneMark.vue"
export default {
  components: { OneMark, SvgIcon, MyButton },
  name: "DirTree",
  data() {
    return {
      defaultExpandedKeys: [],
      treeData: [],
      resourcesChart: null,
      treeKey: 0,
      vscodeIcons: [],
      pathList: ["/"],
      props: {
        label: "name",
        children: "children",
        isLeaf: "is_file",
      },
      option: {
        title: {
          text: "资源文件夹",
          subtext: "MB",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} MB ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "资源文件夹",
            type: "pie",
            radius: "50%",
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
    }
  },
  mounted() {
    this.resourcesChart = this.$echarts.init(this.$refs.resourcesChart)
    // this.getDir()
    this.loadIcons()
    this.getResourcesSize()
  },
  methods: {
    showRename(data) {
      data.showCreate = false
      data.showRename = !data.showRename
    },
    showCreate(data) {
      data.showRename = false
      data.showCreate = !data.showCreate
    },
    // 刷新树节点
    refreshNode(key) {
      if (!key) {
        this.treeKey++
      } else {
        let node = this.$refs.tree.getNode(key)
        node.loaded = false
        node.expand()
      }
    },
    nodeExpand(data) {
      this.defaultExpandedKeys.push(data.full_path)
    },
    nodeCollapse(data) {
      const index = this.defaultExpandedKeys.indexOf(data.full_path)
      if (index != -1) {
        this.defaultExpandedKeys.splice(index, 1)
      }
    },
    addFile(data) {
      console.log("data", data)

      const loading = this.getLoading(".main-tree")
      this.postRequest(`${this.$root.prefix}/system/add_file`, {
        parent: data.full_path,
        name: data.createName,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
          }
        } else {
          this.$message.error(resp.info)
        }
        this.refreshNode(data.parent)
        loading.close()
      })
      data.createName = ""
      data.showCreate = false
    },
    deleteFolder(data) {
      this.$confirm("确认删除文件夹吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: true,
        type: "warning",
      }).then(() => {
        const loading = this.getLoading(".main-tree")
        this.postRequest(`${this.$root.prefix}/system/delete_folder`, {
          full_path: data.full_path,
        }).then((resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.getResourcesSize()
            }
          } else {
            this.$message.error(resp.info)
          }
          this.refreshNode(data.parent)
          loading.close()
        })
      })
    },
    deleteFile(data) {
      this.$confirm("确认删除文件吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: true,
        type: "warning",
      }).then(() => {
        const loading = this.getLoading(".main-tree")
        this.postRequest(`${this.$root.prefix}/system/delete_file`, {
          full_path: data.full_path,
        }).then((resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.getResourcesSize()
            }
          } else {
            this.$message.error(resp.info)
          }
          this.refreshNode(data.parent)
          loading.close()
        })
      })
    },
    rename(data, type) {
      let url = ""
      if (type == "file") {
        url = `${this.$root.prefix}/system/rename_file`
      } else {
        url = `${this.$root.prefix}/system/rename_folder`
      }
      const loading = this.getLoading(".main-tree")
      this.postRequest(url, {
        parent: data.parent,
        old_name: data.name,
        name: data.rename,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
          }
        } else {
          this.$message.error(resp.info)
        }
        this.refreshNode(data.parent)
        loading.close()
      })
      data.rename = ""
      data.showRename = false
    },
    loadIcons() {
      const req = require.context(
        "@/assets/icons/svg/vscode-icons",
        false,
        /\.svg$/
      )
      const requireAll = (requireContext) => requireContext.keys()

      const re = /\.\/(.*)\.svg/

      this.vscodeIcons = requireAll(req).map((i) => {
        return i.match(re)[1]
      })
    },
    z2d(t) {
      const map = {
        py: "python",
        yml: "yaml",
        jpg: "image",
        jpeg: "image",
        png: "image",
        gif: "image",
        txt: "text",
      }
      return map[t]
    },
    getIcon(data) {
      if (!data.name) {
        return "default_file"
      }
      if (data.is_file) {
        const arr = data.name.split(".")
        const end = arr[arr.length - 1]
        const t = this.z2d(end) || end

        if (this.vscodeIcons.includes(`file_type_${t}`)) {
          return `file_type_${t}`
        }
        return "default_file"
      } else {
        if (this.vscodeIcons.includes(`folder_type_${data.name}`)) {
          return `folder_type_${data.name}`
        }
        return "default_folder"
      }
    },
    clickPath(i) {
      this.pathList = this.pathList.splice(0, i + 1)
      const tmpPath = [...this.pathList]
      tmpPath.shift()

      this.getResourcesSize(tmpPath.join("/"))
    },
    showFolderSize(param) {
      const data = param.data
      if (data.is_dir) {
        this.pathList.push(data.name)
        this.getResourcesSize(data.full_path)
      }
    },
    getResourcesSize(full_path) {
      const loading = this.getLoading(".chart-box")
      this.getRequest(`${this.$root.prefix}/system/get_resources_size`, {
        full_path,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            const tmpOpt = JSON.parse(JSON.stringify(this.option))
            if (resp.data) {
              tmpOpt.series[0].data = resp.data.map((e) => {
                return { value: e.size.toFixed(2), ...e }
              })
              this.resourcesChart.setOption(tmpOpt)
              // console.log("ddd", resp.data)
              this.resourcesChart.on("click", this.showFolderSize)
            }
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    async getDir(parent) {
      const resp = await this.getRequest(
        `${this.$root.prefix}/system/get_dir_list`,
        {
          path: parent,
        }
      )
      if (resp.suc) {
        if (resp.warning) {
          this.$message.warning(resp.warning)
        } else {
          this.$message.success(resp.info)
          return resp.data
        }
      } else {
        this.$message.error(resp.info)
      }
      return []
    },
    async loadNode(node, resolve) {
      const parent = node.data.parent
        ? node.data.parent + "/" + node.data.name
        : node.data.name
      const data = (await this.getDir(parent)).map((e) => {
        return {
          ...e,
          showRename: false,
          showCreate: false,
          full_path: e.parent ? `${e.parent}/${e.name}` : e.name,
        }
      })

      resolve(data)
    },
  },
}
</script>

<style lang="scss" scoped>
.pop-select {
  cursor: pointer;
  margin-bottom: 5px;
}

.pop-select:hover {
  background-color: #f5f7fa;
}

.rename-input {
  display: flex;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  height: 30px;
  margin-bottom: 10px;

  ::v-deep .button-class {
    border-radius: 0;
    font-size: 13px;
  }

  ::v-deep .el-input__inner {
    height: 30px;
    border-radius: 0;
  }
}

.main {
  height: 100%;
  width: 100%;
  display: flex;

  .mid-info {
    height: 100%;
    width: 67%;
    display: flex;
    justify-content: center;
    align-items: center;

    .mid-box {
      height: 100%;
      width: 100%;
      .path-item {
        color: #61c4fe;
        cursor: pointer;
      }
      .chart-box {
        height: calc(100% - 120px);
        width: 100%;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        .base-chart {
          width: 100%;
          height: 1000px;
        }
      }
    }
  }
  .main-tree {
    height: calc(100% - 120px);
    width: calc(30% - 60px);
    padding: 30px;
    // border: 1px solid #d3d3d4;
    border-radius: 10px;
    margin-top: 20px;
    background-color: #fff;

    .tree-title {
      // color: #939395;
      font-weight: bold;
      font-size: 18px;
      // border: 1px solid #d3d3d4;
      padding: 5px;
      border-radius: 10px;
      text-align: center;
      margin-bottom: 30px;
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .tree-class {
      height: calc(100% - 50px);
      overflow: auto;
      border-radius: 5px;
      // border: 1px solid #d3d3d4;
      background-color: #fff;
      font-size: 14px;
    }

    ::v-deep .el-tree-node__expand-icon {
      color: none;
    }
  }
}
</style>
