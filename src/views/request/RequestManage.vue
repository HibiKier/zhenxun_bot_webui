<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="群组请求" name="GroupRequestMana"
        ><GroupRequestMana
      /></el-tab-pane>
      <el-tab-pane label="好友请求" name="PrivateRequestMana"
        ><PrivateRequestMana
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import GroupRequestMana from "@/components/request/GroupRequestMana";
import PrivateRequestMana from "@/components/request/PrivateRequestMana";
import {verifyIdentity} from "@/utils/api";

export default {
  name: "RequestManage",
  created(){
    verifyIdentity();
  },
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