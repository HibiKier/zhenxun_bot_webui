<template>
  <div>
    <PluginListTemplate plugin-type="superuser" />
  </div>
</template>

<script>
import PluginListTemplate from "@/components/plugin/PluginListTemplate";
export default {
  name: "SuperPlugin",
  components: {
    PluginListTemplate,
  },
};
</script>

<style>
</style>