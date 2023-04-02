<template>
  <div>
    <PluginListTemplate plugin-type="admin" />
  </div>
</template>

<script>
import PluginListTemplate from "@/components/plugin/PluginListTemplate";
export default {
  name: "AdminPlugin",
  components: {
    PluginListTemplate,
  },
};
</script>

<style>
</style>