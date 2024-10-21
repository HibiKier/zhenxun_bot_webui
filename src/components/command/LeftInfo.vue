<template>
  <div class="left-info">
    <div class="ava-info">
      <el-image
        :src="botInfo.ava_url"
        class="ava-img main-ava"
        style="width: 100px; height: 100px"
      />
      <p class="nickname">{{ botInfo.nickname }}</p>
      <div class="account">{{ botInfo.self_id }}</div>
      <div class="fg-cnt">
        <div class="fg-cnt-item">
          <p class="fg-cnt-text">{{ botInfo.friend_count }}</p>
          <p class="base-small-title">好友数量</p>
        </div>
        <div class="line"></div>
        <div class="fg-cnt-item">
          <p class="fg-cnt-text"><svg-icon icon-class="power-open" /></p>
          <p class="base-small-title">全局开关</p>
        </div>
        <div class="line"></div>
        <div class="fg-cnt-item">
          <p class="fg-cnt-text">{{ botInfo.group_count }}</p>
          <p class="base-small-title">群组数量</p>
        </div>
      </div>
      <div class="u-test"></div>
    </div>
    <div class="plugin-load-status">
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
    </div>
    <div class="base-info">
      <p class="left-title-text">基础信息</p>
      <div class="base-border">
        <div class="base-info-box">
          <div class="base-info-box-item">
            <p class="base-info-item-text">{{ botInfo.received_messages }}</p>
            <p class="base-small-title">今日消息</p>
          </div>
          <el-divider direction="vertical" />
          <div class="base-info-box-item">
            <p class="base-info-item-text">{{ botInfo.day_call }}</p>
            <p class="base-small-title">今日调用</p>
          </div>
        </div>
        <el-divider />
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeftInfo",
  data() {
    return {
      botInfo: {},
      sucPluginPer: "100%",
      failPluginPer: "100%",
      timer: null,
    }
  },
  created() {
    this.botInfo = this.$store.state.botInfo || {}
  },
  mounted() {
    if (this.botInfo) {
      if (this.botInfo.plugin_count) {
        this.sucPluginPer =
          (this.botInfo.success_plugin_count / this.botInfo.plugin_count) *
            100 +
          "%"
        this.failPluginPer =
          (this.botInfo.fail_plugin_count / this.botInfo.plugin_count) * 100 +
          "%"
      }
      if (this.botInfo.connect_time) {
        this.botInfo.connectTime = "00:00"
        this.conTime = new Date().getTime() / 1000
        if (!this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setInterval(() => {
          const time = Math.floor(new Date().getTime() / 1000)
          this.botInfo.connectTime = this.formateSeconds(
            time - this.botInfo.connect_time
          )
          this.$forceUpdate()
        }, 1000)
      }
    }
  },
  methods: {
    formateSeconds(endTime) {
      let secondTime = parseInt(endTime) //将传入的秒的值转化为Number
      let min = 0 // 初始化分
      let h = 0 // 初始化小时
      let result = ""
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60) //获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60) //获取秒数，秒数取佘，得到整数秒数
        if (min > 60) {
          //如果分钟大于60，将分钟转换成小时
          h = parseInt(min / 60) //获取小时，获取分钟除以60，得到整数小时
          min = parseInt(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
        }
      }
      result = `${h.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}:${secondTime.toString().padStart(2, "0")}`
      return result
    },
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
  // background-color: #f4f5fa;
  // height: 100%;
  // width: 17%;
  // min-height: 1080px;
  padding: 0 20px;

  .ava-info {
    align-items: center;
    height: 30%;
    padding: auto;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 10px;
    padding: 30px;

    .u-test {
      height: 36px;
    }

    .ava-img {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      margin-top: 30px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      // margin-bottom: 30px;
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
      display: flex;
      margin-top: 45px;
      height: 70px;
      justify-content: center;
      align-items: center;

      .line {
        height: 100%;
        border-left: 1px solid #e9eaee;
        margin-left: 30px;
        margin-right: 30px;
      }

      .fg-cnt-item {
        text-align: center;
        .fg-cnt-text {
          font-size: 25px;
        }
      }
    }
  }

  .plugin-load-status {
    margin-top: 20px;
    padding: 0 50px;
    height: 15%;
    background-color: white;
    border-radius: 10px;
    padding: 30px;

    .process {
      display: flex;
      height: 23px;

      .plugin-load-status-text {
        font-size: 15px;
      }
      .plugin-load-status-process {
        overflow: hidden;
        height: 100%;
        width: 50%;
        margin-left: 50px;
        background-color: #e1e5eb;
        height: 3px;
        margin-top: 10px;

        .base-process-box {
          height: 3px;
        }
      }
    }
  }

  .base-info {
    padding: 0 50px;

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
