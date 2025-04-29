<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 relative overflow-hidden"
  >
    <!-- 樱花动画背景元素 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-for="i in 15"
        :key="i"
        class="absolute sakura"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${10 + Math.random() * 20}s`,
          transform: `scale(${0.5 + Math.random()})`,
        }"
      >
        <svg viewBox="0 0 100 100" class="w-8 h-8 text-pink-300 opacity-70">
          <path
            fill="currentColor"
            d="M50 0C40 20 20 30 0 50c20 20 40 30 50 50 10-20 30-30 50-50C70 30 60 20 50 0z"
          />
        </svg>
      </div>
    </div>

    <!-- 主登录框 -->
    <div
      class="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl"
    >
      <!-- 装饰性顶部渐变条 -->
      <div
        class="h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"
      ></div>

      <div class="p-8 sm:p-10">
        <!-- Logo 头像 -->
        <div class="flex justify-center mb-8">
          <img
            src="@/assets/image/logo.png"
            alt="Logo"
            class="w-100 h-50 object-contain transition-all duration-300 hover:scale-110 hover:rotate-6"
          />
        </div>

        <!-- 表单部分 -->
        <el-form
          @submit.native.prevent
          v-loading="loading"
          element-loading-text="正在登录..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :rules="rules"
          ref="loginForm"
          :model="loginForm"
        >
          <!-- 用户名输入 -->
          <el-form-item prop="username" label="账号" class="mb-6">
            <InteractiveInput
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefixIcon="account"
              class="w-full"
            ></InteractiveInput>
          </el-form-item>

          <!-- 密码输入 -->
          <el-form-item prop="password" label="密码" class="mb-8">
            <InteractiveInput
              v-model="loginForm.password"
              placeholder="请输入密码"
              prefixIcon="password"
              type="password"
              class="w-full"
            ></InteractiveInput>
          </el-form-item>

          <!-- 按钮组 -->
          <div class="flex justify-between space-x-4">
            <el-button
              type="default"
              @click="changeApi"
              plain
              class="flex-1 border-purple-400 text-purple-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-500 transition-colors duration-300"
            >
              地址设置
            </el-button>
            <el-button
              type="primary"
              native-type="submit"
              @click="submitLogin"
              class="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              登录
            </el-button>
          </div>
        </el-form>

        <!-- 忘记密码 -->
        <div
          id="forgetPwd"
          class="mt-6 text-center relative"
          style="height: 40px"
          @mouseenter="startButtonDance"
        >
          <el-button
            type="text"
            class="absolute transition-all duration-500 ease-out"
            :class="{ 'cursor-not-allowed': isButtonMoving }"
            :style="buttonPosition"
            @click="handleForgetPassword"
          >
            忘记密码
            <p>
              <span v-if="showTaunt" class="ml-2 text-xs text-pink-400">{{
                currentTaunt
              }}</span>
            </p>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 对话框 -->
    <CuteDialog
      :visible.sync="dialogVisible"
      title="温馨提示"
      :message="dialogMessage"
    />
  </div>
</template>

<script>
import qs from "qs"
import { setCookie, clearCookie, getCookie } from "@/utils/api"
import CuteDialog from "@/components/ui/CuteDialog"
import InteractiveInput from "@/components/ui/InteractiveInput.vue"

export default {
  name: "MainLogin",
  components: { CuteDialog, InteractiveInput },
  data() {
    const validateName = (rules, value, callback) => {
      if (!value) {
        callback(new Error("账号捏账号捏!"))
      } else {
        callback()
      }
    }
    const validatePwd = (rules, value, callback) => {
      if (!value) {
        callback(new Error("不会有人忘记密码了吧!"))
      } else {
        callback()
      }
    }
    return {
      forgetPwd: false,
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ validator: validateName }],
        password: [{ validator: validatePwd }],
      },
      loading: false,
      dialogVisible: false,
      dialogMessage: "请等待小真寻重启成功后登录！",

      // 忘记密码按钮相关状态
      isButtonMoving: false,
      showTaunt: false,
      currentTaunt: "",
      buttonPosition: {
        left: "50%",
        top: "0",
        transform: "translateX(-50%)",
      },
      taunts: [
        "哈哈，抓不到我吧！",
        "别试了，你点不到的~",
        "这么容易忘记密码？",
        "管理员联系方式？想得美！",
        "再试一次？再试也点不到！",
        "你的鼠标速度太慢啦！",
        "这就是你忘记密码的惩罚！",
        "点不到点不到~",
        "密码都记不住，还想点我？",
        "放弃吧，你抓不到我的！",
      ],
    }
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.postRequest(
            `${this.$root.prefix}/login`,
            qs.stringify({
              username: this.loginForm.username,
              password: this.loginForm.password,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          ).then((resp) => {
            if (resp.suc) {
              if (resp.warning) {
                this.$message.warning(resp.warning)
              } else {
                window.sessionStorage.setItem("isAuthenticated", true)
                this.$message.success(resp.info)
                const tokenStr =
                  resp.data.token_type + " " + resp.data.access_token
                if (getCookie) {
                  clearCookie("tokenStr")
                }
                setCookie("tokenStr", tokenStr)
                let path = this.$route.query.redirect
                this.$router.replace(
                  path == "/" || path == undefined ? "/home" : path
                )
              }
            } else {
              this.$message.error(resp.info)
            }
          })
        } else {
          return false
        }
        this.loading = false
      })
    },
    changeApi() {
      this.$router.replace("/myapi")
    },

    // 忘记密码按钮相关方法
    startButtonDance() {
      if (this.isButtonMoving) return

      this.isButtonMoving = true
      this.showTaunt = true
      this.currentTaunt =
        this.taunts[Math.floor(Math.random() * this.taunts.length)]

      // 随机移动按钮
      const danceInterval = setInterval(() => {
        const container = document.querySelector("#forgetPwd")
        if (!container) {
          clearInterval(danceInterval)
          return
        }

        const containerRect = container.getBoundingClientRect()

        const maxLeft = containerRect.width - 100 // 减去按钮宽度
        const maxTop = containerRect.height - 40 // 减去按钮高度

        const newLeft = Math.random() * maxLeft
        const newTop = Math.random() * maxTop

        this.buttonPosition = {
          left: `${newLeft}px`,
          top: `${newTop}px`,
          transform: "none",
        }
      }, 800)
      var textReplaceInterval = null

      // 60秒后停止移动
      setTimeout(() => {
        clearInterval(danceInterval)
        this.isButtonMoving = false
        this.buttonPosition = {
          left: "50%",
          top: "0",
          transform: "translateX(-50%)",
        }

        // 60秒后隐藏嘲讽文字
        setTimeout(() => {
          this.showTaunt = false
        }, 60000)
      }, 60000)
    },

    handleForgetPassword() {
      if (!this.isButtonMoving) {
        this.$message.warning("忘记密码请查看配置文件！")
      }
    },
  },
  mounted() {
    const firstSetting = this.$route.params.firstSetting
    if (firstSetting) {
      this.dialogVisible = true
    }
    this.$nextTick(() => {
      document.addEventListener("keydown", (event) => {
        if (event.code === "Enter") {
          event.preventDefault()
          this.submitLogin()
        }
      })
    })
  },
}
</script>

<style>
/* 樱花飘落动画 */
.sakura {
  position: absolute;
  animation: sakura-fall linear infinite;
  z-index: 0;
}

@keyframes sakura-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* 覆盖 Element UI 样式 */
.el-form-item__label {
  @apply text-gray-600 font-medium;
}

.el-input__inner {
  @apply border-gray-200 hover:border-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-lg transition-all duration-300;
}

.el-button--primary {
  @apply shadow-md;
}

.el-button--default {
  @apply transition-all duration-300;
}

.el-loading-mask {
  @apply bg-opacity-80;
}
</style>
