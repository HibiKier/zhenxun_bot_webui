<template>
  <div class="right-info" ref="rightInfo">
    <div class="base-border" ref="baseBorder">
      <p
        class="base-title"
        :style="{ fontSize: fontSizeMana.titleText + 'px' }"
      >
        NoneBot配置
      </p>
      <div
        class="nb-config"
        :style="{ fontSize: fontSizeMana.nbConfig + 'px' }"
      >
        <el-row style="width: 100%">
          <el-col :span="12" style="border-right: solid 1px #dddfe5">
            <div class="nb-config-box-item">
              <p class="config-info-item-text">{{ botConfig.host }}</p>
              <p
                class="config-small-title"
                :style="{ fontSize: fontSizeMana.nbConfigTip + 'px' }"
              >
                host
              </p>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="nb-config-box-item">
              <p class="config-info-item-text">{{ botConfig.port }}</p>
              <p
                class="config-small-title"
                :style="{ fontSize: fontSizeMana.nbConfigTip + 'px' }"
              >
                port
              </p>
            </div>
          </el-col>
        </el-row>
        <el-divider />
        <el-row style="width: 100%">
          <el-col :span="12" style="border-right: solid 1px #dddfe5">
            <div class="nb-config-box-item">
              <el-tooltip
                class="tooltip-item"
                effect="dark"
                placement="top"
                :content="botConfig.driver || ''"
                :disabled="botConfig.driver.length < 5"
              >
                <p class="config-info-item-text">{{ botConfig.driver }}</p>
              </el-tooltip>
              <p
                class="config-small-title"
                :style="{ fontSize: fontSizeMana.nbConfigTip + 'px' }"
              >
                driver
              </p>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="nb-config-box-item">
              <p class="config-info-item-text">{{ botConfig.log_level }}</p>
              <p
                class="config-small-title"
                :style="{ fontSize: fontSizeMana.nbConfigTip + 'px' }"
              >
                log_level
              </p>
            </div>
          </el-col>
        </el-row>
        <el-divider />
        <el-row style="width: 100%">
          <el-col :span="12" style="border-right: solid 1px #dddfe5">
            <div class="nb-config-box-item">
              <p class="config-info-item-text">{{ botConfig.api_timeout }}</p>
              <p
                class="config-small-title"
                :style="{ fontSize: fontSizeMana.nbConfigTip + 'px' }"
              >
                api_timeout
              </p>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="nb-config-box-item">
              <p class="config-info-item-text">
                {{ botConfig.session_expire_timeout }}
              </p>
              <p
                class="config-small-title"
                :style="{ fontSize: fontSizeMana.nbConfigTip + 'px' }"
              >
                session_expire_timeout
              </p>
            </div>
          </el-col>
        </el-row>
        <el-divider />
        <el-row style="width: 100%">
          <el-col :span="24">
            <div class="nb-config-box-item" style="width: 100%">
              <p class="config-info-item-text">
                {{ botConfig.nicknames }}
              </p>
              <p
                class="config-small-title"
                :style="{ fontSize: fontSizeMana.nbConfigTip + 'px' }"
              >
                NICKNAME
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div :style="{ height: computedChartBorderHeight + 'px' }">
      <div
        class="base-border"
        :style="{
          marginTop: '18px',
          fontSize: fontSizeMana.chartTip + 'px',
          height: chartDivHeight + 'px',
        }"
      >
        <div class="active-group">
          <div style="height: 40px">
            <p
              class="base-title"
              style="margin-top: 10px; float: left"
              :style="{ fontSize: fontSizeMana.titleText + 'px' }"
            >
              活跃群聊
            </p>
            <div class="btn-group">
              <el-button
                type="text"
                :class="{ 'select-query-type': selectGroupType == 'all' }"
                @click="clickGroupType('all')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >ALL</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectGroupType == 'day' }"
                @click="clickGroupType('day')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >DAY</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectGroupType == 'week' }"
                @click="clickGroupType('week')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >WEEK</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectGroupType == 'month' }"
                @click="clickGroupType('month')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >MONTH</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectGroupType == 'year' }"
                @click="clickGroupType('year')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >YEAR</el-button
              >
            </div>
          </div>
          <div class="group-chart">
            <div
              ref="groupChart"
              class="base-chart"
              :style="{ height: computedChartHeight + 'px' }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="base-border"
        :style="{
          marginTop: '18px',
          fontSize: fontSizeMana.chartTip + 'px',
          height: chartDivHeight + 'px',
        }"
      >
        <div class="hot-plugin">
          <div style="height: 40px">
            <p
              class="base-title"
              style="margin-top: 10px; float: left"
              :style="{ fontSize: fontSizeMana.titleText + 'px' }"
            >
              热门插件
            </p>
            <div class="btn-group">
              <el-button
                type="text"
                :class="{ 'select-query-type': selectHotPluginType == 'all' }"
                @click="clickHotPluginType('all')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >ALL</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectHotPluginType == 'day' }"
                @click="clickHotPluginType('day')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >DAY</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectHotPluginType == 'week' }"
                @click="clickHotPluginType('week')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >WEEK</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectHotPluginType == 'month' }"
                @click="clickHotPluginType('month')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >MONTH</el-button
              >
              <el-button
                type="text"
                :class="{ 'select-query-type': selectHotPluginType == 'year' }"
                @click="clickHotPluginType('year')"
                :style="{ fontSize: fontSizeMana.chartTip + 'px' }"
                >YEAR</el-button
              >
            </div>
          </div>
          <div>
            <div
              ref="hotPluginChart"
              class="base-chart"
              :style="{ height: computedChartHeight + 'px' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFontSize } from "@/utils/utils"
