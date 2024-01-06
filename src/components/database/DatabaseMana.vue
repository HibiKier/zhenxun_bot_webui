<template>
  <div></div>
</template>

<script>
export default {
  name: "DatabaseMana",
  mounted() {
    this.execSql()
  },
  methods: {
    execSql() {
      // 执行sql
      this.postRequest("exec_sql", {
        // sql: "update chat_history set text=9111233923339 where id=15",
        sql: "SELECT * FROM public.pixiv",
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            console.log("exec_sql", resp)
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    getSqlLog() {
      // 获取sql日志
      this.postRequest("get_sql_log", {
        index: 3,
        size: 3,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            console.log("get_sql_log", resp)
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
  },
}
</script>

<style></style>
