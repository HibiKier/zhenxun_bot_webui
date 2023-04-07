<template>
  <div class="main-border">
    <div class="center-border">
      <div class="top-info">
        <div class="info-item">
          <div class="gf-item">
            <svg-icon icon-class="friend" />
            <span>好友数量</span>
            <span>900</span>
          </div>
          <el-divider></el-divider>
          <div class="gf-item"></div>
        </div>
      </div>
    </div>
    <div class="right-manage">
      <div
        v-for="bot in botList"
        :key="bot.self_id"
        :class="{ 'bot-border': true, active: bot.is_select }"
      >
        <el-image :src="bot.ava_url" class="ava-img" />
        <div class="bot-name">
          <p>{{ bot.nickname }}</p>
          <span class="self-id">{{ bot.self_id }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainCommand",

  data() {
    return {
      botList: [],
      botInfo: null,
    }
  },
  mounted() {
    this.getBotInfo()
  },
  methods: {
    getBotInfo(self_id = "") {
      this.getRequest("/zhenxun/api/get_bot_info?self_id=" + self_id).then(
        (resp) => {
          if (resp.suc) {
            this.$message.success(resp.info)
            this.botList = resp.data
            for (const bot of this.botList) {
              if (bot.is_select) {
                this.botInfo = bot
                break
              }
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.main-border {
  background-color: #edf0f3;
  width: 100%;
  height: 100%;
  position: relative;
  float: left;

  .self-id {
    color: #abb0ae;
    font-size: small;
  }

  .bot-name {
    margin-left: 60px;
    margin-top: 4px;
  }

  .ava-img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    float: left;
    margin-left: 10px;
  }

  .bot-border {
    width: 100%;
    height: 50px;
    align-items: center;
    float: left;
    padding-top: 5px;
  }

  .bot-border:hover {
    background-color: #e4e3e5;
    cursor: pointer;
  }

  .active {
    background-color: #e4e3e5;
  }

  .center-border {
    height: 100%;
    width: calc(100% - 311px);
    float: left;

    .top-info {
      background-color: #fff;
      height: 20%;
      align-content: center;
      justify-content: center;
      display: flex;

      .info-item {
        width: 200px;
        height: 180px;
        background-color: #edf0f3;
        margin-top: auto;
        margin-bottom: auto;
        .gf-item {
          height: 50%;

          .svg-icon {
            width: 35px;
            height: 35px;
            margin-top: 10px;
          }
        }
        /deep/ .el-divider--horizontal {
          margin: 0;
        }
      }
    }
  }

  .right-manage {
    height: 100%;
    width: 280px;
    background-color: #fff;
    position: absolute;
    right: 10px;
  }
}
</style>
