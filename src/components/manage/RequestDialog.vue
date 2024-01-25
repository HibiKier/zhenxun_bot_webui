<template>
  <el-dialog class="dialog-class" width="500" :visible="true" @close="close">
    <OneMark text="是来自何处的羁绊呢" />
    <div class="request-main">
      <div class="friend-req">
        <p class="base-title">好友请求</p>
        <div class="friend-req-list">
          <div v-for="data in dataObj.friend" :key="data.flag" class="req-item">
            <div class="ava-box">
              <el-avatar :src="data.ava_url" class="list-ava"></el-avatar>
            </div>
            <div class="u-info">
              <p class="u-name">{{ data.remark || data.nickname }}</p>
              <p class="uid">{{ data.id }}</p>
            </div>
            <div class="c-btn">
              <MyButton text="同意" @click="approve(data)" />
              <MyButton
                text="拒绝"
                type="error"
                @click="refuse(data)"
                style="margin-left: 10px"
              />
              <MyButton
                text="删除"
                type="warn"
                @click="deleteReq(data)"
                style="margin-left: 10px"
              />
            </div>
          </div>
        </div>
      </div>
      <el-divider direction="vertical" />
      <div class="group-req">
        <p class="base-title">群聊邀请</p>
        <div class="group-req-list">
          <div class="friend-req-list">
            <div
              v-for="data in dataObj.group"
              :key="data.flag"
              class="req-item"
            >
              <div class="ava-box">
                <el-avatar :src="data.ava_url" class="list-ava"></el-avatar>
              </div>
              <div class="u-info">
                <p class="u-name">{{ data.remark || data.nickname }}</p>
                <p class="uid">{{ data.id }}</p>
              </div>
              <div class="c-btn">
                <MyButton text="同意" @click="approve(data)" />
                <MyButton
                  text="拒绝"
                  @click="refuse(data)"
                  type="error"
                  style="margin-left: 10px"
                />
                <MyButton
                  text="删除"
                  @click="deleteReq(data)"
                  type="warn"
                  style="margin-left: 10px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import OneMark from "@/components/ui/OneMark"
import MyButton from "../ui/MyButton.vue"
export default {
  name: "RequestDialog",
  components: {
    OneMark,
    MyButton,
  },
  data() {
    return {
      dataObj: {
        friendList: [],
        groupList: [],
      },
    }
  },
  mounted() {
    this.getReqList()
  },
  methods: {
    approve(data) {
      const loading = this.getLoading(".el-dialog")
      this.postRequest(`${this.$root.prefix}/manage/approve_request`, {
        bot_id: data.bot_id,
        request_type: data.type,
        flag: data.flag,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
        this.getReqList()
      })
    },
    refuse(data) {
      const loading = this.getLoading(".el-dialog")
      this.postRequest(`${this.$root.prefix}/manage/refuse_request`, {
        bot_id: data.bot_id,
        request_type: data.type,
        flag: data.flag,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
        this.getReqList()
      })
    },
    deleteReq(data) {
      const loading = this.getLoading(".el-dialog")
      this.postRequest(`${this.$root.prefix}/manage/delete_request`, {
        request_type: data.type,
        flag: data.flag,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
        this.getReqList()
      })
    },
    getReqList() {
      const loading = this.getLoading(".el-dialog")
      this.getRequest(`${this.$root.prefix}/manage/get_request_list`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.dataObj = resp.data
            }
          } else {
            this.$message.error(resp.info)
          }
          loading.close()
        }
      )
    },
    close() {
      this.$emit("close")
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-class {
  ::v-deep .el-dialog {
    border-radius: 10px;
  }
  .c-btn {
    display: flex;
    position: absolute;
    right: 0;
  }

  .base-title {
    color: #939395;
    margin-bottom: 5px;
    font-size: 18px;
    margin-left: 25px;
  }
  .request-main {
    display: flex;
  }

  ::v-deep .el-divider--vertical {
    height: 100%;
    margin: 0;
    min-height: 300px;
  }

  .friend-req {
    width: 50%;
    padding: 10px;

    .friend-req-list {
      padding: 10px;
      margin-left: 40px;
    }
  }

  .group-req {
    width: 49%;
    padding: 10px;
    .group-req-list {
      padding: 10px;
      margin-left: 40px;
    }
  }

  .req-item {
    display: flex;
    margin-top: 10px;
    position: relative;

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
      }
    }
  }
}
</style>
