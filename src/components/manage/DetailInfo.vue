<template>
  <div class="detail-info">
    <div v-if="!detailType" class="empty">
      <el-empty
        :image-size="350"
        :image="require('../../assets/image/empty.png')"
        description="空空如也 ┐(ﾟ～ﾟ)┌ "
      ></el-empty>
    </div>
    <template v-else>
      <el-row>
        <el-col :span="24">
          <div class="ava-info">
            <el-avatar
              :src="data.ava_url"
              class="u-ava"
              :style="{
                height: sizeMana.avaSize + 'px',
                width: sizeMana.avaSize + 'px',
              }"
            ></el-avatar>
            <el-row>
              <el-col :span="24">
                <div
                  class="nickname"
                  :style="{ fontSize: sizeMana.nameText + 'px' }"
                >
                  {{ data.name }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div
                  class="account"
                  :style="{ fontSize: sizeMana.accountText + 'px' }"
                >
                  {{ data.user_id || data.group_id }}
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <div class="base-info" ref="baseInfo">
        <template v-if="detailType == 'private'">
          <el-row>
            <el-col :span="24">
              <div class="base-info-item">
                <div
                  class="label"
                  :style="{ fontSize: sizeMana.labelFontSize + 'px' }"
                >
                  封禁状态
                </div>
                <div
                  class="value"
                  :style="{ fontSize: sizeMana.valueFontSize + 'px' }"
                >
                  <MySwitch v-model="data.is_ban" :disabled="true" />
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="base-info-item">
                <div
                  class="label"
                  :style="{ fontSize: sizeMana.labelFontSize + 'px' }"
                >
                  聊天记录
                </div>
                <div
                  class="value"
                  :style="{ fontSize: sizeMana.valueFontSize + 'px' }"
                >
                  {{ data.chat_count }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="base-info-item">
                <div
                  class="label"
                  :style="{ fontSize: sizeMana.labelFontSize + 'px' }"
                >
                  调用次数
                </div>
                <div
                  class="value"
                  :style="{ fontSize: sizeMana.valueFontSize + 'px' }"
                >
                  {{ data.call_count }}
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="12">
              <div class="base-info-item">
                <div
                  class="label"
                  :style="{ fontSize: sizeMana.labelFontSize + 'px' }"
                >
                  状态
                </div>
                <el-divider direction="vertical" />
                <div class="value">
                  <MySwitch v-model="data.status" />
                </div>
              </div> </el-col
            ><el-col :span="12">
              <div class="base-info-item">
                <div
                  class="label"
                  :style="{ fontSize: sizeMana.labelFontSize + 'px' }"
                >
                  群权限
                </div>
                <el-divider direction="vertical" class="a-divider" />
                <div
                  class="value"
                  style="margin-left: 5px"
                  :style="{ fontSize: sizeMana.valueFontSize + 'px' }"
                >
                  <el-select
                    v-model="data.level"
                    placeholder=""
                    style="width: 62px"
                  >
                    <el-option :label="-1" :value="-1"></el-option>
                    <el-option
                      v-for="n in 10"
                      :label="n"
                      :value="n"
                      :key="n"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="base-info-item">
                <div
                  class="label"
                  :style="{ fontSize: sizeMana.labelFontSize + 'px' }"
                >
                  当前人数
                </div>
                <el-divider direction="vertical" />
                <div
                  class="value"
                  :style="{ fontSize: sizeMana.valueFontSize + 'px' }"
                >
                  {{ data.member_count }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="base-info-item">
                <div
                  class="label"
                  :style="{ fontSize: sizeMana.labelFontSize + 'px' }"
                >
                  最大人数
                </div>
                <el-divider direction="vertical" />
                <div
                  class="value"
                  :style="{ fontSize: sizeMana.valueFontSize + 'px' }"
                >
                  {{ data.max_member_count }}
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="base-info-item">
                <div
                  class="label"
                  :style="{ fontSize: sizeMana.labelFontSize + 'px' }"
                >
                  聊天记录
                </div>
                <el-divider direction="vertical" />
                <div
                  class="value"
                  :style="{ fontSize: sizeMana.valueFontSize + 'px' }"
                >
                  {{ data.chat_count }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="base-info-item">
                <div
                  class="label"
                  :style="{ fontSize: sizeMana.labelFontSize + 'px' }"
                >
                  调用次数
                </div>
                <el-divider direction="vertical" />
                <div
                  class="value"
                  :style="{ fontSize: sizeMana.valueFontSize + 'px' }"
                >
                  {{ data.call_count }}
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="this.$store.state.botType == 'zhenxun'">
            <el-col :span="24">
              <div class="base-info-item">
                <div
                  class="label"
                  :style="{ fontSize: sizeMana.labelFontSize + 'px' }"
                >
                  被动状态
                </div>
                <el-divider direction="vertical" class="a-divider" />
                <div
                  class="value"
                  :style="{ fontSize: sizeMana.valueFontSize + 'px' }"
                >
                  <el-select
                    v-model="data.task_status"
                    :style="{ width: sizeMana.selectWidth + 'px' }"
                    multiple
                  >
                    <el-option
                      v-for="n in data.task"
                      :label="n.zh_name"
                      :value="n.name"
                      :key="n.name"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div style="display: flex">
                <div class="base-info-item" style="width: 100%">
                  <div
                    class="label"
                    :style="{ fontSize: sizeMana.labelFontSize + 'px' }"
                  >
                    禁用插件
                  </div>
                  <el-divider direction="vertical" class="a-divider" />
                  <div
                    class="value"
                    :style="{ fontSize: sizeMana.valueFontSize + 'px' }"
                  >
                    <el-select
                      v-model="data.plugin_status"
                      multiple
                      :style="{ width: sizeMana.selectWidth + 'px' }"
                    >
                      <el-option
                        v-for="n in tmpAllPluginList"
                        :label="n.plugin_name"
                        :value="n.module"
                        :key="n.module"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <div>
            <MyButton
              text="应用"
              class="commit-btn"
              :width="100"
              @click="commit"
            />
          </div>
        </template>
        <el-divider />
        <p class="base-title">最喜爱的插件</p>
        <div>
          <div ref="likePluginChart" class="base-chart"></div>
        </div>
      </div>
      <template v-if="detailType == 'private'">
        <el-divider />
        <OneMark text="不太清楚，这是一个标记的魔法" :showDivider="false" />
      </template>
    </template>
  </div>
</template>

<script>
import { getConvertSize, getFontSize } from "@/utils/utils"
import MyButton from "../ui/MyButton.vue"
import MySwitch from "../ui/MySwitch.vue"
import OneMark from "../ui/OneMark.vue"
export default {
  components: { MySwitch, OneMark, MyButton },
  name: "DetailInfo",
  data() {
    return {
      sizeMana: {
        labelFontSize: 20,
        valueFontSize: 25,
        accountText: 20,
        nameText: 20,
        avaSize: 100,
        selectWidth: 170,
      },
      data: {},
      botId: null,
      detailType: null,
      allPluginList: [],
      tmpAllPluginList: [],
      likePluginChart: null,
      chartOpt: {
        tooltip: {}, // 工具提示组件
        xAxis: {
          type: "category",
          name: "",
          data: null,
          axisLabel: {
            interval: 0, //强制显示所有标签
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
            data: {}, // 数据源
          },
        ],
      },
    }
  },
  created() {
    this.botId = this.$store.state.botInfo.self_id
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.handleResize()
  },
  methods: {
    handleResize() {
      this.sizeMana.labelFontSize = getFontSize(17)
      this.sizeMana.valueFontSize = getFontSize(25)
      this.sizeMana.accountText = getFontSize(20)
      this.sizeMana.nameText = getFontSize(30)
      this.sizeMana.avaSize = getConvertSize(100, 1024)
      if (this.$refs.baseInfo) {
        this.sizeMana.selectWidth = this.$refs.baseInfo.offsetWidth - 160
      }
    },
    getAllPluginList() {
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_list`, {
        plugin_type: ["NORMAL", "ADMIN"],
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.allPluginList = resp.data
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    commit() {
      const data = {
        group_id: this.data.group_id,
        status: this.data.status,
        level: this.data.level,
        task: this.data.task_status,
        close_plugins: this.data.plugin_status,
      }
      const loading = this.getLoading(".detail-info")
      this.postRequest(`${this.$root.prefix}/manage/update_group`, data).then(
        (resp) => {
          if (resp) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.getGroup(data.group_id)
            }
          } else {
            this.$message.error(resp.info)
          }
          loading.close()
        }
      )
    },
    getFriend(user_id) {
      const loading = this.getLoading(".detail-info")
      this.getRequest(`${this.$root.prefix}/manage/get_friend_detail`, {
        bot_id: this.botId,
        user_id: user_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            resp.data.name = resp.data.remark || resp.data.nickname
            this.data = resp.data
            this.detailType = "private"
            this.$nextTick(() => {
              this.likePluginChart = this.$echarts.init(
                this.$refs.likePluginChart
              )
              const likePluginObj = resp.data.like_plugin
              const tmpOpt = JSON.parse(JSON.stringify(this.chartOpt))
              const likePluginList = []
              const likePlugin = Object.keys(likePluginObj).map((e) => {
                likePluginList.push(e)
                return {
                  name: e,
                  value: likePluginObj[e],
                }
              })
              tmpOpt.yAxis.name = "次数"
              tmpOpt.xAxis.name = "插件"
              tmpOpt.xAxis.data = likePluginList
              tmpOpt.series[0].data = likePlugin
              this.likePluginChart.setOption(tmpOpt)
              this.$emit("startChat", this.data)
              this.handleResize()
            })
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    async getGroup(group_id) {
      if (!this.allPluginList.length) {
        await this.getAllPluginList()
      }
      const loading = this.getLoading(".detail-info")
      this.getRequest(`${this.$root.prefix}/manage/get_group_detail`, {
        bot_id: this.botId,
        group_id: group_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.tmpAllPluginList = JSON.parse(
              JSON.stringify(this.allPluginList)
            )
            this.$message.success(resp.info)
            resp.data.task_status = resp.data.task
              .filter((e) => {
                return e.status
              })
              .map((e) => {
                return e.name
              })
            resp.data.plugin_status = resp.data.close_plugins.map((e) => {
              return e.module
            })
            this.data = resp.data
            if (this.data.close_plugins.length) {
              let sbList = []
              this.data.close_plugins.forEach((e) => {
                if (e.is_super_block) {
                  sbList.push(e.module)
                }
              })

              this.tmpAllPluginList.forEach((e) => {
                if (sbList.includes(e.module)) {
                  e.plugin_name = e.plugin_name + "(超级用户禁用)"
                }
              })
            }
            this.detailType = "group"
            this.$nextTick(() => {
              this.likePluginChart = this.$echarts.init(
                this.$refs.likePluginChart
              )
              const likePluginObj = resp.data.like_plugin
              const tmpOpt = JSON.parse(JSON.stringify(this.chartOpt))
              const likePluginList = []
              const likePlugin = Object.keys(likePluginObj).map((e) => {
                likePluginList.push(e)
                return {
                  name: e,
                  value: likePluginObj[e],
                }
              })
              tmpOpt.yAxis.name = "次数"
              tmpOpt.xAxis.name = "插件"
              tmpOpt.xAxis.data = likePluginList
              tmpOpt.series[0].data = likePlugin
              this.likePluginChart.setOption(tmpOpt)
              this.$emit("startChat", this.data)
              this.handleResize()
            })
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style lang="scss" scoped>
.detail-info {
  background-color: #f4f5fa;
  padding: 40px 20px;
  box-sizing: border-box;

  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ava-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .u-ava {
      height: 100px;
      width: 100px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .nickname {
      font-size: 30px;
      font-weight: 500;
      margin-top: 20px;
    }
  }

  .base-info {
    margin-top: 15px;
    .base-info-item {
      display: flex;
      margin-left: 30px;
      margin-top: 5px;

      ::v-deep .el-divider--vertical {
        height: 30px;
      }

      .a-divider {
        margin-top: 6px;
      }

      .label {
        color: #939395;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .value {
        font-size: 25px;
        margin-left: 10px;
      }
    }
  }
  .base-chart {
    width: 100%;
    height: 360px;
  }

  .account {
    color: #ffffff;
    background-color: #5c87ff;
    padding: 6px;
    margin-top: 13px;
    border-radius: 5px;
  }

  /deep/ .el-col {
    margin-top: 10px;
  }
}

.commit-btn {
  float: right;
  margin-top: 30px;
}

.base-title {
  color: #939395;
  font-size: 20px;
  margin-bottom: 20px;
  margin-top: 50px;
}
</style>
