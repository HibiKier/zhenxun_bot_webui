<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="群组管理" name="FriendGroupMana">
        <FriendGroupMana />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FriendGroupMana from "@/components/manage/FriendGroupMana"

export default {
  name: "FriendGroupManage",
  components: {
    FriendGroupMana,
  },
  data() {
    return {
      activeName: "FriendGroupMana",
    }
  },
}
</script>

<style></style>
