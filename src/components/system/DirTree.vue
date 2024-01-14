<template>
  <div class="main">
    <div class="mid-info">
      <!-- <one-mark :showDivider="false" text="这是一个标记的魔法" /> -->
      <div class="chart-box">
        <div ref="resourcesChart" class="base-chart"></div>
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
// import OneMark from "../ui/OneMark.vue"
export default {
  // components: { OneMark },
  name: "DirTree",
  data() {
    return {
      treeData: [],
      resourcesChart: null,
      loadKey: 0,
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
    this.getDir()
    this.getResourcesSize()
  },
  methods: {
    getResourcesSize() {
      this.getRequest("system/get_resources_size").then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            const tmpOpt = JSON.parse(JSON.stringify(this.option))
            if (resp.data) {
              tmpOpt.series[0].data = [
                { value: resp.data.font_dir_size.toFixed(2), name: "字体" },
                { value: resp.data.image_dir_size.toFixed(2), name: "图片" },
                { value: resp.data.text_dir_size.toFixed(2), name: "文本" },
                { value: resp.data.record_dir_size.toFixed(2), name: "语音" },
                { value: resp.data.temp_dir_size.toFixed(2), name: "临时文件" },
                { value: resp.data.data_dir_size.toFixed(2), name: "数据" },
                { value: resp.data.log_dir_size.toFixed(2), name: "日志" },
              ]
              this.resourcesChart.setOption(tmpOpt)
              console.log("ddd", resp.data)
              this.loadKey++
            }
          }
        } else {
          this.$message.error(resp.info)
        }
      })
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
          if (!parent) {
            this.treeData = resp.data
          }
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

    .chart-box {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .base-chart {
        width: 100%;
        height: 900px;
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
