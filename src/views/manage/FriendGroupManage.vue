<template>
  <div style="height: 100%; width: 100%">
    <FriendGroupMana />
  </div>
</template>

<script>
import FriendGroupMana from "@/components/manage/FriendGroupMana"

export default {
  name: "FriendGroupManage",
  components: {
    FriendGroupMana,
  },
  data() {
    return {
      activeName: "FriendGroupMana",
    }
  },
}
</script>

<style></style>
