<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    :style="{ background: 'var(--bg-color)' }"
  >
    <!-- 樱花动画背景元素 - 优化了动画流畅度和随机性 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-for="(pos, i) in sakuraPositions"
        :key="i"
        class="absolute sakura"
        :style="{
          left: `${pos.left}%`,
          top: `${pos.top}%`,
          animationDelay: `${pos.delay}s`,
          animationDuration: `${pos.duration}s`,
          transform: `scale(${pos.scale}) rotate(${pos.rotate}deg)`,
          opacity: pos.opacity,
        }"
      >
        <svg
          viewBox="0 0 100 100"
          class="w-8 h-8"
          :style="{ color: 'var(--primary-color-light)' }"
        >
          <path
            fill="currentColor"
            d="M50 0C40 20 20 30 0 50c20 20 40 30 50 50 10-20 30-30 50-50C70 30 60 20 50 0z"
          />
        </svg>
      </div>
    </div>

    <!-- 主登录框 - 添加了更平滑的悬停效果 -->
    <div
      class="w-full max-w-md backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transition-all duration-500 transform hover:shadow-2xl hover:-translate-y-1"
      :style="{ backgroundColor: 'var(--bg-color-secondary)' }"
    >
      <!-- 装饰性顶部渐变条 - 添加了动画效果 -->
      <div
        class="h-2"
        :style="{
          background:
            'linear-gradient(to right, var(--primary-color), var(--primary-color-light))',
        }"
      ></div>

      <div class="p-8 sm:p-10">
        <!-- Logo 头像 - 添加了加载动画 -->
        <div class="flex justify-center mb-8">
          <img
            src="@/assets/image/logo.png"
            alt="Logo"
            class="w-100 h-50 object-contain transition-all duration-500 hover:scale-110 hover:rotate-3"
            :class="{ 'animate-pulse': loading }"
          />
        </div>

        <!-- 表单部分 - 优化了加载状态 -->
        <el-form
          @submit.native.prevent
          v-loading="loading"
          element-loading-text="正在登录..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          element-loading-custom-class="rounded-lg"
          :rules="rules"
          ref="loginForm"
          :model="loginForm"
        >
          <el-form-item prop="username" label="账号" class="mb-6">
            <InteractiveInput
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefixIcon="account"
              class="w-full"
              @focus="handleInputFocus('username')"
              @blur="handleInputBlur('username')"
            ></InteractiveInput>
          </el-form-item>

          <el-form-item prop="password" label="密码" class="mb-8">
            <InteractiveInput
              v-model="loginForm.password"
              placeholder="请输入密码"
              prefixIcon="password"
              type="password"
              class="w-full"
              @focus="handleInputFocus('password')"
              @blur="handleInputBlur('password')"
            ></InteractiveInput>
          </el-form-item>

          <!-- 按钮组 - 优化了按钮交互 -->
          <div class="flex flex-col sm:flex-row justify-between gap-4">
            <CuteButton
              type="secondary"
              icon="server"
              @click="changeApi"
              class="flex-1"
              iconColor="var(--button-icon-color-default)"
            >
              地址设置
            </CuteButton>
            <CuteButton
              type="primary"
              icon="login"
              @click="submitLogin"
              :loading="loading"
              class="flex-1"
              iconColor="var(--button-icon-color-primary)"
            >
              登录
            </CuteButton>
          </div>
        </el-form>

        <!-- 忘记密码 - 优化了交互体验 -->
        <div
          id="forgetPwd"
          class="mt-6 text-center relative"
          style="height: 40px"
          @mouseenter="startButtonDance"
        >
          <el-button
            type="text"
            class="absolute transition-all duration-300 ease-out"
            :class="{
              'cursor-not-allowed': isButtonMoving,
              'cursor-pointer': !isButtonMoving,
            }"
            :style="{
              ...buttonPosition,
              color: isButtonMoving
                ? 'var(--danger-color)'
                : 'var(--primary-color)',
            }"
            @click="handleForgetPassword"
          >
            忘记密码
            <transition name="el-zoom-in-top">
              <p
                v-if="showTaunt"
                class="ml-2 text-xs"
                :style="{
                  color: isButtonMoving
                    ? 'var(--danger-color)'
                    : 'var(--primary-color-light)',
                }"
              >
                {{ currentTaunt }}
              </p>
            </transition>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 对话框 - 添加了动画效果 -->
    <transition name="el-fade-in">
      <CuteConfirm
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        title="温馨提示"
        :message="dialogMessage"
        @confirm="dialogVisible = false"
      />
    </transition>

    <!-- 添加了键盘提示 -->
    <transition name="el-fade-in">
      <div
        v-if="showKeyboardHint"
        class="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-md text-sm flex items-center"
        :style="{
          backgroundColor: 'var(--bg-color-secondary)',
          color: 'var(--text-color)',
        }"
      >
        <kbd
          class="px-2 py-1 rounded mr-2"
          :style="{ backgroundColor: 'var(--bg-color-hover)' }"
          >Enter</kbd
        >
        <span>快速登录</span>
      </div>
    </transition>
  </div>
