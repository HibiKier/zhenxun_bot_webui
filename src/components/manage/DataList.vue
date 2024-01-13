<template>
  <div class="fg-list">
    <div class="request">
      <el-badge :value="requestCount" class="item" v-if="requestCount > 0">
        <el-button size="small" @click="openRequest">请求管理</el-button>
      </el-badge>
      <el-button v-else size="small" @click="openRequest">请求管理</el-button>
    </div>
    <div class="fg-select">
      <div :class="getItemClass('private')" @click="clickListType('private')">
        好友
      </div>
      <el-divider direction="vertical" />
      <div :class="getItemClass('group')" @click="clickListType('group')">
        群组
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
export default {
  name: "DataList",
  components: { SvgIcon, RequestDialog },
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
  },
  methods: {
    getDetail(data) {
      this.detailId = data.id
      this.$emit("getDetail", this.activeBtn, data.id)
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
      this.getRequest("manage/get_request_count").then((resp) => {
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
      })
    },
    deleteHandle(id) {
      this.$confirm("确认删除/退出?", "提示", {
        confirmButtonText: "确认", //确认按钮文字更换
        cancelButtonText: "取消", //取消按钮文字更换
        showClose: true, //是否显示右上角关闭按钮
        type: "warning", //提示类型  success/info/warning/error
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
        this.postRequest(url, data).then((resp) => {
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
        })
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
      this.getRequest("manage/get_group_list", {
        bot_id: this.botInfo.self_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.dataList = resp.data.map((e) => {
              return { id: e.group_id, ...e }
            })
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    getFriendList() {
      // 获取好友列表
      // [ { user_id: "66600000", nickname: "babyQ", remark: "babyQ" }]
      this.getRequest("manage/get_friend_list", {
        bot_id: this.botInfo.self_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.dataList = resp.data.map((e) => {
              return { id: e.user_id, ...e }
            })
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.fg-list {
  // display: flex;
  padding: 50px 30px 10px 30px;
  // overflow: auto;
  // width: 100%;
  // height: 100%;
  position: relative;

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
    // border: #4d7cfe solid 1px;
    // border-radius: 5px;

    .data-item {
      padding: 10px;
      height: 63px;
      width: 317px;
      position: relative;
      cursor: pointer;

      ::v-deep .el-divider--horizontal {
        margin: 10px;
      }

      .more-icon {
        width: 25px;
        height: 25px;
        float: right;
        cursor: pointer;
        position: absolute;
        right: 1px;
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
        }
        .uid {
          color: #9f9f9f;
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
