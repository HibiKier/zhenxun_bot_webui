<template>
  <div class="resbox">
    <div ref="echarts" style="width: 100%; height: 100%"></div>
    <el-drawer :title="ccw.title" :visible.sync="drawer">
      <div ref="ccwEcharts" style="width: 100%; height: 90%"></div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "SystemResourceTemplate",
  data() {
    return {
      data: [],
      myChart: null,
      total_size: null,
      drawer: false,
      ccw: {
        chart: null,
        data: [],
        title: "",
        total_size: 0,
      },
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      if (this.myChart == null) {
        this.myChart = this.$echarts.init(this.$refs.echarts);
      }
      this.getRequest("/webui/system/disk").then((resp) => {
        if (resp && resp.code == 200) {
          this.data = {
            image: resp.data.image_dir_size,
            text: resp.data.text_dir_size,
            record: resp.data.record_dir_size,
            font: resp.data.font_dir_size,
            data: resp.data.data_dir_size,
            log: resp.data.log_dir_size,
            temp: resp.data.temp_dir_size,
          };
          for (var key in resp.data) {
            if (key != "check_time") {
              this.total_size += resp.data[key];
            }
          }
          this.drawPie();
        }
      });
    },
    drawPie(name) {
      // 基于准备好的dom，初始化echarts实例
      let legendData = [];
      let seriesData = [];
      let total = 0;
      let v = " MB";
      if (name == "ccw") {
        for (var key in this.ccw.data) {
          if (key != "check_time") {
            seriesData.push({
              value: ((this.ccw.data[key] / this.ccw.total_size) * 100).toFixed(
                2
              ),
              name: key,
            });
          }
        }
        total = this.ccw.total_size;
      } else {
        total = this.total_size;
        legendData = [
          "图片资源",
          "文本资源",
          "音频资源",
          "字体资源",
          "数据文件",
          "日志文件",
          "临时文件",
        ];
        seriesData = [
          {
            value: ((this.data.image / this.total_size) * 100).toFixed(2),
            name: "图片资源",
          },
          {
            value: ((this.data.text / this.total_size) * 100).toFixed(2),
            name: "文本资源",
          },
          {
            value: ((this.data.record / this.total_size) * 100).toFixed(2),
            name: "音频资源",
          },
          {
            value: ((this.data.font / this.total_size) * 100).toFixed(2),
            name: "字体资源",
          },
          {
            value: ((this.data.data / this.total_size) * 100).toFixed(2),
            name: "数据文件",
          },
          {
            value: ((this.data.log / this.total_size) * 100).toFixed(2),
            name: "日志文件",
          },
          {
            value: ((this.data.temp / this.total_size) * 100).toFixed(2),
            name: "临时文件",
          },
        ];
      }
      if (total > 1024) {
        total /= 1024;
        v = " GB";
      }
      let option = {
        tooltip: {
          trigger: "item",
          formatter: (arg) => {
            let total_size = 0;
            if (
              [
                "图片资源",
                "文本资源",
                "音频资源",
                "字体资源",
                "数据文件",
                "日志文件",
                "临时文件",
              ].indexOf(arg.name) != -1
            ) {
              total_size = this.total_size;
            } else {
              total_size = this.ccw.total_size;
            }
            let v = "MB";
            let size = (arg.data.value * total_size) / 100;
            if (size > 1024) {
              size /= 1024;
              v = "GB";
            }
            return arg.data.name + "<br>" + size.toFixed(2) + " " + v;
          },
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: legendData,
        },
        graphic: {
          type: "text",
          right: "3%",
          top: "13%",
          style: {
            text: "总占用空间：" + total.toFixed(2) + v,
            textAlign: "center",
            fill: "#333",
            fontSize: 20,
          },
        },
        series: [
          {
            name: "占用空间",
            type: "pie",
            minAngle: 5, // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
            radius: ["30%", "70%"],
            center: ["48%", "58%"],
            label: {
              formatter: "{b|{b}}\n（{c}%）\n", // 这里的设置就是饼图的标签内容及其格式
              rich: {
                b: {
                  align: "center",
                },
              },
            },
            data: seriesData,
          },
        ],
      };
      if (name == "ccw") {
        this.ccw.chart.setOption(option);
      } else {
        this.myChart.setOption(option);
      }
      this.myChart.on("click", this.showFolderSize);
    },
    showFolderSize(param) {
      if (param.componentType != "graphic") {
        this.drawer = true;
        let type = "";
        if (param.name == "字体资源") {
          type = "font";
        } else if (param.name == "图片资源") {
          type = "image";
        } else if (param.name == "文本资源") {
          type = "text";
        } else if (param.name == "音频资源") {
          type = "record";
        } else if (param.name == "数据文件") {
          type = "data";
        } else if (param.name == "日志文件") {
          type = "log";
        } else if (param.name == "临时文件") {
          type = "temp";
        }
        this.getRequest("/webui/system/disk?type_=" + type).then((resp) => {
          if (this.ccw.chart == null) {
            this.ccw.chart = this.$echarts.init(this.$refs.ccwEcharts);
          }
          if (resp && resp.code == 200) {
            this.ccw.title = param.name;
            this.ccw.data = resp.data;
            this.ccw.total_size = 0;
            for (var key in resp.data) {
              if (key != "check_time") {
                this.ccw.total_size += resp.data[key];
              }
            }
            this.drawPie("ccw");
          }
        });
      }
    },
  },
};
</script>

<style>
  .resbox{
    height: 100%;
  }
  @media screen  and (max-width:600px) {
  .resbox{height: 35rem;}
  }
</style>