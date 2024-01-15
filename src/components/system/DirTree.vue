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
        :data="treeData"
        :props="props"
        :load="loadNode"
        lazy
        class="tree-class"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
// import { v4 } from "uuid"
import OneMark from "../ui/OneMark.vue"
export default {
  components: { OneMark },
  name: "DirTree",
  data() {
    return {
      treeData: [],
      resourcesChart: null,
      loadKey: 0,
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
    this.getResourcesSize()
  },
  methods: {
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
      this.getRequest("system/get_resources_size", { full_path }).then(
        (resp) => {
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
        }
      )
    },
    async getDir(parent) {
      const resp = await this.getRequest("system/get_dir_list", {
        path: parent,
      })
      if (resp.suc) {
        if (resp.warning) {
          this.$message.warning(resp.warning)
        } else {
          this.$message.success(resp.info)
          // if (!parent) {
          //   this.treeData = resp.data
          // }
          // resp.data.forEach((e) => {
          //   // e.uid = v4()
          // })
          return resp.data
        }
      } else {
        this.$message.error(resp.info)
      }
    },
    async loadNode(node, resolve) {
      const parent = node.data.parent
        ? node.data.parent + "/" + node.data.name
        : node.data.name
      const data = await this.getDir(parent)
      resolve(data)
    },
  },
}
</script>

<style lang="scss" scoped>
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
          height: 700px;
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
