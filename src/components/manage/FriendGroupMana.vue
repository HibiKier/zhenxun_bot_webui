<template>
  <div class="main">
    <div class="data-list">
      <DataList @getDetail="getDetail" />
    </div>
    <div class="chat">
      <ChatWindow ref="chatWindow" />
    </div>
    <div class="detail">
      <DetailInfo ref="detailInfo" @startChat="startChat" />
    </div>
  </div>
</template>

<script>
import ChatWindow from "./ChatWindow.vue"
import DataList from "./DataList.vue"
import DetailInfo from "./DetailInfo.vue"
export default {
  name: "FriendGroupMana",
  components: {
    DataList,
    ChatWindow,
    DetailInfo,
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    startChat(data) {
      this.$refs["chatWindow"].startChat(data)
    },
    getDetail(type, id) {
      if (type == "private") {
        this.$refs["detailInfo"].getFriend(id)
      } else {
        this.$refs["detailInfo"].getGroup(id)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  .data-list {
    width: 17%;
    height: 100%;
    background-color: #f4f5fa;
    overflow: auto;
  }

  .chat {
    height: 100%;
    width: 58%;
  }

  .detail {
    height: 100%;
    width: 25%;
    overflow: auto;
  }
}
</style>
