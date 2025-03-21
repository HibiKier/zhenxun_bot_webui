<template>
  <div class="fg-list">
    <div class="request">
      <el-badge :value="requestCount" class="item" v-if="requestCount > 0">
        <MyButton
          size="small"
          @click="openRequest"
          :height="31"
          text="请求管理"
          :fontSize="12"
          style="z-index: -1111"
        />
      </el-badge>
      <el-button v-else size="small" @click="openRequest">请求管理</el-button>
    </div>
    <div class="fg-select">
      <div :class="getItemClass('private')" @click="clickListType('private')">
        好友({{ botInfo.friend_count - 1 }})
      </div>
      <el-divider direction="vertical" />
      <div :class="getItemClass('group')" @click="clickListType('group')">
        群组({{ botInfo.group_count }})
      </div>
    </div>
    <div class="data-list-border">
      <div
        v-for="data in dataList"
        :key="data.id"
        class="data-item"
        :style="{ 'background-color': detailId == data.id ? '#EDEDED' : null }"
      >
        <div style="display: flex" @click="getDetail(data)">
          <div class="ava-box">
            <el-avatar :src="data.ava_url" class="list-ava"></el-avatar>
          </div>
          <div class="u-info">
            <p class="u-name">
              {{ data.remark || data.nickname || data.group_name }}
            </p>
            <p class="uid">{{ data.id }}</p>
          </div>
        </div>
        <div class="new-msg" v-if="getUnreadCount(data.id)">
          {{ getUnreadCount(data.id) }}
        </div>
        <el-dropdown
          class="more-icon"
          trigger="click"
          @command="(c) => handleCommand(c, data.id)"
        >
          <span class="el-dropdown-link">
            <svg-icon icon-class="more" class="more-icon" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="delete">{{
              activeBtn == "private" ? "删除好友" : "退出群组"
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <RequestDialog v-if="requestDialogVisible" @close="closeRequest" />
  </div>
</template>

<script>
import SvgIcon from "../SvgIcon/SvgIcon.vue"
import RequestDialog from "./RequestDialog.vue"
import MyButton from "../ui/MyButton.vue"
export default {
  name: "DataList",
  components: { SvgIcon, RequestDialog, MyButton },
  data() {
    return {
      dataList: [],
      activeBtn: "private",
      botInfo: {},
      requestDialogVisible: false,
      requestCount: 0,
      detailId: null,
    }
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    this.refresh()
    window.sortFriendGroupList = this.sortFriendGroupList
  },
  methods: {
    sortFriendGroupList(type) {
      if (type == this.activeBtn && this.dataList.length) {
        this.dataList.forEach((e) => {
          const chat = this.$store.state.chatObj[e.id]
          if (chat) {
            e.time = chat.time
          }
        })
        this.dataList = this.dataList.sort((a, b) => {
          return a.time < b.time ? 1 : -1
        })
      }
    },
    getUnreadCount(id) {
      const chat = this.$store.state.chatObj[id]
      if (chat) {
        const unreadCount = chat.unreadCount
        if (unreadCount > 99) {
          return "99+"
        }
        return chat.unreadCount
      }
    },
    getDetail(data) {
      this.detailId = data.id
      this.$emit("getDetail", this.activeBtn, data.id)
      this.$store.commit("READ_CHAT", data.id)
    },
    refresh() {
      this.getRequestCount()
      if (this.activeBtn == "private") {
        this.getFriendList()
      } else {
        this.getGroupList()
      }
    },
    openRequest() {
      this.requestDialogVisible = true
    },
    closeRequest() {
      this.requestDialogVisible = false
      this.refresh()
    },
    clickListType(type) {
      this.activeBtn = type
      if (type == "private") {
        this.getFriendList()
      } else {
        this.getGroupList()
      }
    },
    handleCommand(command, id) {
      if (command == "delete") {
        this.deleteHandle(id)
      }
    },
    getRequestCount() {
      this.getRequest(`${this.$root.prefix}/manage/get_request_count`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.requestCount = resp.data.friend_count + resp.data.group_count
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    deleteHandle(id) {
      this.$confirm("确认删除/退出?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: true,
        type: "warning",
      }).then(() => {
        let url = null
        let data = null
        if (this.activeBtn == "private") {
          url = "delete_friend"
          data = { bot_id: this.botInfo.self_id, user_id: id }
        } else {
          url = "leave_group"
          data = { bot_id: this.botInfo.self_id, group_id: id }
        }
        this.postRequest(`${this.$root.prefix}/manage/${url}`, data).then(
          (resp) => {
            if (resp.suc) {
              if (resp.warning) {
                this.$message.warning(resp.warning)
              } else {
                this.$message.success(resp.info)
                setTimeout(() => {
                  this.refresh()
                }, 500)
              }
            } else {
              this.$message.error(resp.info)
            }
          }
        )
      })
    },
    getItemClass(n) {
      const obj = {
        "select-btn-item": true,
        "btn-item-select": this.activeBtn == n,
      }
      if (n == "private") {
        obj["private-btn"] = true
      } else {
        obj["group-btn"] = true
      }
      return obj
    },
    getGroupList() {
      // 获取群组列表
      const loading = this.getLoading(".data-list-border")
      this.getRequest(`${this.$root.prefix}/manage/get_group_list`, {
        bot_id: this.botInfo.self_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.dataList = resp.data.map((e) => {
              return { id: e.group_id, time: 0, ...e }
            })
            this.sortFriendGroupList("group")
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    getFriendList() {
      // 获取好友列表
      const loading = this.getLoading(".data-list-border")
      this.getRequest(`${this.$root.prefix}/manage/get_friend_list`, {
        bot_id: this.botInfo.self_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.dataList = resp.data.map((e) => {
              return { id: e.user_id, time: 0, ...e }
            })
            this.sortFriendGroupList("private")
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.fg-list {
  padding: 50px 30px 10px 30px;
  position: relative;
  box-sizing: border-box;

  .request {
    position: absolute;
    right: 31px;
    top: 11px;
  }

  .fg-select {
    float: left;
    display: flex;
    background-color: #ffffff;
    height: 50px;
    width: 100%;
    border-radius: 5px;
    color: #758ea1;

    ::v-deep .el-divider--vertical {
      height: 70%;
      margin: 8px 0;
    }

    .private-btn {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    .group-btn {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }

    .select-btn-item {
      display: flex;
      width: 100%;
      cursor: pointer;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
    .btn-item-select {
      color: #ffffff;
      background-color: #4d7cfe;
    }
  }

  .data-list-border {
    margin-top: 80px;
    border-radius: 10px;
    padding: 10px 0;
    overflow: auto;
    box-sizing: border-box;
    height: calc(100% - 60px);
    // border: #4d7cfe solid 1px;
    // border-radius: 5px;

    .data-item {
      padding: 10px;
      height: 63px;
      position: relative;
      cursor: pointer;

      ::v-deep .el-divider--horizontal {
        margin: 10px;
      }

      .new-msg {
        position: absolute;
        right: 7px;
        top: 50px;
        border-radius: 100px;
        // background-color: #cfcdcd;
        background-color: #ff3b30;
        color: #f8f7f8;
        font-size: 14px;
        width: 23px;
        text-align: center;
      }

      .more-icon {
        width: 25px;
        height: 25px;
        float: right;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 3px;
      }

      .ava-box {
        .list-ava {
          width: 60px;
          height: 60px;
        }
      }

      .u-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 10px;
        .u-name {
          font-size: 20px;
          font-weight: bold;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .uid {
          color: #9f9f9f;
          margin-top: 8px;
        }
      }
    }
  }

  /deep/ .el-badge__content {
    z-index: 11111;
  }
}
</style>