</template>

<script>
import qs from "qs"
import { setCookie, clearCookie, getCookie } from "@/utils/api"
import CuteConfirm from "@/components/ui/CuteConfirm"
import InteractiveInput from "@/components/ui/NeonInput.vue"
import CuteButton from "@/components/ui/CuteButton.vue"

export default {
  name: "MainLogin",
  components: { CuteConfirm, InteractiveInput, CuteButton },
  data() {
    const validateName = (rules, value, callback) => {
      if (!value) {
        callback(new Error("账号不能为空哦~"))
      } else {
        callback()
      }
    }
    const validatePwd = (rules, value, callback) => {
      if (!value) {
        callback(new Error("密码不能为空哦~"))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ validator: validateName, trigger: "blur" }],
        password: [{ validator: validatePwd, trigger: "blur" }],
      },
      loading: false,
      dialogVisible: false,
      dialogMessage: "请等待小真寻重启成功后登录！",
      showKeyboardHint: false,

      // 密码强度检测
      passwordStrength: {
        show: false,
        text: "",
        color: "",
      },

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
      danceInterval: null,

      // 櫻花
      sakuraPositions: Array(20)
        .fill()
        .map(() => ({
          left: Math.random() * 100,
          top: Math.random() * -20,
          delay: Math.random() * 5,
          duration: 15 + Math.random() * 25,
          scale: 0.3 + Math.random() * 0.7,
          rotate: Math.random() * 360,
          opacity: 0.4 + Math.random() * 0.5,
        })),
    }
  },
  methods: {
    async submitLogin() {
      try {
        const valid = await this.$refs.loginForm.validate()
        if (!valid) return

        this.loading = true
        const response = await this.postRequest(
          `${this.$root.prefix}/login`,
          qs.stringify({
            username: this.loginForm.username,
            password: this.loginForm.password,
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )

        if (response.suc) {
          if (response.warning) {
            this.$message.warning(response.warning)
          } else {
            window.sessionStorage.setItem("isAuthenticated", true)
            this.$message.success({
              message: response.info,
              duration: 1500,
              showClose: true,
            })

            const tokenStr =
              response.data.token_type + " " + response.data.access_token
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
          this.$message.error({
            message: response.info,
            duration: 2000,
            showClose: true,
          })
        }
      } catch (error) {
        console.error("登录错误:", error)
        this.$message.error("登录过程中发生错误")
      } finally {
        this.loading = false
      }
    },

    changeApi() {
      this.$router.replace("/myapi")
    },

    handleInputFocus(field) {
      // this.showKeyboardHint = true
      // 添加输入框聚焦动画
      const input = document.querySelector(`[prop="${field}"] input`)
      if (input) {
        input.parentElement.classList.add("ring-2", "ring-purple-200")
      }
    },

    handleInputBlur(field) {
      // this.showKeyboardHint = false
      // 移除输入框聚焦动画
      const input = document.querySelector(`[prop="${field}"] input`)
      if (input) {
        input.parentElement.classList.remove("ring-2", "ring-purple-200")
      }
    },

    calculatePasswordStrength(password) {
      let strength = 0
      // 长度加分
      strength += Math.min(password.length * 5, 30)
      // 多样性加分
      if (/[A-Z]/.test(password)) strength += 10
      if (/[a-z]/.test(password)) strength += 10
      if (/[0-9]/.test(password)) strength += 10
      if (/[^A-Za-z0-9]/.test(password)) strength += 20
      return Math.min(strength, 100)
    },

    // 忘记密码按钮相关方法
    startButtonDance() {
      if (this.isButtonMoving) return

      this.isButtonMoving = true
      this.showTaunt = true
      this.currentTaunt =
        this.taunts[Math.floor(Math.random() * this.taunts.length)]

      // 清除之前的定时器
      if (this.danceInterval) {
        clearInterval(this.danceInterval)
      }

      // 随机移动按钮
      this.danceInterval = setInterval(() => {
        const container = document.querySelector("#forgetPwd")
        if (!container) {
          clearInterval(this.danceInterval)
          return
        }

        const containerRect = container.getBoundingClientRect()
        const maxLeft = containerRect.width - 100
        const maxTop = containerRect.height - 40

        const newLeft = Math.random() * maxLeft
        const newTop = Math.random() * maxTop

        this.buttonPosition = {
          left: `${newLeft}px`,
          top: `${newTop}px`,
          transform: "none",
        }
      }, 800)

      // 60秒后停止移动
      setTimeout(() => {
        clearInterval(this.danceInterval)
        this.isButtonMoving = false
        this.buttonPosition = {
          left: "50%",
          top: "0",
          transform: "translateX(-50%)",
        }

        // 3秒后隐藏嘲讽文字
        setTimeout(() => {
          this.showTaunt = false
        }, 3000)
      }, 60000)
    },

    handleForgetPassword() {
      if (!this.isButtonMoving) {
        this.$message.warning({
          message: "忘记密码请联系管理员查看配置文件！",
          duration: 2000,
        })
      } else {
        this.$message.error("抓不到我吧！")
      }
    },
  },
  mounted() {
    const firstSetting = this.$route.params.firstSetting
    if (firstSetting) {
      this.dialogVisible = true
    }

    // 添加键盘事件监听
    const handleKeyDown = (event) => {
      if (event.code === "Enter") {
        event.preventDefault()
        this.submitLogin()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    // 组件销毁时移除事件监听
    this.$once("hook:beforeDestroy", () => {
      document.removeEventListener("keydown", handleKeyDown)
      if (this.danceInterval) {
        clearInterval(this.danceInterval)
      }
    })
  },
}
</script>

<style scoped>
/* 樱花飘落动画 - 优化了动画效果 */
.sakura {
  position: absolute;
  animation: sakura-fall linear infinite;
  z-index: 0;
  will-change: transform, opacity;
}

@keyframes sakura-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 0.8;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* 顶部渐变条动画 */
@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}

/* 覆盖 Element UI 样式 */
.el-form-item__label {
  color: var(--el-text-color-primary);
  font-weight: 500;
  transition: color 0.3s;
}

.el-form-item.is-error .el-form-item__label {
  color: var(--el-color-danger);
}

.el-input__inner {
  border-color: var(--el-border-color);
  transition: all 0.3s;
}

.el-input__inner:hover {
  border-color: var(--el-color-primary-light-3);
}

.el-input__inner:focus {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px var(--el-color-primary-light-9);
}

.el-button--primary {
  box-shadow: var(--el-box-shadow-light);
}

.el-button--default {
  transition: all 0.3s;
}

.el-loading-mask {
  background-color: var(--el-mask-color);
  border-radius: 0.5rem;
}

/* 键盘提示样式 */
kbd {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  border: 1px solid var(--el-border-color);
  border-bottom-width: 2px;
  border-opacity: 0.2;
}
</style>
