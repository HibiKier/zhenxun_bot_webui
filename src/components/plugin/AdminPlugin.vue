<template>
  <div>
    <PluginListTemplate :plugin-type="type" />
  </div>
</template>

<script>
import PluginListTemplate from "@/components/plugin/PluginListTemplate";
export default {
  name: "AdminPlugin",
  components: {
    PluginListTemplate,
  },
  data() {
    return {
      type: "admin",
    };
  },
};
</script>

<style>
</style>