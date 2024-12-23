<template>
  <div class="left-info" ref="leftInfo">
    <div class="ava-info" ref="avaInfo">
      <el-row>
        <el-col :span="24">
          <el-image
            :src="botInfo.ava_url"
            class="ava-img main-ava"
            :style="{ width: avaImageSize + 'px', height: avaImageSize + 'px' }"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p
            class="nickname"
            :style="{ fontSize: fontSizeMana.nameText + 'px' }"
          >
            {{ botInfo.nickname }}
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div
            class="account"
            :style="{ fontSize: fontSizeMana.accountText + 'px' }"
          >
            {{ botInfo.self_id }}
          </div>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="24">
          <div class="fg-cnt">
            <el-row :gutter="20">
              <el-col
                :span="8"
                style="border-right: 1px solid #f5f6f8; line-height: 25px"
              >
                <div class="fg-cnt-item">
                  <p
                    class="fg-cnt-text"
                    :style="{ fontSize: fontSizeMana.fgCntText + 'px' }"
                  >
                    {{ botInfo.friend_count }}
                  </p>
                  <p
                    class="base-small-title"
                    :style="{ fontSize: fontSizeMana.fgCntTip + 'px' }"
                  >
                    好友数量
                  </p>
                </div>
              </el-col>
              <el-col
                :span="8"
                style="border-right: 1px solid #f5f6f8; line-height: 25px"
              >
                <div class="fg-cnt-item">
                  <p class="fg-cnt-text" @click="handleBotStatus">
                    <svg-icon
                      style="cursor: pointer"
                      :icon-class="
                        botInfo.status ? 'power-open' : 'power-close'
                      "
                    />
                  </p>
                  <p
                    class="base-small-title"
                    :style="{ fontSize: fontSizeMana.fgCntTip + 'px' }"
                  >
                    全局开关
                  </p>
                </div>
              </el-col>
              <el-col :span="8" style="line-height: 25px">
                <div class="fg-cnt-item">
                  <p
                    class="fg-cnt-text"
                    :style="{ fontSize: fontSizeMana.fgCntText + 'px' }"
                  >
                    {{ botInfo.group_count }}
                  </p>
                  <p
                    class="base-small-title"
                    :style="{ fontSize: fontSizeMana.fgCntTip + 'px' }"
                  >
                    群组数量
                  </p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="base-info" :style="{ height: computedHeight + 'px' }">
      <p
        class="left-title-text"
        :style="{ fontSize: fontSizeMana.titleText + 'px' }"
      >
        Bot插件管理
      </p>
      <div class="bot-manage">
        <el-row>
          <el-col :span="6">
            <span>全局禁用被动</span>
          </el-col>
          <el-col :span="18">
            <el-select
              v-model="postData.blockTasks"
              multiple
              placeholder=""
              style="width: 100%"
            >
              <el-option
                v-for="v in botModuleData.blockTasks"
                :label="v.name"
                :value="v.module"
                :key="v.module"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 30px">
          <el-col :span="6">
            <span>全局禁用插件</span>
          </el-col>
          <el-col :span="18">
            <el-select
              v-model="postData.blockPlugins"
              placeholder=""
              multiple
              style="width: 100%"
            >
              <el-option
                v-for="n in botModuleData.blockPlugins"
                :label="n.name"
                :value="n.module"
                :key="n.module"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 30px">
          <MyButton @click="clickBotManage" text="应用" />
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getFontSize, getConvertSize } from "@/utils/utils"
import MyButton from "../ui/MyButton.vue"
export default {
  name: "LeftInfo",
  components: { MyButton },
  data() {
    return {
      fontSizeMana: {
        nameText: 30,
        accountText: 15,
        fgCntText: 25,
        fgCntTip: 13,
        titleText: 17,
      },
      botModuleData: {
        blockPlugins: [],
        blockTasks: [],
      },
      postData: {
        blockPlugins: [],
        blockTasks: [],
      },
      botInfo: {},
      avaImageSize: 100,
      baseHeight: 0,
    }
  },
  computed: {
    computedHeight() {
      return this.baseHeight
    },
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    this.handleResize()
    this.getBotModuleData()
  },
  methods: {
    handleResize() {
      this.initFontSize()
      this.avaImageSize = getConvertSize(100)
      this.$nextTick(() => {
        this.baseHeight =
          this.$refs.leftInfo.offsetHeight -
          this.$refs.avaInfo.offsetHeight -
          20
      })
    },
    initFontSize() {
      this.fontSizeMana.nameText = getFontSize(30)
      this.fontSizeMana.accountText = getFontSize(20)
      this.fontSizeMana.fgCntText = getFontSize(25)
      this.fontSizeMana.fgCntTip = getFontSize(16)
      this.fontSizeMana.titleText = getFontSize(17)
    },
    handleBotStatus() {
      var loading = this.getLoading(".left-info")
      this.postRequest(`${this.$root.prefix}/main/change_bot_status`, {
        bot_id: this.botInfo.self_id,
        status: !this.botInfo.status,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.botInfo.status = !this.botInfo.status
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    getBotModuleData() {
      var loading = this.getLoading(".left-info")
      this.getRequest(`${this.$root.prefix}/main/get_bot_block_module`, {
        bot_id: this.botInfo.self_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.botModuleData.blockPlugins = resp.data.all_plugins
            this.botModuleData.blockTasks = resp.data.all_tasks
            this.postData.blockPlugins = resp.data.block_plugins
            this.postData.blockTasks = resp.data.block_tasks
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    clickBotManage() {
      var loading = this.getLoading(".left-info")
      this.postRequest(`${this.$root.prefix}/main/update_bot_manage`, {
        bot_id: this.botInfo.self_id,
        block_plugins: this.postData.blockPlugins,
        block_tasks: this.postData.blockTasks,
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
      })
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-divider--horizontal {
  margin: 50px 0;
}

.left-title-text {
  color: #9f9fa1;
  margin-bottom: 30px;
}

.base-small-title {
  color: #afb2b9;
  font-size: 13px;
  margin-top: 10px;
}

.left-info {
  padding: 0 20px;
  height: 100%;
  box-sizing: border-box;

  .ava-info {
    align-items: center;
    padding: auto;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 10px;
    padding: 30px;

    .ava-img {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      margin-top: 30px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .nickname {
      font-size: 30px;
      font-weight: 500;
      margin-top: 10px;
    }
    .account {
      color: #ffffff;
      background-color: #5c87ff;
      padding: 6px;
      margin-top: 13px;
      border-radius: 5px;
    }

    .fg-cnt {
      margin-top: 45px;
      width: 100%;

      .fg-cnt-item {
        text-align: center;
        .fg-cnt-text {
          font-size: 25px;
        }
      }
    }
  }

  .base-info {
    padding: 0 50px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: white;
    margin-top: 20px;
    padding: 30px;
    height: 370px;

    .bot-manage {
      color: #939395;
    }

    /deep/ .el-row {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    ::v-deep .el-divider--horizontal {
      margin: 0;
    }
  }
}
</style>
