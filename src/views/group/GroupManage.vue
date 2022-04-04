<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="群组管理" name="GroupManage"
        ><GroupMana
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import GroupMana from "@/components/group/GroupMana";

export default {
  name: "PluginList",
  data() {
    return {
      activeName: "GroupManage",
    };
  },
  components: {
    GroupMana,
  },
};
</script>

<style>
</style>