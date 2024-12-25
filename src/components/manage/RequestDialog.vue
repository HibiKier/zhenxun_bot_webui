<template>
  <el-dialog class="dialog-class" :visible="true" @close="close">
    <OneMark text="是来自何处的羁绊呢" />
    <div class="request-main">
      <el-row style="height: 100%">
        <el-col :span="12" style="height: 100%">
          <div class="friend-req">
            <div>
              <p
                class="base-title"
                :style="{ fontSize: sizeMana.titleText + 'px' }"
              >
                好友请求
              </p>
              <MyButton
                text="清空"
                @click="clear_request('FRIEND')"
                icon="clear2"
                :width="90"
                :height="34"
                style="float: right"
              />
            </div>
            <div class="friend-req-list">
              <div
                v-for="data in dataObj.friend"
                :key="data.flag"
                class="req-item"
              >
                <div class="req-item-item">
                  <div class="ava-box">
                    <el-avatar
                      :src="data.ava_url"
                      class="list-ava"
                      :style="{
                        height: sizeMana.imageSize + 'px',
                        width: sizeMana.imageSize + 'px',
                      }"
                    ></el-avatar>
                  </div>
                  <div class="u-info">
                    <p
                      class="u-name"
                      :style="{ fontSize: sizeMana.nameText + 'px' }"
                    >
                      {{ data.remark || data.nickname }}
                    </p>
                    <p
                      class="uid"
                      :style="{ fontSize: sizeMana.tipText + 'px' }"
                    >
                      {{ data.id }}
                    </p>
                  </div>
                </div>
                <div class="c-btn">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <MyButton
                        text="同意"
                        @click="approve(data)"
                        :width="66"
                        :height="35"
                      />
                    </el-col>
                    <el-col :span="8">
                      <MyButton
                        text="拒绝"
                        @click="refuse(data)"
                        type="error"
                        :width="66"
                        :height="35"
                      />
                    </el-col>
                    <el-col :span="8">
                      <MyButton
                        text="删除"
                        @click="deleteReq(data)"
                        type="warn"
                        :width="66"
                        :height="35"
                      />
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="group-req">
            <div style="float: left; width: 100%">
              <p
                class="base-title"
                :style="{ fontSize: sizeMana.titleText + 'px' }"
              >
                群组请求
              </p>
              <MyButton
                text="清空"
                @click="clear_request('GROUP')"
                icon="clear2"
                :width="90"
                :height="34"
                style="float: right"
              />
            </div>
            <div class="group-req-list">
              <div
                v-for="data in dataObj.group"
                :key="data.flag"
                class="req-item"
              >
                <div class="req-item-item">
                  <div class="ava-box">
                    <el-avatar
                      :src="data.ava_url"
                      class="list-ava"
                      :style="{
                        height: sizeMana.imageSize + 'px',
                        width: sizeMana.imageSize + 'px',
                      }"
                    ></el-avatar>
                  </div>
                  <div class="u-info">
                    <p
                      class="u-name"
                      :style="{ fontSize: sizeMana.nameText + 'px' }"
                    >
                      {{ data.remark || data.nickname }}
                    </p>
                    <p
                      class="uid"
                      :style="{ fontSize: sizeMana.tipText + 'px' }"
                    >
                      {{ data.id }}
                    </p>
                  </div>
                </div>
                <div class="c-btn">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <MyButton
                        text="同意"
                        @click="approve(data)"
                        :width="66"
                        :height="35"
                      />
                    </el-col>
                    <el-col :span="8">
                      <MyButton
                        text="拒绝"
                        @click="refuse(data)"
                        type="error"
                        :width="66"
                        :height="35"
                      />
                    </el-col>
                    <el-col :span="8">
                      <MyButton
                        text="删除"
                        @click="deleteReq(data)"
                        type="warn"
                        :width="66"
                        :height="35"
                      />
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { getConvertSize, getFontSize } from "@/utils/utils"
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
      sizeMana: {
        titleText: 18,
        nameText: 20,
        tipText: 13,
        imageSize: 40,
      },
      dataObj: {
        friend: [],
        group: [],
      },
    }
  },
  mounted() {
    this.getReqList()
    window.addEventListener("resize", this.handleResize)
    this.handleResize()
  },
  methods: {
    handleResize() {
      this.initFontSize()
    },
    initFontSize() {
      this.sizeMana.titleText = getFontSize(18)
      this.sizeMana.nameText = getFontSize(25)
      this.sizeMana.tipText = getFontSize(15)
      this.sizeMana.imageSize = getConvertSize(40, 1024)
    },
    clear_request(request_type) {
      this.$confirm("确认清空所有请求?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: true,
        type: "warning",
      }).then(() => {
        const loading = this.getLoading(".el-dialog")
        this.postRequest(`${this.$root.prefix}/manage/clear_request`, {
          request_type,
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
      })
    },
    approve(data) {
      const loading = this.getLoading(".el-dialog")
      this.postRequest(`${this.$root.prefix}/manage/approve_request`, {
        bot_id: data.bot_id,
        id: data.oid,
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
        id: data.oid,
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
        id: data.oid,
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
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
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
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }

  .base-title {
    color: #939395;
    margin-bottom: 5px;
    font-size: 18px;
    margin-left: 25px;
    margin-top: 5px;
    float: left;
  }

  .request-main {
    height: 500px;
    overflow: auto;
  }

  ::v-deep .el-divider--vertical {
    height: 100%;
    margin: 0;
    min-height: 300px;
  }

  .friend-req {
    padding: 20px;
    border-right: 1px solid #dddfe5;
    box-sizing: border-box;
    height: 100%;

    .friend-req-list {
      margin-top: 60px;
    }
  }

  .group-req {
    padding: 20px;
    .group-req-list {
      margin-top: 60px;
    }
  }

  .req-item {
    margin-top: 10px;
    position: relative;
    border: 1px solid #dddfe5;
    padding: 10px;
    border-radius: 10px;
    box-sizing: border-box;

    .req-item-item {
      display: flex;
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
      }
    }
  }

  /deep/ .el-dialog__header {
    padding: 12px 20px 10px;
    box-sizing: border-box;
  }
}
</style>
