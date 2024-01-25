<template>
  <div class="base">
    <div class="base-info">
      <LeftInfo />
    </div>
    <div class="main-info">
      <MidInfo />
    </div>
    <span class="test">
      <el-divider direction="vertical" />
    </span>
    <div class="config-info">
      <RightInfo />
    </div>
  </div>
</template>

<script>
import LeftInfo from "@/components/command/LeftInfo.vue"
import MidInfo from "@/components/command/MidInfo.vue"
import RightInfo from "@/components/command/RightInfo.vue"
export default {
  name: "MainCommand",
  data() {
    return {
      botInfo: {},
    }
  },
  components: { LeftInfo, MidInfo, RightInfo },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
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
}

.test {
  ::v-deep .el-divider--vertical {
    height: 100%;
    margin-left: 40px;
    height: c;
  }
}

.config-info {
  height: 100%;
  min-width: 501px;
}
</style>