export default {
  name: "RightInfo",
  data() {
    return {
      fontSizeMana: {
        nbConfig: 25,
        nbConfigTip: 13,
        titleText: 20,
        chartTip: 15,
      },
      chartHeight: 0,
      chartDivHeight: 0,
      chartBorderHeight: 0,
      botInfo: null,
      botConfig: { driver: "" },
      selectGroupType: "all",
      selectHotPluginType: "all",
      groupChart: null,
      hotPluginChart: null,
      groupCntInterval: null, //活跃数量定时器
      chartOpt: {
        grid: {
          top: "10%", // 控制数据表距离画布顶部的距离
          bottom: "20%", // 控制数据表距离画布底部的距禿
          left: "15%", // 控制数据表距离画布左侧的距离
          right: "15%", // 控制数据表距离画布右侧的距离
        },
        tooltip: {
          formatter: function (params) {
            return params.value // 鼠标悬停时显示完整的标签内容
          },
        }, // 工具提示组件
        xAxis: {
          type: "category",
          name: "",
          data: [],
          axisLabel: {
            interval: 0, //强制显示所有标签
            rotate: 10,
            formatter: function (value) {
              return value.length > 8 ? value.slice(0, 8) + "..." : value
            },
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
            data: [], // 数据源
          },
        ],
      },
    }
  },
  computed: {
    computedChartHeight() {
      if (!this.chartHeight) {
        this.handleResize()
      }
      return this.chartHeight
    },
    computedChartDivHeight() {
      if (!this.chartDivHeight) {
        this.handleResize()
      }
      return this.chartDivHeight
    },
    computedChartBorderHeight() {
      if (!this.chartBorderHeight) {
        this.handleResize()
      }
      return this.chartBorderHeight
    },
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.groupChart = this.$echarts.init(this.$refs.groupChart)
    this.hotPluginChart = this.$echarts.init(this.$refs.hotPluginChart)
    this.getNonebotConfig()
    this.getActiveGroupData()
    this.getHotPlugin()
    this.groupCntInterval = setInterval(() => {
      this.getActiveGroupData(this.selectGroupType, true)
    }, 25000)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
    if (this.groupCntInterval) {
      clearInterval(this.groupCntInterval)
    }
  },
  methods: {
    handleResize() {
      this.initFontSize()
      this.$nextTick(() => {
        setTimeout(() => {
          this.chartBorderHeight =
            this.$refs.rightInfo.offsetHeight -
            this.$refs.baseBorder.offsetHeight -
            18
          this.chartDivHeight = (this.chartBorderHeight - 16) / 2
          this.chartHeight = this.chartDivHeight - 82
          this.groupChart.resize()
          this.hotPluginChart.resize()
        }, 500)
      })
    },
    initFontSize() {
      this.fontSizeMana.nbConfig = getFontSize(25)
      this.fontSizeMana.nbConfigTip = getFontSize(13)
      this.fontSizeMana.titleText = getFontSize(17)
      this.fontSizeMana.chartTip = getFontSize(15)
    },
    getNonebotConfig() {
      const loading = this.getLoading(".base-border")
      this.getRequest(`${this.$root.prefix}/dashboard/get_nonebot_config`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.info)
            } else {
              this.$message.success(resp.info)
              this.botConfig = resp.data
              this.botConfig.nicknames = ""
              if (this.botConfig.nickname) {
                this.botConfig.nicknames = this.botConfig.nickname.join(",")
              }
            }
          } else {
            this.$message.error(resp.info)
          }
          loading.close()
        }
      )
    },
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
  padding: 0 10px;
  height: 100%;

  ::v-deep .el-divider--horizontal {
    margin: 10px 0;
  }

  .config-small-title {
    color: #afb2b9;
    font-size: 13px;
    margin-bottom: 5px;
  }

  .btn-group {
    float: right;
  }

  .base-title {
    color: #939395;
    margin-bottom: 30px;
  }

  .base-border {
    border-radius: 10px;
    padding: 20px;
    background-color: white;
    box-sizing: border-box;
  }

  .nb-config {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    /deep/ .el-col {
      text-align: center;
      white-space: nowrap; /* 防止文本换行 */
      overflow: hidden; /* 隐藏超出部分的文本 */
      text-overflow: ellipsis; /* 显示省略号 */
    }

    ::v-deep .el-divider--horizontal {
      margin: 0;
    }

    ::v-deep .el-divider--vertical {
      margin: 0 50px;
      height: 73px;
    }

    .nb-config-box-item {
      // .tooltip-item {
      //   white-space: nowrap; /* 防止文本换行 */
      //   overflow: hidden; /* 隐藏超出部分的文本 */
      //   text-overflow: ellipsis; /* 显示省略号 */
      // }

      .config-info-item-text {
        margin-bottom: 10px;
        margin-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 10px;
        margin-bottom: 5px;
      }
    }
  }

  .base-chart {
    height: 293px;
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
