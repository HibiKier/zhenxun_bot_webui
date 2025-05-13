import { cloneDeep } from "lodash"

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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#FF9FF3", // 改为粉红色
    borderWidth: 2, // 加粗边框
    padding: [8, 12],
    extraCssText:
      "box-shadow: 0 4px 20px rgba(255, 159, 243, 0.3); border-radius: 8px;",
  },
  xAxis: {
    type: "category",
    axisLine: {
      lineStyle: {
        color: "#FF9FF3",
        width: 2,
      },
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        color: "#f3e8ff",
      },
    },
    axisLabel: {
      interval: 0,
      rotate: 30,
      color: "#9333ea",
      fontSize: 11,
      fontFamily: "Microsoft YaHei, sans-serif",
      formatter: (value) =>
        value.length > 6 ? value.slice(0, 6) + "..." : value,
    },
    axisPointer: {
      type: "shadow",
      label: {
        backgroundColor: "#a855f7",
      },
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      show: true,
      lineStyle: {
        color: "#FF9FF3",
        width: 2,
      },
    },
    axisTick: {
      lineStyle: {
        color: "#f3e8ff",
      },
    },
    axisLabel: {
      color: "#9333ea",
      fontSize: 11,
      fontFamily: "Microsoft YaHei, sans-serif",
    },
    splitLine: {
      lineStyle: {
        color: "#fae8ff",
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
        color: "#9333ea",
        fontSize: 10,
        fontFamily: "Microsoft YaHei, sans-serif",
        formatter: (params) => (params.value > 0 ? params.value : ""),
      },
      itemStyle: {
        color: (params) => {
          const colors = [
            "rgba(236, 72, 153, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(244, 114, 182, 0.8)",
            "rgba(249, 168, 212, 0.8)",
            "rgba(216, 180, 254, 0.8)",
          ]
          return colors[params.dataIndex % colors.length]
        },
        borderRadius: [6, 6, 0, 0],
        shadowColor: "rgba(236, 72, 153, 0.3)",
        shadowBlur: 8,
        shadowOffsetY: 3,
      },
      emphasis: {
        itemStyle: {
          shadowColor: "rgba(236, 72, 153, 0.5)",
          shadowBlur: 12,
          shadowOffsetY: 6,
        },
        label: {
          fontWeight: "bold",
          color: "#7e22ce",
        },
      },
    },
  ],
  // 添加动画效果
  animationDuration: 1200,
  animationEasing: "elasticOut",
  animationDelay: (idx) => idx * 100,
}

export function getChartOption() {
  return cloneDeep(chartOption)
}
