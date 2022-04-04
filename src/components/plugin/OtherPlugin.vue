<template>
  <div>
    <PluginListTemplate :plugin-type="type" />
  </div>
</template>

<script>
import PluginListTemplate from "@/components/plugin/PluginListTemplate";
export default {
  name: "OtherPlugin",
  components: {
    PluginListTemplate,
  },
  data() {
    return {
      type: "hidden",
    };
  },
};
</script>

<style>
</style>