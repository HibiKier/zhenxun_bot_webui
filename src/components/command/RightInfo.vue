<template>
  <div class="right-info">
    <div class="image-l">
      <el-image :src="require('@/assets/image/zx_img.jpg')" fit="fill" />
    </div>
    <div class="base-border" style="margin-top: 18px">
      <div class="active-group">
        <div style="height: 40px">
          <p class="base-title" style="margin-top: 10px; float: left">
            活跃群聊
          </p>
          <div class="btn-group">
            <el-button
              type="text"
              :class="{ 'select-query-type': selectGroupType == 'all' }"
              @click="clickGroupType('all')"
              >ALL</el-button
            >
            <el-button
              type="text"
              :class="{ 'select-query-type': selectGroupType == 'day' }"
              @click="clickGroupType('day')"
              >DAY</el-button
            >
            <el-button
              type="text"
              :class="{ 'select-query-type': selectGroupType == 'week' }"
              @click="clickGroupType('week')"
              >WEEK</el-button
            >
            <el-button
              type="text"
              :class="{ 'select-query-type': selectGroupType == 'month' }"
              @click="clickGroupType('month')"
              >MONTH</el-button
            >
            <el-button
              type="text"
              :class="{ 'select-query-type': selectGroupType == 'year' }"
              @click="clickGroupType('year')"
              >YEAR</el-button
            >
          </div>
        </div>
        <div class="group-chart">
          <div ref="groupChart" class="base-chart"></div>
        </div>
      </div>
    </div>
    <div class="base-border" style="margin-top: 18px">
      <div class="hot-plugin">
        <div style="height: 40px">
          <p class="base-title" style="margin-top: 10px; float: left">
            热门插件
          </p>
          <div class="btn-group">
            <el-button
              type="text"
              :class="{ 'select-query-type': selectHotPluginType == 'all' }"
              @click="clickHotPluginType('all')"
              >ALL</el-button
            >
            <el-button
              type="text"
              :class="{ 'select-query-type': selectHotPluginType == 'day' }"
              @click="clickHotPluginType('day')"
              >DAY</el-button
            >
            <el-button
              type="text"
              :class="{ 'select-query-type': selectHotPluginType == 'week' }"
              @click="clickHotPluginType('week')"
              >WEEK</el-button
            >
            <el-button
              type="text"
              :class="{ 'select-query-type': selectHotPluginType == 'month' }"
              @click="clickHotPluginType('month')"
              >MONTH</el-button
            >
            <el-button
              type="text"
              :class="{ 'select-query-type': selectHotPluginType == 'year' }"
              @click="clickHotPluginType('year')"
              >YEAR</el-button
            >
          </div>
        </div>
        <div>
          <div ref="hotPluginChart" class="base-chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RightInfo",
  data() {
    return {
      tableData: [
        { date: "2025/10/3", ip: "0.0.0.0", time: "11:45:14" },
        { date: "2025/10/2", ip: "127.0.0.1", time: "11:45:14" },
      ],
      botInfo: null,
      botConfig: {},
      selectGroupType: "all",
      selectHotPluginType: "all",
      groupChart: null,
      hotPluginChart: null,
      groupCntInterval: null, //活跃数量定时器
      chartOpt: {
        tooltip: {}, // 工具提示组件
        xAxis: {
          type: "category",
          name: "",
          data: null,
          axisLabel: {
            interval: 0, //强制显示所有标签
            // rotate: 15,
          },
        }, // X轴
        yAxis: { type: "value" }, // Y轴
        series: [
          {
            type: "bar", // 柱状图系列
            barWidth: "40%", // 柱子宽度
            label: { show: true }, // 标签展示
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: (params) => {
                  var colorList = [
                    "#855BD7",
                    "#4B6FB8",
                    "#0F6E43",
                    "#B69C2B",
                    "#2588BB",
                    "#BB612D",
                    "#1D9394",
                    "#C24545",
                  ]
                  return colorList[params.dataIndex]
                },
              },
            },
            emphasis: { focus: "series" }, // 高亮效果
            data: null, // 数据源
          },
        ],
      },
    }
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
    if (this.botInfo) {
      this.botConfig = this.botInfo.config || {}
    }
  },
  mounted() {
    this.groupChart = this.$echarts.init(this.$refs.groupChart)
    this.hotPluginChart = this.$echarts.init(this.$refs.hotPluginChart)
    this.getActiveGroupData()
    this.getHotPlugin()
    this.groupCntInterval = setInterval(() => {
      this.getActiveGroupData(this.selectGroupType, true)
    }, 25000)
  },
  destroyed() {
    if (this.groupCntInterval) {
      clearInterval(this.groupCntInterval)
    }
  },
  methods: {
    clickGroupType(type) {
      this.selectGroupType = type
      this.getActiveGroupData(type)
    },
    getActiveGroupData(date_type, no_loading) {
      if (date_type == "all") {
        date_type = null
      }
      if (!no_loading) {
        var loading = this.getLoading(".active-group")
      }
      this.getRequest(`${this.$root.prefix}/main/get_active_group`, {
        date_type,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            if (loading) {
              this.$message.warning(resp.info)
            }
          } else {
            if (loading) {
              this.$message.success(resp.info)
            }
            const tmpOpt = JSON.parse(JSON.stringify(this.chartOpt))
            const group_list = []
            const data = resp.data.map((e) => {
              group_list.push(e.name)
              return {
                name: e.group_id,
                value: e.chat_num,
              }
            })
            tmpOpt.xAxis.name = "群聊"
            tmpOpt.xAxis.data = group_list
            tmpOpt.series[0].data = data
            this.groupChart.setOption(tmpOpt)
          }
        } else {
          if (loading) {
            this.$message.error(resp.info)
          }
        }
        if (loading) {
          loading.close()
        }
      })
    },
    clickHotPluginType(type) {
      this.selectHotPluginType = type
      if (type == "all") {
        type = null
      }
      this.getHotPlugin(type)
    },
    getHotPlugin(date_type) {
      const loading = this.getLoading(".hot-plugin")
      this.getRequest(`${this.$root.prefix}/main/get_hot_plugin`, {
        date_type,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.info)
          } else {
            this.$message.success(resp.info)
            const tmpOpt = JSON.parse(JSON.stringify(this.chartOpt))
            const hotPluginList = []
            const data = resp.data.map((e) => {
              hotPluginList.push(e.name)
              return {
                name: e.name,
                value: e.count,
              }
            })
            tmpOpt.xAxis.name = "插件"
            tmpOpt.xAxis.data = hotPluginList
            tmpOpt.series[0].data = data
            this.hotPluginChart.setOption(tmpOpt)
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.right-info {
  padding: 0 20px;

  .base-border {
    border-radius: 10px;
    padding: 20px;
    background-color: white;
  }
  ::v-deep .el-divider--horizontal {
    margin: 10px 0;
  }

  .config-small-title {
    color: #afb2b9;
    font-size: 13px;
  }

  .btn-group {
    float: right;
  }

  .base-title {
    color: #939395;
    margin-bottom: 30px;
  }

  .image-l {
    padding: 30px;
    border-radius: 10px;
    background-color: white;
    height: 305px;
    width: 421px;
    border: 1px solid #e0e0e0;
  }
  .base-chart {
    width: 100%;
    height: 298px;
  }

  .active-group {
    // display: flex;

    .el-button {
      color: #a3a6af;
    }
  }
  .select-query-type {
    font-weight: bold;
    color: #262729;
  }
  .hot-plugin {
    .el-button {
      color: #a3a6af;
    }
  }
}
</style>
