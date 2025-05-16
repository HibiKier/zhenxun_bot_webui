<template>
  <div class="min-h-screen" :style="{ background: 'var(--bg-color)' }">
    <div class="flex">
      <!-- 侧边栏 -->
      <aside
        class="backdrop-blur-sm shadow-xl fixed md:relative z-50 h-screen flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="{
          width: getMenuWidth(),
          transform: getTransform(),
          backgroundColor: 'var(--bg-color-secondary)',
        }"
      >
        <div class="flex flex-col h-full overflow-hidden">
          <!-- 顶部内容 -->
          <div class="flex-1 overflow-y-auto">
            <div
              class="p-4 flex justify-center"
              style="height: 130px; margin-top: 20px"
            >
              <img
                v-if="!isCollapsed"
                class="w-48 h-24 object-contain animate-bounce-slow transition-opacity duration-300"
                src="../assets/image/logo.png"
                alt="Logo"
              />
            </div>

            <div class="px-2 pb-4">
              <el-menu
                class="border-0 transition-all duration-300"
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
                  class="group rounded-lg my-1 transition-all duration-300 flex justify-center"
                  :style="{
                    backgroundColor:
                      curSelectMenu === menu.router
                        ? 'var(--bg-color-hover)'
                        : 'transparent',
                  }"
                >
                  <div class="flex items-center w-full">
                    <span
                      class="h-8 w-1 rounded-full mr-4 transition-all duration-300"
                      :style="{
                        backgroundColor:
                          curSelectMenu === menu.router
                            ? 'var(--primary-color)'
                            : 'transparent',
                      }"
                    ></span>
                    <svg-icon
                      :icon-class="
                        curSelectMenu === menu.router
                          ? menu.icon + '-select'
                          : menu.icon
                      "
                      size="1.7em"
                      class="w-6 h-6 transition-all duration-300"
                      :style="{
                        '--icon-color':
                          curSelectMenu === menu.router
                            ? 'var(--primary-color)'
                            : 'var(--text-color-secondary)',
                      }"
                      :color="
                        curSelectMenu === menu.router
                          ? 'var(--primary-color)'
                          : 'var(--text-color-secondary)'
                      "
                    />
                    <span
                      v-if="!isCollapsed"
                      class="ml-3 text-lg font-medium transition-all duration-300"
                      :style="{
                        color:
                          curSelectMenu === menu.router
                            ? 'var(--primary-color)'
                            : 'var(--text-color)',
                        fontWeight:
                          curSelectMenu === menu.router ? 'bold' : 'normal',
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
        </div>
      </aside>

      <!-- 主内容区 -->
      <div
        class="flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="{
          width: isCollapsed ? 'calc(100% - 5.5rem)' : 'calc(100% - 18.5rem)',
          overflow: 'hidden',
        }"
      >
        <!-- 顶部导航 -->
        <header
          class="backdrop-blur-sm shadow-sm p-4 flex items-center justify-between sticky top-0 z-30"
          :style="{ backgroundColor: 'var(--bg-color-secondary)' }"
        >
          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMenu"
            class="md:hidden p-2 rounded-full transition-all duration-300"
            :style="{ backgroundColor: 'var(--bg-color-hover)' }"
          >
            <svg-icon
              :icon-class="!asideShow ? 'arrow-right' : 'arrow-left'"
              class="w-5 h-5 transition-transform duration-300"
              :style="{ color: 'var(--primary-color)' }"
              :class="{ 'rotate-180': asideShow }"
            />
          </button>

          <!-- 左侧功能区 -->
          <div class="flex items-center space-x-4">
            <!-- 桌面端菜单展开/收起按钮 -->
            <button
              v-if="!isMobile"
              @click="toggleCollapse"
              class="hidden md:flex items-center p-2 rounded-full transition-all duration-300"
              :style="{ backgroundColor: 'var(--bg-color-hover)' }"
            >
              <svg-icon
                :icon-class="isCollapsed ? 'arrow-right' : 'arrow-left'"
                class="w-5 h-5 transition-transform duration-300"
                :style="{ color: 'var(--primary-color)' }"
                :class="{ 'rotate-180': isCollapsed }"
              />
            </button>

            <!-- API地址设置按钮 -->
            <router-link
              :to="{ name: 'MyApi' }"
              class="hidden md:flex items-center px-4 py-2 rounded-full transition-all duration-300 shadow-sm"
              :style="{
                background: `linear-gradient(to right, var(--primary-color-light-9), var(--primary-color-light-8))`,
                color: 'var(--primary-color)',
              }"
            >
              <svg-icon icon-class="server" class="w-5 h-5 mr-2" />
              <span>地址设置</span>
            </router-link>
          </div>

          <!-- 右侧功能区 -->
          <div class="flex items-center space-x-4">
            <!-- 主题切换 -->
            <el-dropdown
              @command="handleThemeChange"
              trigger="click"
              class="rounded-full p-2 transition-all duration-300"
              :style="{ backgroundColor: 'var(--bg-color-hover)' }"
            >
              <span class="el-dropdown-link cursor-pointer">
                <i
                  class="el-icon-magic-stick text-xl"
                  :style="{ color: 'var(--primary-color)' }"
                ></i>
              </span>
              <el-dropdown-menu
                slot="dropdown"
                class="shadow-lg rounded-xl overflow-hidden transition-all duration-300"
              >
                <el-dropdown-item
                  v-for="theme in themes"
                  :key="theme.value"
                  :command="theme.value"
                  class="flex items-center px-4 py-2 transition-all duration-200"
                  :style="{ backgroundColor: 'var(--bg-color-hover)' }"
                >
                  <i
                    :class="theme.icon"
                    class="mr-2"
                    :style="{ color: theme.color }"
                  ></i>
                  <span :style="{ color: 'var(--text-color)' }">{{
                    theme.label
                  }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- 账号切换 -->
            <el-popover
              placement="bottom-end"
              width="280"
              trigger="hover"
              popper-class="rounded-xl shadow-xl overflow-hidden transition-all duration-300"
            >
              <div class="max-h-96 overflow-y-auto custom-scrollbar">
                <div
                  v-for="bot in botList"
                  :key="bot.bot_id"
                  @click="getBotInfo(bot.self_id)"
                  class="flex items-center p-3 cursor-pointer transition-all duration-300"
                  :style="{
                    backgroundColor: bot.is_select
                      ? 'var(--bg-color-hover)'
                      : 'transparent',
                  }"
                >
                  <el-image
                    :src="bot.ava_url"
                    class="w-10 h-10 rounded-full object-cover border-2 transition-all duration-300"
                    :style="{ borderColor: 'var(--primary-color-light)' }"
                  />
                  <div class="ml-3">
                    <p
                      :style="{ color: 'var(--text-color)' }"
                      class="font-medium"
                    >
                      {{ bot.nickname }}
                    </p>
                    <span
                      :style="{ color: 'var(--text-color-secondary)' }"
                      class="text-xs"
                      >{{ bot.self_id }}</span
                    >
                  </div>
                </div>
              </div>

              <template #reference>
                <div class="flex items-center cursor-pointer group">
                  <span
                    class="mr-2 transition-all duration-300"
                    :style="{ color: 'var(--text-color)' }"
                  >
                    切换账号
                  </span>
                  <el-image
                    :src="botInfo.ava_url"
                    class="w-10 h-10 rounded-full object-cover border-2 shadow-sm transition-all duration-300"
                    :style="{ borderColor: 'var(--primary-color)' }"
                  />
                </div>
              </template>
            </el-popover>

            <!-- 用户下拉菜单 -->
            <el-dropdown
              @command="dropdownClick"
              trigger="click"
              class="rounded-full p-2 transition-all duration-300"
              :style="{ backgroundColor: 'var(--bg-color-hover)' }"
            >
              <span class="el-dropdown-link cursor-pointer flex items-center">
                <span
                  class="font-medium mx-2 transition-all duration-300"
                  :style="{ color: 'var(--text-color)' }"
                  >{{ botInfo.nickname || "用户" }}</span
                >
                <i
                  class="el-icon-arrow-down transition-transform duration-300"
                  :style="{ color: 'var(--primary-color)' }"
                ></i>
              </span>
              <el-dropdown-menu
                slot="dropdown"
                class="shadow-lg rounded-xl overflow-hidden transition-all duration-300"
              >
                <el-dropdown-item
                  command="logout"
                  class="flex items-center px-4 py-2 transition-all duration-200"
                  :style="{ backgroundColor: 'var(--bg-color-hover)' }"
                >
                  <i
                    class="el-icon-switch-button mr-2"
                    :style="{ color: 'var(--danger-color)' }"
                  ></i>
                  <span :style="{ color: 'var(--danger-color)' }"
                    >退出登录</span
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </header>

        <!-- 主内容 -->
        <main
          class="flex-1 h-full p-0"
          :style="{
            backgroundColor: 'var(--bg-color)',
            height: computedHeight + 'px',
          }"
          @click="handleMainClick"
        >
          <router-view
            class="backdrop-blur-sm rounded-xl p-6 h-full"
            :style="{
              backgroundColor: 'var(--bg-color-secondary)',
              height: computedHeight + 'px',
            }"
            :key="rvKey"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "@/utils/event-bus"
