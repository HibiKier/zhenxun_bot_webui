<template>
  <div class="base">
    <div class="base-info">
      <LeftInfo />
    </div>
    <div class="main-info">
      <MidInfo />
    </div>
    <div class="config-info">
      <RightInfo />
    </div>
  </div>
</template>

<script>
import LeftInfo from "@/components/dashboard/LeftInfo.vue"
import MidInfo from "@/components/dashboard/MidInfo.vue"
import RightInfo from "@/components/dashboard/RightInfo.vue"
export default {
  name: "MainDashboard",
  data() {
    return {
      botInfo: {},
    }
  },
  components: { LeftInfo, MidInfo, RightInfo },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.base {
  background-color: #ffffff;
  display: flex;
  height: 100%;
  width: 100%;
}

.base-info {
  background-color: #f4f5fa;
  height: 100%;
  width: 17%;
  min-width: 367px;
}

.main-info {
  height: 100%;
  width: 62%;
  min-width: 1080px;
  background-color: #f5f6f8;
  overflow: auto;
  padding: 0 10px;
}

.config-info {
  height: 100%;
  min-width: 501px;
  background-color: #f5f6f8;
}
</style>
