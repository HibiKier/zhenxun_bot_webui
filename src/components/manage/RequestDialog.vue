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
                  <MyButton
                    text="同意"
                    @click="approve(data)"
                    :width="66"
                    :height="35"
                  />
                  <MyButton
                    text="拒绝"
                    @click="refuse(data)"
                    type="error"
                    :width="66"
                    :height="35"
                  />
                  <MyButton
                    text="删除"
                    @click="deleteReq(data)"
                    type="warn"
                    :width="66"
                    :height="35"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" style="height: 100%">
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
                  <MyButton
                    text="同意"
                    @click="approve(data)"
                    :width="66"
                    :height="35"
                  />
                  <MyButton
                    text="拒绝"
                    @click="refuse(data)"
                    type="error"
                    :width="66"
                    :height="35"
                  />
                  <MyButton
                    text="删除"
                    @click="deleteReq(data)"
                    type="warn"
                    :width="66"
                    :height="35"
                  />
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
    background-color: var(--el-bg-color);
  }
  ::v-deep .el-dialog__header {
    background-color: var(--el-bg-color);
  }
  ::v-deep .el-dialog__body {
    background-color: var(--el-bg-color-page);
  }
  .c-btn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 15px;
    gap: 10px;
  }

  .base-title {
    color: var(--el-text-color-secondary);
    margin-bottom: 5px;
    font-size: 18px;
    margin-left: 0;
    margin-top: 0;
    float: none;
    line-height: 34px;
  }

  .request-main {
    height: 65vh;
  }

  ::v-deep .el-divider--vertical {
    height: 100%;
    margin: 0;
    min-height: 300px;
  }

  .friend-req {
    padding: 20px;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;

    > div:first-child {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding: 0 10px;
    }

    .friend-req-list {
      margin-top: 0;
      overflow: auto;
      flex-grow: 1;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid var(--el-border-color);
      box-shadow: var(--el-box-shadow-light);
      box-sizing: border-box;
      background-color: transparent;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: var(--el-fill-color-light);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--el-color-info-light-3);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: var(--el-color-info-light-5);
      }
    }
  }

  .mid-line {
    height: 100%;
    width: 1px;
    background-color: #939395;
  }

  .group-req {
    padding: 20px;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;

     > div:first-child {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding: 0 10px;
    }

    .group-req-list {
       margin-top: 0;
      overflow: auto;
       flex-grow: 1;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid var(--el-border-color);
      box-shadow: var(--el-box-shadow-light);
      box-sizing: border-box;
      background-color: transparent;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: var(--el-fill-color-light);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--el-color-info-light-3);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: var(--el-color-info-light-5);
      }
    }
  }

  .req-item {
    margin-top: 15px;
    position: relative;
    border: 1px solid var(--el-border-color-lighter);
    padding: 15px;
    border-radius: 8px;
    box-sizing: border-box;
    background-color: var(--el-bg-color);
    transition: box-shadow 0.2s ease-in-out;

    &:hover {
      box-shadow: var(--el-box-shadow);
    }

    &:first-child {
        margin-top: 0;
    }

    .req-item-item {
      display: flex;
      align-items: center;
    }

    .u-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 10px;
      .u-name {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 4px;
      }
      .uid {
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }
    }
  }

  /deep/ .el-dialog__header {
    padding: 12px 20px 10px;
    box-sizing: border-box;
  }
}
</style>
