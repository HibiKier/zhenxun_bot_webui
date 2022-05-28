<template>
  <div>
    <RequestListTemplate :request-type="type" />
  </div>
</template>

<script>
import RequestListTemplate from "@/components/request/RequestListTemplate";
export default {
  name: "PrivateRequest",
  components: {
    RequestListTemplate,
  },
  data() {
    return {
      type: "private",
    };
  },
};
</script>

<style>
</style>