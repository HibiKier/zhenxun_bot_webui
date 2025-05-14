import { cloneDeep } from "lodash"

// 获取CSS变量值的辅助函数
function getCssVar(name) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return value || "#000000" // 如果获取不到值，返回黑色作为默认值
}

// 获取当前主题下的颜色配置
function getThemeColors() {
  return {
    primary: getCssVar("--echarts-primary"),
    primaryLight: getCssVar("--echarts-primary-light"),
    secondary: getCssVar("--echarts-secondary"),
    tertiary: getCssVar("--echarts-tertiary"),
    quaternary: getCssVar("--echarts-quaternary"),
    text: getCssVar("--echarts-text"),
    border: getCssVar("--echarts-border"),
    bgOverlay: getCssVar("--echarts-bg-overlay"),
    shadow: getCssVar("--echarts-shadow"),
  }
}

const chartOption = {
  grid: {
    top: "15%",
    bottom: "30%",
    left: "20%",
    right: "10%",
  },
  tooltip: {
    trigger: "item",
    formatter: (params) => `
<div class="chart-tooltip">
  <div class="tooltip-title">${params.name}</div>
  <div class="tooltip-value">${params.value}次</div>
</div>
`,
    backgroundColor: getCssVar("--echarts-bg-overlay"),
    borderColor: getCssVar("--echarts-primary"),
    borderWidth: 2,
    padding: [8, 12],
    extraCssText: `box-shadow: 0 4px 20px ${getCssVar(
      "--echarts-shadow"
    )}; border-radius: 8px;`,
  },
  xAxis: {
    type: "category",
    axisLine: {
      lineStyle: {
        color: getCssVar("--echarts-primary"),
        width: 2,
      },
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        color: getCssVar("--echarts-border"),
      },
    },
    axisLabel: {
      interval: 0,
      rotate: 30,
      color: getCssVar("--echarts-text"),
      fontSize: 11,
      fontFamily: "Microsoft YaHei, sans-serif",
      formatter: (value) =>
        value.length > 6 ? value.slice(0, 6) + "..." : value,
    },
    axisPointer: {
      type: "shadow",
      label: {
        backgroundColor: getCssVar("--echarts-primary"),
      },
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      show: true,
      lineStyle: {
        color: getCssVar("--echarts-primary"),
        width: 2,
      },
    },
    axisTick: {
      lineStyle: {
        color: getCssVar("--echarts-border"),
      },
    },
    axisLabel: {
      color: getCssVar("--echarts-text"),
      fontSize: 11,
      fontFamily: "Microsoft YaHei, sans-serif",
    },
    splitLine: {
      lineStyle: {
        color: getCssVar("--echarts-border"),
        type: "dashed",
      },
    },
  },
  series: [
    {
      type: "bar",
      barWidth: "65%",
      barGap: "30%",
      barCategoryGap: "40%",
      label: {
        show: true,
        position: "top",
        color: getCssVar("--echarts-text"),
        fontSize: 10,
        fontFamily: "Microsoft YaHei, sans-serif",
        formatter: (params) => (params.value > 0 ? params.value : ""),
      },
      itemStyle: {
        color: (params) => {
          const colors = [
            getCssVar("--echarts-primary"),
            getCssVar("--echarts-primary-light"),
            getCssVar("--echarts-secondary"),
            getCssVar("--echarts-tertiary"),
            getCssVar("--echarts-quaternary"),
          ]
          return colors[params.dataIndex % colors.length]
        },
        borderRadius: [6, 6, 0, 0],
        shadowColor: getCssVar("--echarts-shadow"),
        shadowBlur: 8,
        shadowOffsetY: 3,
      },
      emphasis: {
        itemStyle: {
          shadowColor: getCssVar("--echarts-shadow"),
          shadowBlur: 12,
          shadowOffsetY: 6,
        },
        label: {
          fontWeight: "bold",
          color: getCssVar("--echarts-text"),
        },
      },
    },
  ],
  animationDuration: 1200,
  animationEasing: "elasticOut",
  animationDelay: (idx) => idx * 100,
}

export function getChartOption() {
  // 每次获取配置时重新计算颜色
  const colors = getThemeColors()
  const option = cloneDeep(chartOption)

  // 更新所有颜色相关的配置
  option.tooltip.backgroundColor = colors.bgOverlay
  option.tooltip.borderColor = colors.primary
  option.tooltip.extraCssText = `box-shadow: 0 4px 20px ${colors.shadow}; border-radius: 8px;`

  option.xAxis.axisLine.lineStyle.color = colors.primary
  option.xAxis.axisTick.lineStyle.color = colors.border
  option.xAxis.axisLabel.color = colors.text
  option.xAxis.axisPointer.label.backgroundColor = colors.primary

  option.yAxis.axisLine.lineStyle.color = colors.primary
  option.yAxis.axisTick.lineStyle.color = colors.border
  option.yAxis.axisLabel.color = colors.text
  option.yAxis.splitLine.lineStyle.color = colors.border

  option.series[0].label.color = colors.text
  option.series[0].itemStyle.color = (params) => {
    const colors = [
      getCssVar("--echarts-primary"),
      getCssVar("--echarts-primary-light"),
      getCssVar("--echarts-secondary"),
      getCssVar("--echarts-tertiary"),
      getCssVar("--echarts-quaternary"),
    ]
    return colors[params.dataIndex % colors.length]
  }
  option.series[0].itemStyle.shadowColor = colors.shadow
  option.series[0].emphasis.itemStyle.shadowColor = colors.shadow
  option.series[0].emphasis.label.color = colors.text

  return option
}