import { getHeaderHeight } from "@/utils/utils"
export default {
  name: "MainHome",
  data() {
    return {
      asideShow: false, // 默认隐藏菜单栏，移动端会覆盖这个值
      isCollapsed: false,
      isMobile: false,
      rvKey: 0,
      menus: [],
      botList: [],
      botInfo: {},
      curSelectMenu: null,
      firstLoad: true,
      windowHeight: window.innerHeight,
      themes: [
        {
          value: "pink",
          label: "真寻可爱",
          icon: "el-icon-present",
          color: "#F59E0B",
        },
        {
          value: "dark",
          label: "暗黑模式",
          icon: "el-icon-moon",
          color: "#6B7280",
        },
        {
          value: "light",
          label: "亮色模式",
          icon: "el-icon-sunny",
          color: "#F59E0B",
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
  watch: {
    asideShow() {
      EventBus.$emit("sidebar-aside", {
        asideShow: this.asideShow,
        timestamp: Date.now(),
      })
    },
  },
  computed: {
    computedHeight() {
      return this.windowHeight - getHeaderHeight() + 7
    },
  },
  created() {
    this.getBotInfo()
  },
  mounted() {
    this.getMenus()
    this.$store.dispatch("initStatusSocket")
    window.addEventListener("resize", this.handleResize)
    this.checkScreenSize()
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
    // window.sessionStorage.removeItem("isAuthenticated")
  },
  inject: ["setAppTheme"],
  methods: {
    dropdownClick(cmd) {
      if (cmd == "logout") {
        window.sessionStorage.removeItem("isAuthenticated") // 清除登录状态
        this.$message.success("已退出登录！")
        this.$router.push("/")
      }
    },
    getMenuWidth() {
      if (this.isCollapsed) {
        return this.isMobile ? "0rem" : "5.5rem"
      }
      return "13.5rem"
    },
    getTransform() {
      if (this.isMobile) {
        return this.asideShow ? "translateX(0)" : "translateX(-100%)"
      }
      return this.asideShow ? "translateX(0)" : "translateX(-1%)"
    },
    handleResize() {
      this.windowHeight = window.innerHeight
      this.checkScreenSize()
    },
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 768

      // 如果是移动设备或从桌面切换到移动设备
      if (this.isMobile) {
        this.$nextTick(() => {})
        this.asideShow = false // 移动端默认隐藏菜单
        this.isCollapsed = false // 移动端不折叠菜单
      } else {
        // 桌面端根据折叠状态显示菜单
        this.asideShow = !this.isCollapsed
      }
    },
    handleMainClick() {
      if (this.isMobile) {
        // 如果是移动端且菜单显示，点击主内容应该关闭菜单
        if (this.asideShow) {
          this.asideShow = false
          document.body.style.overflow = ""
        }
      }
    },
    handleSelect(index) {
      if (this.isMobile) {
        this.asideShow = false
      }
      if (index.charAt(0) !== "/") {
        index = "/" + index
      }
      this.curSelectMenu = index
      this.$router.replace(index)
    },
    toggleMenu() {
      this.asideShow = !this.asideShow
      if (this.isMobile) {
        document.body.style.overflow = this.asideShow ? "hidden" : ""
      }
    },
    toggleCollapse() {
      if (!this.isMobile) {
        this.isCollapsed = !this.isCollapsed
        localStorage.setItem("menuCollapsed", this.isCollapsed)

        // 确保主内容宽度正确更新
        this.$nextTick(() => {
          this.asideShow = !this.isCollapsed
        })
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
        EventBus.$emit("change-theme", {
          timestamp: Date.now(),
        })
      } else {
        console.error("setAppTheme function not provided/injected correctly.")
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
  background: var(--primary-color-light-9);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--primary-color-light-7);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color-light-5);
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
::v-deep .el-menu-item:hover {
  background-color: var(--bg-color-hover) !important;
}
::v-deep .el-menu-item.is-active {
  background-color: var(--bg-color-hover) !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-dropdown-link span {
    display: none;
  }
}

/* 折叠菜单样式 */
::v-deep .el-menu--collapse {
  width: 80px;
}
::v-deep .el-menu--collapse .el-menu-item {
  display: flex;
  justify-content: center;
  padding: 0 10px !important;
}
::v-deep .el-menu--collapse .el-menu-item .svg-icon {
  margin-right: 0;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 旋转动画 */
.rotate-180 {
  transform: rotate(180deg);
}

.aside-enter-active,
.aside-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.aside-enter,
.aside-leave-to {
  transform: translateX(-100%);
}

/* 菜单项动画 */
.menu-item-animate {
  transition: all 0.3s ease;
  transform-origin: left center;
}

/* 优化后的弹跳动画 */
@keyframes smooth-bounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-12px) scale(1.05);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.animate-smooth-bounce {
  animation: smooth-bounce 3s infinite;
}

/* 优化过渡曲线 */
.smooth-transition {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content {
  width: calc(100% - var(--sidebar-width));
  margin-left: var(--sidebar-width);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-content {
    width: 100%;
    margin-left: 0;
  }
}
</style>
