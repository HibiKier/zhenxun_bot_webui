<template>
  <div class="right-info bg-pink-50 p-4 md:p-4 h-full" ref="rightInfo">
    <!-- NoneBot配置卡片 - 更紧凑的版本 -->
    <div
      class="base-border bg-white rounded-lg p-4 shadow-sm mb-2 h-auto min-h-[120px]"
      ref="baseBorder"
    >
      <p class="base-title mb-1 text-purple-600 flex items-center">
        <i class="fas fa-cog mr-1 text-xs"></i> NoneBot配置
      </p>
      <div class="nb-config grid grid-cols-2 gap-1 px-0.5">
        <div
          v-for="(item, key) in configItems"
          :key="key"
          class="bg-gradient-to-br from-pink-50 to-purple-50 rounded-sm p-1 border border-pink-100"
        >
          <el-tooltip
            effect="light"
            :content="String(item.value)"
            placement="top"
            popper-class="max-w-xs break-words"
          >
            <p
              class="config-info-item-text truncate leading-tight cursor-default"
            >
              {{ item.value }}
            </p>
          </el-tooltip>
          <p
            class="config-small-title text-pink-500 font-bold uppercase tracking-tighter mt-0"
          >
            {{ item.label }}
          </p>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="space-y-4 min-h-[300px]">
      <!-- 活跃群聊图表 -->
      <div
        class="base-border bg-white rounded-xl p-4 shadow-lg h-full min-h-[300px]"
        :style="{ height: computedChartDivHeight + 'px' }"
      >
        <div
          ref="activeGroupBorder"
          class="flex justify-between items-center mb-2"
        >
          <p class="text-purple-600 mb-1 md:mb-0 flex items-center">
            <i class="fas fa-users mr-1 text-pink-500 animate-bounce"></i>
            活跃群组
          </p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="type in timeTypes"
              :key="'group' + type.value"
              @click="clickGroupType(type.value)"
              class="px-2 py-0.5 rounded-full transition-all duration-200"
              :class="{
                'bg-purple-500 text-white shadow-sm':
                  selectGroupType === type.value,
                'bg-pink-100 text-pink-600 hover:bg-pink-200':
                  selectGroupType !== type.value,
              }"
            >
              {{ type.label }}
            </button>
          </div>
        </div>
        <div
          ref="groupChart"
          class="w-full"
          :style="{ height: computedChartHeight + 'px' }"
        ></div>
      </div>

      <!-- 热门插件图表 -->
      <div
        class="base-border bg-white rounded-xl p-4 shadow-lg h-full min-h-[300px]"
        :style="{ height: computedChartDivHeight + 'px' }"
      >
        <div
          ref="hotPluginBorder"
          class="flex justify-between items-center mb-2"
        >
          <p class="text-purple-600 mb-1 md:mb-0 flex items-center">
            <i class="fas fa-users mr-1 text-pink-500 animate-bounce"></i>
            热门插件
          </p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="type in timeTypes"
              :key="'plugin' + type.value"
              @click="clickHotPluginType(type.value)"
              class="px-2 py-0.5 rounded-full transition-all duration-200"
              :class="{
                'bg-purple-500 text-white shadow-sm':
                  selectGroupType === type.value,
                'bg-pink-100 text-pink-600 hover:bg-pink-200':
                  selectGroupType !== type.value,
              }"
            >
              {{ type.label }}
            </button>
          </div>
        </div>
        <div
          ref="hotPluginChart"
          class="w-full"
          :style="{ height: computedChartHeight + 'px' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/utils/event-bus'
