<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="群组请求" name="GroupRequestMana" :lazy="true">
        <GroupRequestMana />
      </el-tab-pane>
      <el-tab-pane label="好友请求" name="PrivateRequestMana" :lazy="true">
        <PrivateRequestMana />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import GroupRequestMana from "@/components/request/GroupRequestMana";
import PrivateRequestMana from "@/components/request/PrivateRequestMana";

export default {
  name: "RequestManage",
  data() {
    return {
      activeName: "GroupRequestMana",
    };
  },
  components: {
    GroupRequestMana,
    PrivateRequestMana,
  },
};
</script>

<style>
</style>