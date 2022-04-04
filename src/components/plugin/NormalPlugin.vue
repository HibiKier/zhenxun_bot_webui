<template>
  <div>
    <PluginListTemplate :plugin-type="type" />
  </div>
</template>

<script>
import PluginListTemplate from "@/components/plugin/PluginListTemplate";
export default {
  name: "NormalPlugin",
  components: {
    PluginListTemplate,
  },
  data() {
    return {
      type: "normal",
    };
  },
};
</script>

<style>
</style>