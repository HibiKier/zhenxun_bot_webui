<template>
  <div>
    <el-row>
      <el-col :span="12"
        ><div class="grid-content bg-purple">
          <el-row>
            <SystemStatusTemplate :status-type="type[0]" :getData="getData" />
          </el-row>
          <el-row>
            <SystemStatusTemplate :status-type="type[1]" :getData="getData" />
          </el-row>
          <el-row>
            <SystemStatusTemplate :status-type="type[2]" :getData="getData" />
          </el-row></div
      ></el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <SystemResourceTemplate />
        </div>
      </el-col>
    </el-row>
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
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
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>