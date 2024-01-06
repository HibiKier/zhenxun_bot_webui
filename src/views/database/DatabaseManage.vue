<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="数据库管理" name="DatabaseMana">
        <DatabaseMana />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DatabaseMana from "@/components/database/DatabaseMana"

export default {
  name: "DatabaseManage",
  components: {
    DatabaseMana,
  },
  data() {
    return {
      activeName: "DatabaseMana",
    }
  },
}
</script>

<style></style>
