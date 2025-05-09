<template>
  <div
    class="detail-info bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-6 h-full overflow-y-auto"
  >
    <!-- 空状态 -->
    <div
      v-if="!detailType"
      class="flex flex-col items-center justify-center h-full"
    >
      <img
        src="@/assets/image/empty.png"
        class="w-64 h-64 object-contain mb-4"
        alt="空空如也"
      />
      <p class="text-pink-500 text-lg font-medium">空空如也 ┐(ﾟ～ﾟ)┌</p>
    </div>

    <!-- 详细信息 -->
    <template v-else>
      <!-- 头像和信息区域 -->
      <div class="flex flex-col items-center mb-6">
        <el-avatar
          :src="data.ava_url"
          class="border-4 border-pink-300 shadow-lg mb-4 transform hover:scale-105 transition-transform"
          :style="{
            height: sizeMana.avaSize + 'px',
            width: sizeMana.avaSize + 'px',
          }"
        ></el-avatar>

        <h2
          class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2"
        >
          {{ data.name }}
        </h2>

        <div
          class="px-4 py-2 bg-purple-500 text-white rounded-full text-sm shadow-md"
        >
          {{ data.user_id || data.group_id }}
        </div>
      </div>

      <!-- 基本信息区域 -->
      <div
        class="bg-white rounded-xl p-4 shadow-md mb-6 transform hover:shadow-lg transition-shadow"
      >
        <template v-if="detailType == 'private'">
          <!-- 好友信息 -->
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">封禁状态:</span>
              <MySwitch v-model="data.is_ban" :disabled="true" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">聊天记录:</span>
                <span class="font-medium text-purple-600">{{
                  data.chat_count
                }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-gray-600">调用次数:</span>
                <span class="font-medium text-pink-600">{{
                  data.call_count
                }}</span>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <!-- 群组信息 -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">状态:</span>
              <MySwitch v-model="data.status" />
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-600">群权限:</span>
              <el-select
                v-model="data.level"
                placeholder=""
                class="w-24"
                popper-class="cute-select"
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

            <div class="flex items-center justify-between">
              <span class="text-gray-600">当前人数:</span>
              <span class="font-medium text-purple-600">{{
                data.member_count
              }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-600">最大人数:</span>
              <span class="font-medium text-pink-600">{{
                data.max_member_count
              }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-600">聊天记录:</span>
              <span class="font-medium text-purple-600">{{
                data.chat_count
              }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-600">调用次数:</span>
              <span class="font-medium text-pink-600">{{
                data.call_count
              }}</span>
            </div>
          </div>

          <!-- 真寻特有设置 -->
          <template v-if="this.$store.state.botType == 'zhenxun'">
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600">被动状态:</span>
              </div>
              <el-select
                v-model="data.task_status"
                class="w-full"
                multiple
                popper-class="cute-select"
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
          </template>

          <!-- 插件设置 -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">禁用插件:</span>
            </div>
            <el-select
              v-model="data.plugin_status"
              multiple
              class="w-full"
              popper-class="cute-select"
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

          <!-- 应用按钮 -->
          <div class="flex justify-end">
            <MyButton
              text="应用设置"
              type="purple"
              :rounded="'lg'"
              :shadow="'lg'"
              :glow="true"
              :width="120"
              @click="commit"
            />
          </div>
        </template>
      </div>

      <!-- 最喜爱的插件图表 -->
      <div
        class="bg-white rounded-xl p-4 shadow-md transform hover:shadow-lg transition-shadow"
      >
        <h3 class="text-lg font-bold text-pink-600 mb-4">最喜爱的插件</h3>
        <div ref="likePluginChart" class="h-80 w-full"></div>
      </div>
    </template>
  </div>
</template>

<script>
import MyButton from '../ui/MyButton.vue'
import MySwitch from '../ui/MySwitch.vue'

import { cloneDeep } from 'lodash'
export default {
  components: { MySwitch, MyButton },
  name: 'DetailInfo',
  data() {
    return {
      sizeMana: {
        avaSize: 100,
      },
      data: {},
      botId: null,
      detailType: null,
      allPluginList: [],
      tmpAllPluginList: [],
      likePluginChart: null,
      chartOpt: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#e9d5ff',
          borderWidth: 1,
          textStyle: {
            color: '#7c3aed',
            fontFamily: '"Comic Sans MS", cursive',
          },
        },
        xAxis: {
          type: 'category',
          name: '插件',
          data: null,
          axisLabel: {
            interval: 0,
            color: '#7c3aed',
            fontFamily: '"Comic Sans MS", cursive',
          },
          axisLine: {
            lineStyle: {
              color: '#e9d5ff',
            },
          },
        },
        yAxis: {
          type: 'value',
          name: '次数',
          axisLabel: {
            color: '#7c3aed',
            fontFamily: '"Comic Sans MS", cursive',
          },
          axisLine: {
            lineStyle: {
              color: '#e9d5ff',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#f3e8ff',
            },
          },
        },
        series: [
          {
            type: 'bar',
            barWidth: '40%',
            label: {
              show: true,
              position: 'top',
              color: '#7c3aed',
              fontFamily: '"Comic Sans MS", cursive',
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  const colorList = [
                    '#C4B5FD',
                    '#A5B4FC',
                    '#86EFAC',
                    '#FDE047',
                    '#7DD3FC',
                    '#FCA5A5',
                    '#B9F3D0',
                    '#F9A8D4',
                  ]
                  return colorList[params.dataIndex % colorList.length]
                },
                barBorderRadius: [6, 6, 0, 0],
              },
            },
            emphasis: {
              focus: 'series',
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(167, 139, 250, 0.5)',
              },
            },
            data: {},
          },
        ],
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      },
    }
  },
  created() {
    this.botId = this.$store.state.botInfo.self_id
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  methods: {
    handleResize() {
      this.sizeMana.avaSize = 100
    },
    getAllPluginList() {
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_list`, {
        plugin_type: ['NORMAL', 'ADMIN'],
      }).then((resp) => {
        if (resp.suc) {
          this.allPluginList = resp.data
          this.$message.success(resp.info)
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
      const loading = this.getLoading('.detail-info')

      this.postRequest(`${this.$root.prefix}/manage/update_group`, data)
        .then((resp) => {
          if (resp.suc) {
            this.$message.success(resp.info)
            this.getGroup(data.group_id)
          } else {
            this.$message.error(resp.info)
          }
        })
        .finally(() => loading.close())
    },
    getFriend(user_id) {
      const loading = this.getLoading('.detail-info')

      this.getRequest(`${this.$root.prefix}/manage/get_friend_detail`, {
        bot_id: this.botId,
        user_id: user_id,
      }).then((resp) => {
        if (resp.suc) {
          this.processFriendData(resp.data)
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

      const loading = this.getLoading('.detail-info')

      this.getRequest(`${this.$root.prefix}/manage/get_group_detail`, {
        bot_id: this.botId,
        group_id: group_id,
      }).then((resp) => {
        if (resp.suc) {
          this.processGroupData(resp.data)
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    processFriendData(data) {
      data.name = data.remark || data.nickname
      this.data = data
      this.detailType = 'private'
      this.initChart(data.like_plugin)
      this.$emit('startChat', this.data)
    },
    processGroupData(data) {
      this.tmpAllPluginList = [...this.allPluginList]
      data.task_status = data.task.filter((e) => e.status).map((e) => e.name)
      data.plugin_status = data.close_plugins.map((e) => e.module)

      if (data.close_plugins.length) {
        const sbList = data.close_plugins
          .filter((e) => e.is_super_block)
          .map((e) => e.module)
        this.tmpAllPluginList.forEach((e) => {
          if (sbList.includes(e.module)) {
            e.plugin_name += '(超级用户禁用)'
          }
        })
      }

      this.data = data
      this.detailType = 'group'
      this.initChart(data.like_plugin)
      this.$emit('startChat', this.data)
    },
    initChart(likePluginObj) {
      this.$nextTick(() => {
        if (!this.likePluginChart) {
          this.likePluginChart = this.$echarts.init(this.$refs.likePluginChart)
        }

        const likePluginList = Object.keys(likePluginObj)
        const chartOpt = cloneDeep(this.chartOpt)

        chartOpt.xAxis.data = likePluginList
        chartOpt.series[0].data = likePluginList.map((e) => ({
          name: e,
          value: likePluginObj[e],
        }))

        this.likePluginChart.setOption(chartOpt)
        window.addEventListener('resize', this.resizeChart)
      })
    },
    resizeChart() {
      if (this.likePluginChart) {
        this.likePluginChart.resize()
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('resize', this.resizeChart)
    if (this.likePluginChart) {
      this.likePluginChart.dispose()
    }
  },
}
</script>

<style scoped>
/* 美化滚动条 */
.detail-info::-webkit-scrollbar {
  width: 6px;
}

.detail-info::-webkit-scrollbar-track {
  background: rgba(251, 207, 232, 0.3);
  border-radius: 3px;
}

.detail-info::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.5);
  border-radius: 3px;
}

.detail-info::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.7);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .detail-info {
    padding: 1rem;
  }

  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* 可爱的下拉选择框样式 */
.cute-select {
  background-color: #fff !important;
  border: 1px solid #e9d5ff !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.cute-select .el-select-dropdown__item {
  color: #7c3aed !important;
  font-family: '"Comic Sans MS", cursive' !important;
}

.cute-select .el-select-dropdown__item.hover,
.cute-select .el-select-dropdown__item:hover {
  background-color: #f3e8ff !important;
}

.cute-select .el-select-dropdown__item.selected {
  background-color: #e9d5ff !important;
  color: #7c3aed !important;
  font-weight: bold;
}
</style>
