<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="系统信息" name="SystemBasicInfo"
        ><SystemBasicInfo
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SystemBasicInfo from "@/components/system/SystemBasicInfo";

export default {
  name: "SystemInfo",
  data() {
    return {
      activeName: "SystemBasicInfo",
    };
  },
  components: {
    SystemBasicInfo,
  },
};
</script>

<style>
</style>