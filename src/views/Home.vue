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
          <div class="right-content">
            <el-dropdown @command="handleThemeChange" trigger="click" style="margin-right: 15px;">
              <span class="el-dropdown-link theme-switcher" title="切换主题">
                 <i class="el-icon-magic-stick"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="light"> <i class="el-icon-sunny" style="margin-right: 5px;"></i>亮色模式 </el-dropdown-item>
                <el-dropdown-item command="dark"> <i class="el-icon-moon" style="margin-right: 5px;"></i>暗黑模式 </el-dropdown-item>
                <el-dropdown-item command="pink"> <i class="el-icon-present" style="margin-right: 5px;"></i>少女粉 </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- User Info Dropdown -->
            <el-dropdown @command="handleCommand">
              <!-- Restore the trigger element for user dropdown -->
              <span class="el-dropdown-link" style="cursor: pointer; display: flex; align-items: center;">
                {{ botInfo.nickname || '用户' }} <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                 <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                 <!-- Add other user actions if needed -->
              </el-dropdown-menu>
            </el-dropdown>
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
  inject: ['setAppTheme'],
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
              this.rvKey++
            }
          }
          this.curSelectMenu = this.$route.path
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    handleThemeChange(command) {
      if (typeof this.setAppTheme === 'function') {
        this.setAppTheme(command);
      } else {
        console.error("setAppTheme function not provided/injected correctly.");
      }
    },
    handleCommand(cmd) {
      if (cmd == "logout") {
        // ... logout logic ...
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.my-main {
  padding: 10px;
  overflow-x: hidden;
  box-sizing: border-box;
  background-color: var(--bg-color);
  // min-width: 2336px;
  // min-height: 1167px;
}
.el-menu-item {
  color: var(--text-color-secondary);
  &:hover {
    background-color: var(--bg-color-hover);
  }
  &.is-active {
    color: var(--primary-color);
  }
  span {
    margin-left: 10px;
    font-size: larger;
    font-weight: bold;
  }
}

.homeHeader {
  position: relative;
  // background-color: #409eff;
  background-color: var(--bg-color-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
  .right-content {
    display: flex;
    align-items: center;
  }
}
.el-menu {
  border-right: none !important;
  background-color: var(--bg-color-secondary);
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
  background-color: var(--bg-color-secondary);
  width: 14rem !important;
  transition: all 0.2s ease;
  border-right: 1px solid var(--border-color-light);
  // border-right: 1px solid #000000;
}

.myscrollbar {
  /* height: 100%; */
  // margin-top: 59px;
  // text-align: center;

  .add-select-color {
    background-color: var(--primary-color);
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
    &.is-active span,
    &.selectMenu span {
        color: var(--primary-color);
        font-weight: bold;
    }
    &.is-active svg {
        color: var(--primary-color);
    }
  }
}
.layoutbox {
  height: calc(100vh - 60px);
  background-color: var(--bg-color);
}
.to-myapi {
  width: 8rem;
  height: 30px;
  line-height: 30px;
  font-size: 1rem;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
  display: inline-block;
  padding: 0 15px;
  box-sizing: border-box;
  color: var(--el-text-color-regular);
  background-color: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  transition: all 0.3s ease;

  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-7);
  }
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
  color: var(--primary-color) !important;
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

.theme-switcher {
    cursor: pointer;
    font-size: 20px; /* Adjust icon size */
    color: var(--el-text-color-primary); /* Use variable for color */
}

/* Style for dropdown link when active/hover if needed */
.el-dropdown-link {
  cursor: pointer;
  /* color: #409eff; */
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
