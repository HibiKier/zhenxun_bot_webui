<template>
  <div class="main">
    <el-row>
      <el-col :span="6">
        <div class="data-list">
          <DataList
            @getDetail="getDetail"
            :style="{ height: computedHeight + 'px' }"
          />
        </div>
      </el-col>
      <el-col :span="10">
        <div class="chat">
          <ChatWindow
            ref="chatWindow"
            :style="{ height: computedHeight + 'px' }"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="detail">
          <DetailInfo
            ref="detailInfo"
            @startChat="startChat"
            :style="{ height: computedHeight + 'px' }"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHeaderHeight } from "@/utils/utils"
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
    return {
      windowHeight: window.innerHeight,
    }
  },
  computed: {
    computedHeight() {
      return this.windowHeight - getHeaderHeight()
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight
    },
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
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  .data-list {
    height: 100%;
    background-color: var(--el-bg-color-page);
  }

  .chat {
    height: 100%;
  }

  .detail {
    height: 100%;
    overflow: auto;
  }
}
</style>
