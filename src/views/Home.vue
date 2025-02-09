<template>
  <div>
    <el-container>
      <el-aside class="left-aside" :class="{ show: asideShow }">
        <img class="menu-pic" src="../assets/image/menu_pic.png" alt="菜单" />
        <div class="myscrollbar">
          <el-menu class="border-right-none" @select="handleSelect">
            <el-menu-item
              v-for="menu in menus"
              :key="menu.module"
              :index="menu.router"
            >
              <span :class="checkClass(menu.module)"></span>
              <svg-icon
                v-if="curSelectMenu == menu.router"
                :icon-class="menu.icon + '-select'"
                class="menu-icon-class"
              />
              <svg-icon
                v-else
                :icon-class="menu.icon"
                class="menu-icon-class"
              />
              <span
                slot="title"
                :class="{ selectMenu: curSelectMenu == menu.router }"
                >{{ menu.name }}</span
              >
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-container
        class="layoutbox"
        :style="{ height: computedHeight + 'px' }"
      >
        <el-header class="homeHeader">
          <router-link class="to-myapi" :to="{ name: 'MyApi' }"
            >地址设置</router-link
          >
          <div class="menu-btn" @click="showMenu">
            <div class="btn-logo" :class="{ show: asideShow }"></div>
            <div class="cover" :class="{ coverShow: coverShow }"></div>
          </div>
          <div class="change-account">
            <div class="change-item">
              <svg-icon icon-class="change" style="margin-right: 10px" />
              <el-popover width="200" trigger="hover">
                <div>
                  <el-scrollbar style="height: 100%">
                    <div
                      v-for="bot in botList"
                      :key="bot.bot_id"
                      :class="{ 'bot-border': true, active: bot.is_select }"
                      @click="getBotInfo(bot.self_id)"
                    >
                      <el-image :src="bot.ava_url" class="ava-img" />
                      <div class="bot-name">
                        <p>{{ bot.nickname }}</p>
                        <span class="self-id">{{ bot.self_id }}</span>
                      </div>
                    </div>
                  </el-scrollbar>
                </div>
                <span slot="reference" style="cursor: pointer">切换账号</span>
              </el-popover>
            </div>

            <el-image :src="botInfo.ava_url" class="head-img" />
          </div>
        </el-header>
        <el-main class="my-main"
          ><router-view class="homeRouterView" :key="rvKey"
        /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  data() {
    return {
      asideShow: false,
      coverShow: false,
      rvKey: 0,
      menus: [],
      botList: [],
      botInfo: {},
      curSelectMenu: null,
      firstLoad: true,
      windowHeight: window.innerHeight,
    }
  },
  computed: {
    computedHeight() {
      return this.windowHeight - 1
    },
  },
  created() {
    this.getBotInfo()
  },
  mounted() {
    this.getMenus()
    this.$store.dispatch("initStatusSocket")
    window.addEventListener("resize", this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
    window.sessionStorage.removeItem("isAuthenticated")
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight
    },
    checkClass(type) {
      return {
        "base-select-status": true,
        "add-select-color": this.curSelectMenu == type,
      }
    },
    handleSelect(index) {
      this.asideShow = false
      this.coverShow = false
      if (index.charAt(0) !== "/") {
        index = "/" + index
      }
      this.curSelectMenu = index
      this.$router.replace(index)
    },
    showMenu() {
      this.asideShow = !this.asideShow
      this.coverShow = !this.coverShow
    },
    getMenus() {
      this.getRequest(`${this.$root.prefix}/menu/get_menus`).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.menus = resp.data.menus
            this.$store.commit("SET_BOT_TYPE", resp.data.bot_type)
            if (this.$route.path == "/") {
              for (const menu of this.menus) {
                if (menu.default) {
                  this.curSelectMenu = menu.router
                  break
                }
              }
            } else {
              for (const menu of this.menus) {
                if (menu.router == this.$route.path) {
                  this.curSelectMenu = menu.router
                }
              }
            }
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    async getBotInfo(bot_id) {
      this.getRequest(`${this.$root.prefix}/main/get_base_info`, {
        bot_id,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.botList = resp.data
            if (!this.botList.length) {
              this.$store.state.botInfo = null
            } else {
              if (this.$store.state.botInfo) {
                // 判断store中的bot是否存在botList中
                let is_in = false
                for (const bot of this.botList) {
                  if (bot.self_id == this.$store.state.botInfo.self_id) {
                    is_in = true
                    break
                  }
                }
                if (!is_in) {
                  this.$store.state.botInfo = null
                }
              }
              if (this.$store.state.botInfo && !bot_id) {
                this.botInfo = this.$store.state.botInfo
                for (const bot of this.botList) {
                  bot.is_select = bot.self_id == this.botInfo.self_id
                  if (bot.is_select) {
                    this.botInfo = bot
                    this.$store.commit("SET_BOT", bot)
                  }
                }
              } else {
                for (const bot of this.botList) {
                  if (bot.is_select) {
                    this.botInfo = bot
                    this.$store.commit("SET_BOT", bot)
                    break
                  }
                }
              }
            }
          }
          this.$store.commit("CLEAR_CHAT")
          if (["/command", "/manage"].includes(this.$route.path)) {
            if (this.$route.path == "/command" && this.firstLoad) {
              this.firstLoad = false
            } else {
              // this.firstLoad = false
              this.rvKey++
            }
          }
          this.curSelectMenu = this.$route.path
        } else {
          this.$message.error(resp.info)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.my-main {
  padding: 10px;
  overflow-x: hidden;
  box-sizing: border-box;
  background-color: #f4f5fa;
  // min-width: 2336px;
  // min-height: 1167px;
}
.el-menu-item {
  span {
    margin-left: 10px;
    font-size: larger;
    font-weight: bold;
  }
}

.homeHeader {
  position: relative;
  // background-color: #409eff;
  background-color: #f5f6f8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
}
.el-menu {
  border-right: none;
}
.menu-btn {
  display: none;
  align-items: flex-end;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding-bottom: 0.6rem;
  margin-right: 1rem;
}
.btn-logo {
  position: relative;
  width: 100%;
  height: 0.2rem;
  background: #5a9cf8;
  /* box-shadow: 0 0.6rem 0 0 #fff,
              0 -0.6rem 0 0 #fff; */
}
.btn-logo::before,
.btn-logo::after {
  content: "";
  position: absolute;
  left: 0;
  top: -0.6rem;
  width: 100%;
  height: 0.2rem;
  background: #5a9cf8;
  transition: all 0.2s ease;
  transform-origin: center;
}
.btn-logo::after {
  top: -1.2rem;
}
.show.btn-logo::before {
  top: -0.9rem;
  transform: rotate(-45deg);
}
.show.btn-logo::after {
  top: -0.9rem;
  transform: rotate(45deg);
}
.homeHeader .title {
  font-size: 30px;
  font-family: 宋体;
  color: #adaeb0;
}

.left-aside {
  background-color: #ffffff;
  width: 14rem !important;
  transition: all 0.2s ease;
  // border-right: 1px solid #000000;
}

.myscrollbar {
  /* height: 100%; */
  // margin-top: 59px;
  // text-align: center;

  .add-select-color {
    background-color: #5a85ff;
  }

  .svg-icon {
    vertical-align: -7px;
  }

  .base-select-status {
    margin-left: 0 !important;
    display: inline-block;
    width: 3px;
    height: 100%;
    margin-right: 30px;
  }

  ::v-deep .el-menu-item {
    padding-left: 0 !important;

    span {
      font-weight: 400;
    }
  }
}
.layoutbox {
  height: calc(100vh - 60px);
  background-color: #f0f2f5;
}
.to-myapi {
  width: 8rem;
  height: 30px;
  line-height: 30px;
  font-size: 1.2rem;
  color: #adaeb0;
  text-decoration: none;
  border-radius: 10px;
  border: 5px solid #fff;
  text-align: center;
}
.border-right-none {
  border-right: none !important;
}

.change-account {
  justify-content: center;
  align-items: center;
  display: flex;
}

.change-item {
  color: #adaeb0;
  margin-right: 10px;
}

@media screen and (max-width: 1750px) {
  .menu-btn {
    display: flex;
  }
  .left-aside {
    position: fixed;
    top: 60px;
    left: 0;
    width: 0 !important;
    height: calc(100vh - 60px);
    z-index: 999999;
  }
  .show {
    width: 14rem !important;
  }
  .cover {
    position: fixed;
    top: 60px;
    right: 0;
    height: calc(100vh - 60px);
    width: 0%;
    background-color: #00000080;
    z-index: 9999;
  }
  .coverShow {
    width: 100%;
  }
  .to-myapi {
    position: absolute;
    right: 13rem;
    top: 13px;
  }
}

.menu-icon-class {
  height: 25px;
  width: 25px;
  margin-top: 5px;
}
.bot-name {
  margin-left: 60px;
  margin-top: 4px;
}
.head-img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  margin-right: 30px;
}
.ava-img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  float: left;
  margin-left: 10px;
}
.self-id {
  color: #abb0ae;
  font-size: small;
}
.bot-border {
  width: 100%;
  height: 50px;
  align-items: center;
  float: left;
  padding-top: 5px;
  cursor: pointer;
}
.active {
  background-color: #e4e3e5;
}

.menu-pic {
  width: 120px;
  height: 170px;
  margin-left: 50px;
}

.selectMenu {
  font-weight: bold !important;
  color: #409eff;
}

@media screen and (max-width: 600px) {
  .menu-btn {
    display: flex;
  }
  .left-aside {
    position: fixed;
    top: 60px;
    left: 0;
    width: 0 !important;
    height: calc(100vh - 60px);
    z-index: 999999;
  }
  .show {
    width: 12rem !important;
  }
  .cover {
    position: fixed;
    top: 60px;
    right: 0;
    height: calc(100vh - 60px);
    width: 0%;
    background-color: #00000080;
    z-index: 9999;
  }
  .coverShow {
    width: 100%;
  }
}
@media screen and (max-width: 600px) {
  .title {
    font-size: 1.4rem !important;
  }
  .loginContainer {
    width: calc(100vw - 10rem);
    top: calc(30%);
  }
  .to-myapi {
    width: 6rem !important;
    font-size: 1rem !important;
    border: 2px solid #fff !important;
  }
}
</style>
