<template>
  <div style="height: 100%; width: 100%">
    <SystemBasicInfo />
  </div>
</template>

<script>
import SystemBasicInfo from "@/components/system/SystemBasicInfo"

export default {
  name: "SystemInfo",
  data() {
    return {
      activeName: "SystemBasicInfo",
    }
  },
  components: {
    SystemBasicInfo,
  },
}
</script>

<style></style>
