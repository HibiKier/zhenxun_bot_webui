<template>
  <div class="base">
    <div class="base-info">
      <SettingForm />
    </div>
  </div>
</template>

<script>
import SettingForm from "@/components/configure/SettingForm.vue"
export default {
  name: "MainCommand",
  data() {
    return {}
  },
  components: { SettingForm },
}
</script>

<style lang="scss" scoped>
.base {
  background-color: #f4f5fa;
  height: 100%;
  width: 100%;
}
</style>
