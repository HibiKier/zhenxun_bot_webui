<template>
  <div>
    <div style="display: flex; margin-bottom: 10px">
      <el-button icon="el-icon-refresh" circle @click="refresh"></el-button>
      <el-button type="danger" size="small" @click="clear">清空请求</el-button>
    </div>
    <el-table :data="requestList" style="width: 100%">
      <el-table-column prop="oid" label="id" width="50"> </el-table-column>
      <el-table-column prop="id" label="qq" width="150"> </el-table-column>
      <el-table-column prop="flag" label="flag" width="170"> </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="150">
      </el-table-column>
      <el-table-column prop="level" label="等级" width="100"> </el-table-column>
      <el-table-column label="性别" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 'male'"> 男 </span>
          <span v-else> 女 </span>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="150"></el-table-column>
      <el-table-column
        prop="comment"
        label="验证消息"
        width="150"
      ></el-table-column>
      <template v-if="requestType == 'group'">
        <el-table-column
          prop="invite_group"
          label="邀请入群"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="group_name"
          label="群聊名称"
          width="150"
        ></el-table-column>
      </template>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="success"
            @click="approveHandler(scope.row)"
            >同意</el-button
          >
          <el-button
            size="small"
            type="warning"
            @click="refuseHandler(scope.row)"
            >拒绝</el-button
          >
          <el-button size="small" type="danger" @click="deleteHandle(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "RequestListTemplate",
  props: ["requestType"],
  data() {
    return {
      requestList: [],
      noticeMsg: "",
      request: {
        id: null,
        handle: null,
        type: "",
      },
    };
  },
  mounted() {
    this.initRequestList();
  },
  methods: {
    refresh() {
      this.initRequestList();
      this.$message({
        message: "刷新成功",
        type: "success",
      });
    },
    initRequestList() {
      this.getRequest("/webui/request?type_=" + this.requestType).then(
        (resp) => {
          if (resp) {
            this.requestList = resp.data;
          } else {
            this.$message.error("获取请求数据失败！");
          }
        }
      );
    },
    clear() {
      this.$confirm("确认清空全部请求?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteRequest("/webui/request?type_=" + this.requestType).then(
            (resp) => {
              if (resp) {
                this.initRequestList();
                this.$message({
                  message: "清空成功",
                  type: "success",
                });
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    approveHandler(data) {
      this.request.handle = "approve";
      this.noticeMsg = "同意";
      this.handle(data);
    },
    refuseHandler(data) {
      this.request.handle = "refuse";
      this.noticeMsg = "拒绝";
      this.handle(data);
    },
    deleteHandle(data) {
      this.request.handle = "delete";
      this.noticeMsg = "删除";
      this.handle(data);
    },
    handle(data) {
      this.request.id = data.oid;
      this.request.type = this.requestType;
      this.$confirm(
        "确认" + this.noticeMsg + " id：" + data.oid + " 请求?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.postRequest("/webui/request", this.request).then((resp) => {
            if (resp) {
              if (resp.data == "ok") {
                this.initRequestList();
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
              } else {
                this.$message.error(resp.data);
                this.initRequestList();
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
  },
};
</script>

<style>
@media screen  and (max-width:600px) {
  .el-message-box{
    width: 90vw;
  }
}
</style>