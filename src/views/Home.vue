<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
    <div class="flex">
      <!-- 侧边栏 -->
      <aside
        class="w-64 bg-white bg-opacity-90 backdrop-blur-sm shadow-xl transition-all duration-300 fixed md:relative z-50 h-screen"
        :class="{
          'translate-x-0': asideShow,
          '-translate-x-full md:translate-x-0': !asideShow,
          'md:w-20': isCollapsed,
        }"
      >
        <div class="p-0 flex flex-col items-center h-full">
          <!-- 桌面端折叠按钮 -->
          <button
            @click="toggleCollapse"
            class="hidden md:block absolute -right-3 top-6 bg-white p-1 rounded-full shadow-md border border-gray-200 hover:bg-pink-100 transition-colors duration-200 z-10"
          >
            <svg-icon
              :icon-class="isCollapsed ? 'arrow-right' : 'arrow-left'"
              class="w-4 h-4 text-pink-500"
            />
          </button>

          <div
            class="flex items-center justify-between w-full mt-10"
            style="justify-content: center; align-items: center"
          >
            <img
              v-if="!isCollapsed"
              class="w-32 h-32 object-contain animate-bounce-slow"
              src="../assets/image/menu_pic.png"
              alt="菜单"
            />
            <!-- 移动端折叠按钮 -->
            <button
              @click="toggleCollapse"
              class="md:hidden p-2 rounded-full hover:bg-pink-100 transition-colors duration-200"
            >
              <svg-icon
                :icon-class="isCollapsed ? 'arrow-right' : 'arrow-left'"
                class="w-5 h-5 text-pink-500"
              />
            </button>
          </div>

          <div class="w-full mt-4 overflow-y-auto custom-scrollbar flex-1">
            <el-menu
              class="border-0"
              @select="handleSelect"
              :background-color="'transparent'"
              :text-color="'var(--text-color-secondary)'"
              :active-text-color="'var(--primary-color)'"
              :collapse="isCollapsed"
              :collapse-transition="false"
            >
              <el-menu-item
                v-for="menu in menus"
                :key="menu.module"
                :index="menu.router"
                class="group hover:bg-pink-50 rounded-lg my-1 transition-colors duration-200"
                style="display: flex"
              >
                <div class="flex items-center w-full">
                  <span
                    class="h-8 w-1 rounded-full mr-4 transition-colors duration-200"
                    :class="{
                      'bg-pink-400': curSelectMenu === menu.router,
                      'bg-transparent': curSelectMenu !== menu.router,
                    }"
                  ></span>
                  <svg-icon
                    :icon-class="
                      curSelectMenu === menu.router
                        ? menu.icon + '-select'
                        : menu.icon
                    "
                    class="w-6 h-6 transition-colors duration-200"
                    :class="{
                      'text-pink-500': curSelectMenu === menu.router,
                      'text-gray-500': curSelectMenu !== menu.router,
                    }"
                  />
                  <span
                    v-if="!isCollapsed"
                    class="ml-3 text-lg font-medium transition-colors duration-200"
                    :class="{
                      'text-pink-500 font-bold': curSelectMenu === menu.router,
                      'text-gray-600': curSelectMenu !== menu.router,
                    }"
                    >{{ menu.name }}</span
                  >
                  <el-tooltip
                    v-else
                    effect="light"
                    :content="menu.name"
                    placement="right"
                    popper-class="shadow-lg"
                  >
                    <span></span>
                  </el-tooltip>
                </div>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
      </aside>

      <!-- 遮罩层 -->
      <div
        v-if="asideShow"
        @click="toggleMenu"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      ></div>

      <!-- 主内容区 -->
      <div class="flex-1 flex flex-col min-h-screen">
        <!-- 顶部导航 -->
        <header
          class="bg-white bg-opacity-90 backdrop-blur-sm shadow-sm p-4 flex items-center justify-between sticky top-0 z-30"
        >
          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMenu"
            class="md:hidden p-2 rounded-full hover:bg-pink-100 transition-colors duration-200"
          >
            <div class="w-6 h-6 relative">
              <span
                class="absolute left-0 w-full h-0.5 bg-pink-500 rounded-full transition-all duration-300"
                :class="{
                  'top-1/2 transform -translate-y-1/2 rotate-45': asideShow,
                  'top-0': !asideShow,
                }"
              ></span>
              <span
                class="absolute left-0 w-full h-0.5 bg-pink-500 rounded-full transition-all duration-300"
                :class="{
                  'opacity-0': asideShow,
                  'top-1/2 transform -translate-y-1/2': !asideShow,
                }"
              ></span>
              <span
                class="absolute left-0 w-full h-0.5 bg-pink-500 rounded-full transition-all duration-300"
                :class="{
                  'top-1/2 transform -translate-y-1/2 -rotate-45': asideShow,
                  'bottom-0': !asideShow,
                }"
              ></span>
            </div>
          </button>

          <!-- API地址设置按钮 -->
          <router-link
            :to="{ name: 'MyApi' }"
            class="hidden md:flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full text-pink-600 hover:from-pink-200 hover:to-purple-200 transition-all duration-300 shadow-sm"
          >
            <svg-icon icon-class="server" class="w-5 h-5 mr-2" />
            <span>地址设置</span>
          </router-link>

          <!-- 右侧功能区 -->
          <div class="flex items-center space-x-4">
            <!-- 主题切换 -->
            <el-dropdown
              @command="handleThemeChange"
              trigger="click"
              class="hover:bg-pink-100 rounded-full p-2 transition-colors duration-200"
            >
              <span class="el-dropdown-link cursor-pointer">
                <i class="el-icon-magic-stick text-xl text-pink-500"></i>
              </span>
              <el-dropdown-menu
                slot="dropdown"
                class="shadow-lg rounded-xl overflow-hidden"
              >
                <el-dropdown-item
                  v-for="theme in themes"
                  :key="theme.value"
                  :command="theme.value"
                  class="flex items-center px-4 py-2 hover:bg-pink-50"
                >
                  <i
                    :class="theme.icon"
                    class="mr-2"
                    :style="{ color: theme.color }"
                  ></i>
                  <span>{{ theme.label }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- 账号切换 -->
            <el-popover
              placement="bottom-end"
              width="280"
              trigger="hover"
              popper-class="rounded-xl shadow-xl overflow-hidden"
            >
              <div class="max-h-96 overflow-y-auto custom-scrollbar">
                <div
                  v-for="bot in botList"
                  :key="bot.bot_id"
                  @click="getBotInfo(bot.self_id)"
                  class="flex items-center p-3 hover:bg-pink-50 cursor-pointer transition-colors duration-200"
                  :class="{ 'bg-pink-100': bot.is_select }"
                >
                  <el-image
                    :src="bot.ava_url"
                    class="w-10 h-10 rounded-full object-cover border-2 border-pink-200"
                  />
                  <div class="ml-3">
                    <p class="font-medium text-gray-800">{{ bot.nickname }}</p>
                    <span class="text-xs text-gray-500">{{ bot.self_id }}</span>
                  </div>
                </div>
              </div>

              <template #reference>
                <div class="flex items-center cursor-pointer group">
                  <span
                    class="mr-2 text-gray-700 group-hover:text-pink-500 transition-colors duration-200"
                  >
                    切换账号
                  </span>
                  <el-image
                    :src="botInfo.ava_url"
                    class="w-10 h-10 rounded-full object-cover border-2 border-pink-300 shadow-sm"
                  />
                </div>
              </template>
            </el-popover>

            <!-- 用户下拉菜单 -->
            <el-dropdown
              @command="handleCommand"
              trigger="click"
              class="hover:bg-pink-100 rounded-full p-2 transition-colors duration-200"
            >
              <span class="el-dropdown-link cursor-pointer flex items-center">
                <span class="font-medium text-gray-700 mx-2">{{
                  botInfo.nickname || "用户"
                }}</span>
                <i class="el-icon-arrow-down text-pink-500"></i>
              </span>
              <el-dropdown-menu
                slot="dropdown"
                class="shadow-lg rounded-xl overflow-hidden"
              >
                <el-dropdown-item
                  command="logout"
                  class="flex items-center px-4 py-2 hover:bg-pink-50 text-red-500"
                >
                  <i class="el-icon-switch-button mr-2"></i>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </header>

        <!-- 主内容 -->
        <main class="flex-1 p-4 bg-gradient-to-br from-pink-50 to-purple-50">
          <router-view
            class="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-sm p-6 transition-all duration-300"
            :class="{
              'md:ml-0': !isCollapsed,
              'md:ml-20': isCollapsed,
            }"
            :key="rvKey"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainHome",
  data() {
    return {
      asideShow: false,
      isCollapsed: false,
      rvKey: 0,
      menus: [],
      botList: [],
      botInfo: {},
      curSelectMenu: null,
      firstLoad: true,
      windowHeight: window.innerHeight,
      themes: [
        {
          value: "light",
          label: "亮色模式",
          icon: "el-icon-sunny",
          color: "#F59E0B",
        },
        {
          value: "dark",
          label: "暗黑模式",
          icon: "el-icon-moon",
          color: "#6B7280",
        },
        {
          value: "pink",
          label: "少女粉",
          icon: "el-icon-present",
          color: "#EC4899",
        },
        {
          value: "one-dark",
          label: "One Dark",
          icon: "el-icon-monitor",
          color: "#7C3AED",
        },
      ],
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
    window.addEventListener("resize", this.checkScreenSize)

    // 从本地存储获取折叠状态
    const collapsed = localStorage.getItem("menuCollapsed")
    if (collapsed !== null) {
      this.isCollapsed = JSON.parse(collapsed)
    }
    this.checkScreenSize()
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
    window.removeEventListener("resize", this.checkScreenSize)
    window.sessionStorage.removeItem("isAuthenticated")
  },
  inject: ["setAppTheme"],
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight
    },
    checkScreenSize() {
      // 在小屏幕时自动隐藏菜单
      if (window.innerWidth < 768) {
        this.asideShow = false
      } else {
        this.asideShow = !this.isCollapsed
      }
    },
    handleSelect(index) {
      this.asideShow = false
      if (index.charAt(0) !== "/") {
        index = "/" + index
      }
      this.curSelectMenu = index
      this.$router.replace(index)
    },
    toggleMenu() {
      this.asideShow = !this.asideShow
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
      // 保存折叠状态到本地存储
      localStorage.setItem("menuCollapsed", this.isCollapsed)
      // 在桌面端调整菜单显示状态
      if (window.innerWidth >= 768) {
        this.asideShow = !this.isCollapsed
      }
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
      if (typeof this.setAppTheme === "function") {
        this.setAppTheme(command)
      } else {
        console.error("setAppTheme function not provided/injected correctly.")
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

<style scoped>
/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(236, 72, 153, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.5);
}

/* 缓慢弹跳动画 */
@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}

/* 菜单项悬停效果 */
.el-menu-item:hover {
  background-color: rgba(249, 168, 212, 0.2) !important;
}
.el-menu-item.is-active {
  background-color: rgba(249, 168, 212, 0.1) !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-dropdown-link span {
    display: none;
  }
}

/* 折叠菜单样式 */
.el-menu--collapse {
  width: 80px;
}
.el-menu--collapse .el-menu-item {
  display: flex;
  justify-content: center;
  padding: 0 10px !important;
}
.el-menu--collapse .el-menu-item .svg-icon {
  margin-right: 0;
}
</style>
