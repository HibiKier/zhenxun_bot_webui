<template>
  <div>
    <div style="display: flex; margin-bottom: 10px">
      <el-button icon="el-icon-refresh" circle @click="refresh"></el-button>
    </div>
    <el-table :data="groupList" style="width: 100%">
      <el-table-column prop="group.group_id" label="群号" width="150">
      </el-table-column>
      <el-table-column prop="group.group_name" label="群名" width="150">
      </el-table-column>
      <el-table-column prop="group.member_count" label="成员数" width="150">
      </el-table-column>
      <el-table-column
        prop="group.max_member_count"
        label="最大成员数"
        width="150"
      >
      </el-table-column>
      <el-table-column prop="level" label="群权限" width="150">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == true" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="已开启被动" width="450">
        <template slot-scope="scope">
          <span
            v-for="item in scope.row.task"
            :key="item.name"
            :label="item.nameZh"
            ><span v-if="item.status == true">{{ item.nameZh }},</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="showEditView(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑群聊" :visible.sync="dialogVisible" width="400px">
      <table>
        <tr>
          <td>状态</td>
          <td>
            <el-switch
              style="margin-right: 30px"
              v-model="group.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
              size="small"
            >
            </el-switch>
          </td>
        </tr>

        <tr>
          <td>群权限</td>
          <td>
            <el-input
              v-model="group.level"
              placeholder=""
              size="small"
            ></el-input>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FriendGroupMana",
  props: ["pluginType"],
  data() {
    return {
      groupList: [],
      dialogVisible: false,
      taskList: [],
      taskZhList: [],
      group: {
        group: {
          group_id: 0,
        },
        status: null,
        level: 0,
      },
    }
  },
  mounted() {
    this.getGroupList()
    this.getFriendList()
    this.getRequestCount()
    this.getFriendRequest()
    this.getGroupRequest()
    this.leaveGroup()
  },
  methods: {
    refresh() {
      this.initGroupList()
      this.$message({
        message: "刷新成功",
        type: "success",
      })
    },
    getGroupList() {
      // 获取群组列表
      this.getRequest("get_group_list", { bot_id: 3373463162 }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.groupList = resp.data
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    getFriendList() {
      // 获取好友列表
      // [ { user_id: "66600000", nickname: "babyQ", remark: "babyQ" }]
      this.getRequest("get_friend_list", { bot_id: 3373463162 }).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    getRequestCount() {
      // 获取请求数量
      // data	Object { friend_count: 1, group_count: 2 }
      this.getRequest("get_request_count", { bot_id: 3373463162 }).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              console.log("getRequestCount", resp)
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    getFriendRequest() {
      // 获取请求数量
      // data	Object { friend_count: 1, group_count: 2 }
      this.getRequest("get_request_list", { request_type: "private" }).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              console.log("get_request_list private", resp)
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    getGroupRequest() {
      // 获取请求数量
      // data	Object { friend_count: 1, group_count: 2 }
      this.getRequest("get_request_list", { request_type: "group" }).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              console.log("get_request_list group", resp)
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    handleRequest() {
      // 请求处理
      // refuse_request: 拒绝请求
      // delete_request: 忽略请求
      // approve_request: 同意请求
      this.postRequest("refuse_request", {
        bot_id: 3373463162,
        id: 1,
        request_type: "private",
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            console.log("refuse_request", resp)
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    leaveGroup() {
      // 退群
      this.postRequest("leave_group", {
        bot_id: 3373463162,
        group_id: 863633108,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            console.log("leave_group", resp)
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    deleteFriend() {
      // 退群
      this.postRequest("delete_friend", {
        bot_id: 3373463162,
        user_id: 863633108,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            console.log("delete_friend", resp)
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    showEditView(data) {
      this.group = JSON.parse(JSON.stringify(data))
      this.dialogVisible = true
    },
    doUpdate() {
      const sendData = {
        group_id: this.group.group.group_id,
        status: this.group.status,
        level: this.group.level,
      }
      this.postRequest("/zhenxun/api/update_group", sendData).then((resp) => {
        if (resp) {
          this.$message.success(resp.info)
          this.initGroupList()
        }
      })
      this.dialogVisible = false
    },
  },
}
</script>

<style></style>
