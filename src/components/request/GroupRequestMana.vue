<template>
  <div>
    <RequestListTemplate :request-type="type" />
  </div>
</template>

<script>
import RequestListTemplate from "@/components/request/RequestListTemplate";
export default {
  name: "GroupRequest",
  components: {
    RequestListTemplate,
  },
  data() {
    return {
      type: "group",
    };
  },
};
</script>

<style>
</style>