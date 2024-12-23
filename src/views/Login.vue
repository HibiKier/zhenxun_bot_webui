<template>
  <div class="border">
    <div class="left-form">
      <div class="head-border">
        <img
          class="head-pic"
          src="../assets/image/head_pic.jpg"
          alt="用户头像"
        />
      </div>
      <div class="title-border">
        <p class="title">
          欢迎来到<span class="title-text">真寻的小房间</span>
        </p>
        <p class="title-des">真尋の小部屋へようこそ、お兄さん</p>
      </div>
      <el-form
        @submit.native.prevent
        v-loading="loading"
        element-loading-text="正在登录..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :rules="rules"
        ref="loginForm"
        :model="loginForm"
        class="loginContainer"
      >
        <el-form-item prop="username" label="账号">
          <el-input
            type="text"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            class="input-border"
            @keyup.enter="submitLogin"
          >
            <i slot="prefix"> <SvgIcon icon-class="account" class="icon" /></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            class="input-border"
            @keyup.enter="submitLogin"
          >
            <i slot="prefix"> <SvgIcon icon-class="password" class="icon" /></i>
          </el-input>
          <!-- 关闭输入密码在打开时默认获取焦点 -->
        </el-form-item>
        <div style="display: flex">
          <el-button
            type="primary"
            style="width: 50%; border-radius: 12px"
            native-type="submit"
            @click="changeApi"
            plain
            >地址设置
          </el-button>
          <el-button
            type="primary"
            style="width: 50%; border-radius: 12px"
            native-type="submit"
            @click="submitLogin"
            >登录</el-button
          >
        </div>
      </el-form>
      <div class="forget-pwd">
        <div @mouseenter="forgetPwd = !forgetPwd">
          <el-button
            type="text"
            :style="{ float: forgetPwd ? 'left' : 'right' }"
            >忘记密码</el-button
          >
        </div>
      </div>
      <div style="height: 30px"></div>
    </div>
  </div>
</template>

<script>
import qs from "qs"
// 导入cookie的获取和设置方法
import { setCookie, clearCookie, getCookie, verifyIdentity } from "@/utils/api"

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  created() {
    //进入登录页面先验证是否已经登录
    verifyIdentity()
  },
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
    }
  },
  mounted() {
    this.$nextTick(() => {
      document.addEventListener("keydown", (event) => {
        if (event.code === "Enter") {
          event.preventDefault()
          this.submitLogin()
        }
      })
    })
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
                window.sessionStorage.setItem('isAuthenticated', true);
                this.$message.success(resp.info)
                const tokenStr =
                  resp.data.token_type + " " + resp.data.access_token
                if (getCookie) {
                  clearCookie("tokenStr")
                }
                setCookie("tokenStr", tokenStr)
                // // 页面跳转
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
  },
}
</script>

<style lang="scss" scoped>
.forget-pwd-right {
  float: right;
  margin-left: 10px;
}
.forget-pwd-left {
  float: left;
}
.icon {
  margin-left: 10px;
  color: #aa9ea5;
}
.el-form {
  width: 500px;
}
/deep/ .el-input--prefix .el-input__inner {
  padding-left: 40px;
  border: 1px solid #e9dfe5;
  border-radius: 12px;
}
.input-border {
  height: 46px;
}

.border {
  background: url("../assets/image/login_bk_left_3.png");
  width: 100%;
  height: 100vh;
  background-size: cover; /* 保持纵横比并填充整个容器 */
  background-position: right; /* 图片在容器中居中显示 */
  background-repeat: no-repeat; /* 不重复显示背景图片 */
  padding: 50px 30px;
  box-sizing: border-box;
}
.bk-img-border {
  height: 100%;
  width: 100%;
  z-index: -1;
}

.bk-img {
  width: 100%;
}
.head-border {
  width: 80px;
  height: 80px;
  border: #909090 1px solid;
  background: #fff;
  color: #333;
  -moz-box-shadow: 2px 2px 10px #909090;
  -webkit-box-shadow: 2px 2px 10px #909090;
  box-shadow: 2px 2px 10px #909090;
  border-radius: 50%;
  text-align: center;
  margin-bottom: 40px;
}
.head-pic {
  border-radius: 50%;
  background-color: #9facb7;
  width: 70px;
  height: 70px;
  margin-top: 5px;
}

.title-border {
  margin-bottom: 10px;
}

.title {
  font-size: 23px;
  color: black;
}

.title-text {
  font-weight: bold;
  margin-left: 10px;
}

.title-des {
  color: #9facb7;
  font-size: 13px;
  margin-top: 10px;
}

.left-form {
  background-color: rgba(255, 255, 255, 0.6);
  height: 100%;
  width: 600px;
  padding: 50px;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  border-right: 1px solid #f4c9e7;
  border-radius: 20px;
}

/deep/ .el-form-item__label {
  font-weight: bold;
}

/deep/ .el-input__inner {
  background-color: #fffcc8;
}
</style>
