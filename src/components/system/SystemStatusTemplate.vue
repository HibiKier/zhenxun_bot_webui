<template>
  <div>
    <div
      v-loading="loading"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      ref="echarts"
      :style="{ width: '100%', height: '338px' }"
    ></div>
  </div>
</template>

<script>
import { verifyIdentity } from "@/utils/api";
export default {
  name: "SystemLineDrawTemplate",
  props: ["statusType", "getData"],
  data() {
    return {
      statusData: null,
      data: [],
      xAxisTable: [],
      timer: null,
      myChart: null,
      loading: true,
    };
  },
  mounted() {
    verifyIdentity().then((res)=>{
      if(res == "true"){
        this.initData();
        this.timer = setInterval(() => {
          setTimeout(this.initData);
        }, 1000 * 5);
      }
    });
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    initData() {
      this.statusData = this.getData(this.statusType);
      if (Array.isArray(this.statusData)) {
        this.xAxisTable = this.statusData.map((i) => {
          return i.time;
        });
        this.data = this.statusData.map((i) => {
          return i.data;
        });
        if (this.data != null) {
          this.loading = false;
        }
        this.drawLine(); //折线图
      }
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      if (this.myChart == null) {
        this.myChart = this.$echarts.init(this.$refs.echarts);
      }
      let text = "";
      // 绘制图表
      if (this.statusType == "cpu") {
        text = "CPU使用率（%）";
      } else if (this.statusType == "memory") {
        text = "内存使用率（%）";
      } else {
        text = "硬盘使用率（%）";
      }
      this.myChart.setOption({
        title: {
          text: text,
          top: "30",
          left: "32",
          textStyle: {
            fontSize: 16, //字体大小
            color: "#333", //字体颜色
            fontWeight: "500",
          },
        },
        tooltip: {
          //触发类型：坐标轴触发
          trigger: "axis", //触发类型  'item'图形触发：散点图，饼图等无类目轴的图表中使用； 'axis'坐标轴触发；'none'：什么都不触发。
          axisPointer: {
            type: "line", //默认为line，line直线，cross十字准星，shadow阴影
            lineStyle: {
              type: "dashed",
              color: "#808BA9",
            },
          },
          backgroundColor: "#fff", //也可以通过设置rgba调节背景颜色与透明度
          color: "#333",
          borderWidth: "1",
          borderColor: "#D9E1F8",
          textStyle: {
            color: "#333",
            fontSize: "12",
            lineHeight: "17",
          },
          formatter: function (arg) {
            // 自定义提示
            return (
              arg[0].name +
              "<br>" +
              '<span style="margin:0 5px 2px 0;display:inline-block;width:6px;height:6px;border-radius:5px;background-color:' +
              arg[0].color +
              ';"></span>' +
              arg[0].seriesName +
              '<span style="margin-left:10px;">' +
              arg[0].data +
              "%</span>"
            );
          },
        },
        legend: {
          icon: "circle",
          itemHeight: 10, //修改icon图形大小
          textStyle: {
            fontSize: 14,
            color: "#333",
          },
          x: "left", //可设定图例在左、右、居中
          y: "top", //可设定图例在上、下、居中
          padding: [81, 0, 0, 32], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        },
        grid: {
          top: "145",
          left: "17",
          right: "17",
          bottom: "41",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: this.xAxisTable,
          //使坐标轴刻度与标签对齐
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            // 改变x轴颜色
            lineStyle: {
              // color: "#D9E1F8",
              color: "#666",
              width: "1",
            },
          },
          axisLabel: {
            // 改变x轴字体颜色和大小
            formatter(val) {
              return "{a|" + `${val}` + "}";
            },
            rich: {
              a: {
                height: 40, // 设置字体行高
                color: "#666",
                fontSize: 14,
              },
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false, //y轴线消失
          },
          axisTick: {
            show: false, //y轴坐标点消失
          },
          boundaryGap: [0.1, 0], //有负数设置这个
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "#D9E1F8",
            },
          },
          axisLabel: {
              fontSize: 14,//echart 5.0+的新写法，消除控制台黄色警告
              color: "#92A5E3",
          },
        },
        series: [
          {
            name: "使用率",
            type: "line", //bar:柱状 line:折线图
            data: this.data,
            color: "#00C5AB",
            // symbol: "circle", //折线点设置为实心点
            symbolSize: 8, //折线点的大小
          },
        ],
      });
    },
  },
};
</script>

<style>
</style>