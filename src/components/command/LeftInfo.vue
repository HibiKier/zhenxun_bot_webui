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
                  <p class="fg-cnt-text">
                    <svg-icon icon-class="power-open" />
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
    <!-- <div class="plugin-load-status">
      <p class="left-title-text">插件加载状态</p>
      <div class="process">
        <span class="plugin-load-status-text">插件数量</span>
        <div class="plugin-load-status-process">
          <div class="base-process-box" style="background-color: #45a6f7"></div>
        </div>
      </div>
      <div class="process" style="margin: 40px 0">
        <span class="plugin-load-status-text">加载成功</span>
        <div class="plugin-load-status-process">
          <div
            class="base-process-box"
            :style="{ 'background-color': '#5c87ff', width: sucPluginPer }"
          ></div>
        </div>
      </div>
      <div class="process">
        <span class="plugin-load-status-text">加载失败</span>
        <div class="plugin-load-status-process">
          <div
            class="base-process-box"
            :style="{ 'background-color': '#ab55ff', width: failPluginPer }"
          ></div>
        </div>
      </div>
    </div> -->
    <div class="base-info" :style="{ height: computedHeight + 'px' }">
      <p class="left-title-text">Bot插件管理</p>
      <!-- <div class="base-border">
        <div class="base-info-box">
          <div class="base-info-box-item">
            <p class="base-info-item-text">{{ botInfo.connect_count }}</p>
            <p class="base-small-title">累计登录</p>
          </div>
          <el-divider direction="vertical" />
          <div class="base-info-box-item">
            <p class="base-info-item-text">{{ botInfo.connectTime }}</p>
            <p class="base-small-title">连接时长</p>
          </div>
        </div>
        <el-divider />
        <div class="base-info-box" style="margin-top: 18px">
          <div class="base-info-box-item" style="width: 240px">
            <p class="base-info-item-text" style="font-size: 22px">
              {{ botInfo.connect_date }}
            </p>
            <p class="base-small-title">连接日期</p>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { getFontSize, getConvertSize } from "@/utils/utils"
export default {
  name: "LeftInfo",
  data() {
    return {
      fontSizeMana: {
        nameText: 30,
        accountText: 15,
        fgCntText: 25,
        fgCntTip: 13,
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

    .base-border {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    ::v-deep .el-divider--horizontal {
      margin: 0;
    }

    .base-info-box {
      display: flex;

      ::v-deep .el-divider--vertical {
        margin: 0;
        height: 73px;
      }

      .base-info-box-item {
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        width: 150px;

        .base-info-item-text {
          font-size: 25px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
