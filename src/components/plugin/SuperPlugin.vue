<template>
  <div>
    <PluginListTemplate :plugin-type="type" />
  </div>
</template>

<script>
import PluginListTemplate from "@/components/plugin/PluginListTemplate";
export default {
  name: "SuperPlugin",
  components: {
    PluginListTemplate,
  },
  data() {
    return {
      pluginList: [],
      type: "superuser",
    };
  },
};
</script>

<style>
</style>