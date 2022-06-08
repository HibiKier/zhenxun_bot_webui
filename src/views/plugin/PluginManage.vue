<template>
  <div>
    <el-tabs  v-model="activeName" type="card" >
      <el-tab-pane label="普通插件" name="NormalPlugin" :lazy="true">
        <NormalPlugin />
      </el-tab-pane>
      <el-tab-pane label="管理员插件" name="AdminPlugin" :lazy="true">
        <AdminPlugin />
      </el-tab-pane>
      <el-tab-pane label="超级用户插件" name="SuperPlugin" :lazy="true">
        <SuperPlugin />
      </el-tab-pane>
      <el-tab-pane label="其他插件" name="OtherPlugin" :lazy="true">
        <OtherPlugin />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import NormalPlugin from "@/components/plugin/NormalPlugin";
import AdminPlugin from "@/components/plugin/AdminPlugin";
import SuperPlugin from "@/components/plugin/SuperPlugin";
import OtherPlugin from "@/components/plugin/OtherPlugin";

export default {
  name: "PluginList",
  data() {
    return {
      activeName: "NormalPlugin",
    };
  },
  components: {
    NormalPlugin,
    AdminPlugin,
    SuperPlugin,
    OtherPlugin,
  },
};
</script>

<style>
</style>