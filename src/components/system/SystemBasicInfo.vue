<template>
  <!-- dom结构优化，左右两个图片盒子高度对齐 -->
  <div class="grid-wrapper">
    <div class="grid-content bg-purple">
      <el-row>
        <SystemStatusTemplate :status-type="type[0]" :getData="getData" />
      </el-row>
      <el-row>
        <SystemStatusTemplate :status-type="type[1]" :getData="getData" />
      </el-row>
      <el-row>
        <SystemStatusTemplate :status-type="type[2]" :getData="getData" />
      </el-row>
    </div>
    <div class="grid-content bg-purple-light">
      <SystemResourceTemplate />
    </div>
  </div>
</template>

<script>
import SystemStatusTemplate from "@/components/system/SystemStatusTemplate";
import SystemResourceTemplate from "@/components/system/SystemResourceTemplate";
export default {
  name: "SystemBasicInfo",
  components: {
    SystemStatusTemplate,
    SystemResourceTemplate,
  },
  data() {
    return {
      type: ["cpu", "memory", "disk"],
      data: null,
      timer: null,
    };
  },
  mounted() {
    this.initStatusData();
    this.timer = setInterval(() => {
      setTimeout(this.initStatusData);
    }, 1000 * 5);
  },
  methods: {
    initStatusData() {
      this.getRequest("/webui/system/statusList").then((resp) => {
        if (resp && resp.code == 200) {
          this.data = resp.data;
        }
      });
    },
    getData(type) {
      if (this.data == null) {
        return {};
      }
      if (type == "cpu") {
        return this.data.cpu_data;
      } else if (type == "memory") {
        return this.data.memory_data;
      } else {
        return this.data.disk_data;
      }
    },
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style>
.grid-wrapper{
  display: flex;
  height: 100%;
  overflow: hidden;
}

@media screen  and (max-width:600px) {
  .grid-wrapper{display: flex;flex-direction: column;}
  .grid-content {flex: 0!important;}
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  flex: 1;
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>