import { debounce, cloneDeep } from 'lodash'
export default {
  name: 'RightInfo',
  data() {
    return {
      timeTypes: [
        { label: '全部', value: 'all' },
        { label: '日', value: 'day' },
        { label: '周', value: 'week' },
        { label: '月', value: 'month' },
        { label: '年', value: 'year' },
      ],
      chartHeight: 0,
      chartDivHeight: 0,
      chartBorderHeight: 0,
      botInfo: null,
      botConfig: {
        host: '127.0.0.1',
        port: '8080',
        driver: '~fastapi+~httpx+~websockets',
        log_level: 'INFO',
        api_timeout: '30.0',
        session_expire_timeout: '30',
        nickname: [],
      },
      selectGroupType: 'all',
      selectHotPluginType: 'all',
      groupChart: null,
      hotPluginChart: null,
      groupCntInterval: null,
      chartOpt: {
        grid: {
          top: '15%',
          bottom: '30%',
          left: '20%',
          right: '10%',
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => `
    <div class="chart-tooltip">
      <div class="tooltip-title">${params.name}</div>
      <div class="tooltip-value">${params.value}次</div>
    </div>
  `,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#FF9FF3', // 改为粉红色
          borderWidth: 2, // 加粗边框
          padding: [8, 12],
          extraCssText:
            'box-shadow: 0 4px 20px rgba(255, 159, 243, 0.3); border-radius: 8px;',
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#FF9FF3',
              width: 2,
            },
          },
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: '#f3e8ff',
            },
          },
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: '#9333ea',
            fontSize: 11,
            fontFamily: 'Microsoft YaHei, sans-serif',
            formatter: (value) =>
              value.length > 6 ? value.slice(0, 6) + '...' : value,
          },
          axisPointer: {
            type: 'shadow',
            label: {
              backgroundColor: '#a855f7',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#FF9FF3',
              width: 2,
            },
          },
          axisTick: {
            lineStyle: {
              color: '#f3e8ff',
            },
          },
          axisLabel: {
            color: '#9333ea',
            fontSize: 11,
            fontFamily: 'Microsoft YaHei, sans-serif',
          },
          splitLine: {
            lineStyle: {
              color: '#fae8ff',
              type: 'dashed',
            },
          },
        },
        series: [
          {
            type: 'bar',
            barWidth: '65%',
            barGap: '30%',
            barCategoryGap: '40%',
            label: {
              show: true,
              position: 'top',
              color: '#9333ea',
              fontSize: 10,
              fontFamily: 'Microsoft YaHei, sans-serif',
              formatter: (params) => (params.value > 0 ? params.value : ''),
            },
            itemStyle: {
              color: (params) => {
                const colors = [
                  'rgba(236, 72, 153, 0.8)',
                  'rgba(168, 85, 247, 0.8)',
                  'rgba(244, 114, 182, 0.8)',
                  'rgba(249, 168, 212, 0.8)',
                  'rgba(216, 180, 254, 0.8)',
                ]
                return colors[params.dataIndex % colors.length]
              },
              borderRadius: [6, 6, 0, 0],
              shadowColor: 'rgba(236, 72, 153, 0.3)',
              shadowBlur: 8,
              shadowOffsetY: 3,
            },
            emphasis: {
              itemStyle: {
                shadowColor: 'rgba(236, 72, 153, 0.5)',
                shadowBlur: 12,
                shadowOffsetY: 6,
              },
              label: {
                fontWeight: 'bold',
                color: '#7e22ce',
              },
            },
          },
        ],
        // 添加动画效果
        animationDuration: 1200,
        animationEasing: 'elasticOut',
        animationDelay: (idx) => idx * 100,
      },
    }
  },
  computed: {
    configItems() {
      return [
        { label: 'Host', value: this.botConfig.host },
        { label: 'Port', value: this.botConfig.port },
        { label: 'Driver', value: this.botConfig.driver },
        { label: 'Log Level', value: this.botConfig.log_level },
        { label: 'API Timeout', value: this.botConfig.api_timeout },
        {
          label: 'Session Timeout',
          value: this.botConfig.session_expire_timeout,
        },
        {
          label: 'Nicknames',
          value: this.botConfig.nickname?.join(', ') || '无',
        },
      ]
    },
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
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.groupChart = this.$echarts.init(this.$refs.groupChart)
    this.hotPluginChart = this.$echarts.init(this.$refs.hotPluginChart)
    this.getNonebotConfig()
    this.getActiveGroupData()
    this.getHotPlugin()
    this.groupCntInterval = setInterval(() => {
      this.getActiveGroupData(this.selectGroupType, true)
    }, 25000)
    this.handleResize()
    EventBus.$on('sidebar-aside', debounce(this.handleResize, 200))
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
    EventBus.$off('sidebar-aside', this.handleResize)
    if (this.groupCntInterval) {
      clearInterval(this.groupCntInterval)
    }
  },
  methods: {
    handleResize() {
      this.$nextTick(() => {
        setTimeout(() => {
          // 移动端适配
          if (window.innerWidth < 768) {
            this.chartHeight = window.innerHeight * 0.3
            this.chartDivHeight = this.chartHeight + 80
          } else {
            if (this.$refs.rightInfo) {
              const containerHeight = this.$refs.rightInfo.offsetHeight
              this.chartDivHeight =
                (containerHeight - this.$refs.baseBorder.offsetHeight - 54) / 2
              this.chartHeight =
                this.chartDivHeight -
                this.$refs.activeGroupBorder.offsetHeight -
                30
            }
          }

          this.groupChart?.resize()
          this.hotPluginChart?.resize()
        }, 100)
      })
    },
    getNonebotConfig() {
      const loading = this.getLoading('.base-border')
      this.getRequest(`${this.$root.prefix}/dashboard/get_nonebot_config`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.info)
            } else {
              this.$message.success(resp.info)
              this.botConfig = resp.data
              this.botConfig.nicknames = ''
              if (this.botConfig.nickname) {
                this.botConfig.nicknames = this.botConfig.nickname.join(',')
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

      // 添加点击动画效果
      const buttons = document.querySelectorAll('.btn-group button')
      buttons.forEach((btn) => {
        if (btn.textContent.toLowerCase() === type) {
          btn.classList.add('animate-pulse')
          setTimeout(() => btn.classList.remove('animate-pulse'), 500)
        }
      })
    },
    getActiveGroupData(date_type, no_loading) {
      if (date_type == 'all') {
        date_type = null
      }
      if (!no_loading) {
        var loading = this.getLoading('.active-group')
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

            const tmpOpt = cloneDeep(this.chartOpt)
            const group_list = []
            const data = resp.data.map((e) => {
              group_list.push(e.name)
              return {
                name: e.group_id,
                value: e.chat_num,
              }
            })

            // --- 主题化修改 Start ---
            try {
              const computedStyle = getComputedStyle(document.documentElement)
              const textColor =
                computedStyle
                  .getPropertyValue('--el-text-color-regular')
                  .trim() || '#c0c4cc'
              const bgColorOverlay =
                computedStyle
                  .getPropertyValue('--el-bg-color-overlay')
                  .trim() || '#303133'
              const borderColorLight =
                computedStyle
                  .getPropertyValue('--el-border-color-light')
                  .trim() || '#4C4D4F'

              tmpOpt.backgroundColor = 'transparent' // 设置背景透明

              // X 轴
              tmpOpt.xAxis.axisLabel = tmpOpt.xAxis.axisLabel || {}
              tmpOpt.xAxis.axisLabel.color = textColor
              tmpOpt.xAxis.nameTextStyle = tmpOpt.xAxis.nameTextStyle || {}
              tmpOpt.xAxis.nameTextStyle.color = textColor
              // Y 轴
              tmpOpt.yAxis.axisLabel = tmpOpt.yAxis.axisLabel || {}
              tmpOpt.yAxis.axisLabel.color = textColor
              tmpOpt.yAxis.nameTextStyle = tmpOpt.yAxis.nameTextStyle || {}
              tmpOpt.yAxis.nameTextStyle.color = textColor
              // 提示框
              tmpOpt.tooltip = tmpOpt.tooltip || {}
              tmpOpt.tooltip.textStyle = tmpOpt.tooltip.textStyle || {}
              tmpOpt.tooltip.textStyle.color = textColor
              tmpOpt.tooltip.backgroundColor = bgColorOverlay
              tmpOpt.tooltip.borderColor = borderColorLight
              // 系列标签
              if (tmpOpt.series && tmpOpt.series[0] && tmpOpt.series[0].label) {
                tmpOpt.series[0].label.color = textColor
              }
            } catch (e) {
              console.error('Failed to apply theme to group chart:', e)
            }
            // --- 主题化修改 End ---

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
      this.getHotPlugin(type)

      // 添加点击动画效果
      const buttons = document.querySelectorAll('.hot-plugin .btn-group button')
      buttons.forEach((btn) => {
        if (btn.textContent.toLowerCase() === type) {
          btn.classList.add('animate-pulse')
          setTimeout(() => btn.classList.remove('animate-pulse'), 500)
        }
      })
    },
    getHotPlugin(date_type) {
      const loading = this.getLoading('.hot-plugin')
      this.getRequest(`${this.$root.prefix}/main/get_hot_plugin`, {
        date_type,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.info)
          } else {
            this.$message.success(resp.info)
            const tmpOpt = cloneDeep(this.chartOpt)
            const hotPluginList = []
            const data = resp.data.map((e) => {
              hotPluginList.push(e.name)
              return {
                name: e.name,
                value: e.count,
              }
            })

            // --- 主题化修改 Start ---
            try {
              const computedStyle = getComputedStyle(document.documentElement)
              const textColor =
                computedStyle
                  .getPropertyValue('--el-text-color-regular')
                  .trim() || '#c0c4cc'
              const bgColorOverlay =
                computedStyle
                  .getPropertyValue('--el-bg-color-overlay')
                  .trim() || '#303133'
              const borderColorLight =
                computedStyle
                  .getPropertyValue('--el-border-color-light')
                  .trim() || '#4C4D4F'

              tmpOpt.backgroundColor = 'transparent' // 设置背景透明

              // X 轴
              tmpOpt.xAxis.axisLabel = tmpOpt.xAxis.axisLabel || {}
              tmpOpt.xAxis.axisLabel.color = textColor
              tmpOpt.xAxis.nameTextStyle = tmpOpt.xAxis.nameTextStyle || {}
              tmpOpt.xAxis.nameTextStyle.color = textColor
              // Y 轴
              tmpOpt.yAxis.axisLabel = tmpOpt.yAxis.axisLabel || {}
              tmpOpt.yAxis.axisLabel.color = textColor
              tmpOpt.yAxis.nameTextStyle = tmpOpt.yAxis.nameTextStyle || {}
              tmpOpt.yAxis.nameTextStyle.color = textColor
              // 提示框
              tmpOpt.tooltip = tmpOpt.tooltip || {}
              tmpOpt.tooltip.textStyle = tmpOpt.tooltip.textStyle || {}
              tmpOpt.tooltip.textStyle.color = textColor
              tmpOpt.tooltip.backgroundColor = bgColorOverlay
              tmpOpt.tooltip.borderColor = borderColorLight
              // 系列标签
              if (tmpOpt.series && tmpOpt.series[0] && tmpOpt.series[0].label) {
                tmpOpt.series[0].label.color = textColor
              }
            } catch (e) {
              console.error('Failed to apply theme to plugin chart:', e)
            }
            // --- 主题化修改 End ---

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

<style scoped>
/* 使用CSS变量优化字体大小 */
.base-title {
  font-size: var(--font-size-lg);
  font-weight: bold;
}

.config-info-item-text {
  font-size: var(--font-size-xs);
  font-family: monospace;
  margin-bottom: 0;
  line-height: var(--line-height-dense);
}

.config-small-title {
  font-size: var(--font-size-micro);
  line-height: var(--line-height-dense);
}

/* 图表标题样式 */
.base-border > div > p {
  font-size: var(--font-size-lg);
  font-weight: bold;
}

/* 按钮字体大小 */
.base-border button {
  font-size: var(--font-size-xxs);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .base-title {
    font-size: var(--font-size-md);
  }

  .config-info-item-text {
    font-size: var(--font-size-xxs);
  }

  .config-small-title {
    font-size: var(--font-size-micro);
  }

  .base-border > div > p {
    font-size: var(--font-size-md);
  }

  .base-border button {
    font-size: var(--font-size-micro);
  }
}

/* 其他样式保持不变 */
.right-info {
  scrollbar-width: thin;
  scrollbar-color: #d8b4fe #f5f3ff;
}

.right-info::-webkit-scrollbar {
  width: 6px;
}

.right-info::-webkit-scrollbar-track {
  background: #f5f3ff;
  border-radius: 10px;
}

.right-info::-webkit-scrollbar-thumb {
  background-color: #d8b4fe;
  border-radius: 10px;
}

.base-border {
  transition: all 0.3s ease;
  border: 1px solid rgba(216, 180, 254, 0.3);
}

.base-border:hover {
  box-shadow: 0 10px 15px -3px rgba(167, 139, 250, 0.2),
    0 4px 6px -2px rgba(167, 139, 250, 0.1);
}

.nb-config {
  padding: 0;
}

.base-title {
  text-shadow: 1px 1px 2px rgba(216, 180, 254, 0.5);
}

.base-border::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
  background: linear-gradient(45deg, #f472b6, #a78bfa, #7dd3fc);
  background-size: 300% 300%;
  border-radius: 12px;
  opacity: 0.1;
  animation: gradientBG 8s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 工具提示样式 */
::v-deep .el-tooltip__popper {
  max-width: 80vw;
  border: 1px solid #f472b6 !important;
  background-color: rgba(255, 255, 255, 0.95) !important;
  color: #6b46c1 !important;
  font-size: var(--font-size-xs);
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(244, 114, 182, 0.2) !important;
}

::v-deep .el-tooltip__popper[x-placement^='top'] .popper__arrow {
  border-top-color: #f472b6 !important;
}

::v-deep .el-tooltip__popper[x-placement^='bottom'] .popper__arrow {
  border-bottom-color: #f472b6 !important;
}
</style>
