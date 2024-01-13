<template>
  <div style="height: 100%; width: 100%">
    <DatabaseMana />
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
