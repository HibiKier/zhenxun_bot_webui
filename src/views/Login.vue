<template>
  <div class="border">
    <!-- <el-header class="homeHeader">
      <div class="title">小真寻的后台捏</div>
      <router-link class="to-myapi" :to="{ name: 'MyApi' }"
        >修改api地址</router-link
      >
    </el-header> -->
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
          >
            <i slot="prefix"> <SvgIcon icon-class="account" /></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
          >
            <i slot="prefix"> <SvgIcon icon-class="password" /></i>
          </el-input>
          <!-- 关闭输入密码在打开时默认获取焦点 -->
        </el-form-item>
        <div style="display: flex">
          <el-button
            type="primary"
            style="width: 50%"
            native-type="submit"
            @click="submitLogin"
            >登录</el-button
          >
          <el-button
            type="primary"
            style="width: 50%"
            native-type="submit"
            @click="submitLogin"
            >更换API</el-button
          >
        </div>
      </el-form>
      <div style="float: right">
        <el-button type="text">忘记密码</el-button>
      </div>
    </div>
    <!-- <div class="bk-img-border">
      <img class="bk-img" src="../assets/image/login_bk2.jpg" />
    </div> -->
  </div>
</template>

<script>
import qs from "qs";
// 导入cookie的获取和设置方法
import { setCookie, clearCookie, getCookie, verifyIdentity } from "@/utils/api";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  created() {
    //进入登录页面先验证是否已经登录
    verifyIdentity();
  },
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        // username: [
        //   { required: true, message: "请输入用户名", trigger: "blur" },
        // ],
        // password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      loading: false,
    };
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest(
            "/webui/login",
            qs.stringify({
              username: this.loginForm.username,
              password: this.loginForm.password,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          ).then((resp) => {
            if (resp) {
              // this.loading = false;
              const tokenStr = resp.token_type + " " + resp.access_token;
              if (getCookie) {
                clearCookie("tokenStr");
              }
              setCookie("tokenStr", tokenStr);
              // // 页面跳转
              let path = this.$route.query.redirect;
              this.$router.replace(
                path == "/" || path == undefined ? "/home" : path
              );
            }
          });
        } else {
          return false;
        }
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.border {
  background: url("../assets/image/login_bk2.jpg");
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.bk-img-border {
  height: 100%;
  width: 100%;
  // overflow: hidden;
  // position: absolute;
  z-index: -1;
}

.bk-img {
  width: 100%;
  // object-fit: cover;
  // position: absolute;
  // z-index: -1;
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
  background-color: rgba(255, 255, 255, 0.8);
  height: 100%;
  width: 30%;
  border-top: 1px solid black;
  padding: 100px;
}

/deep/ .el-form-item__label {
  font-weight: bold;
}

/deep/ .el-input__inner {
  background-color: #fefbc8;
}

/* .homeHeader {
  background-color: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
} */
/* .loginContainer {
  position: relative;
  top: calc(50% - 200px);
  border-radius: 15px;
  background-clip: padding-box;
  margin: 0 auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #caca6c;
} */
/* .loginTitle {
  margin: 10px auto 40px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
} */

/* .el-form-item__content {
  display: flex;
  align-items: center;
}
.to-myapi {
  width: 10rem;
  height: 30px;
  line-height: 30px;
  font-size: 1.2rem;
  color: #fff;
  text-decoration: none;
  border-radius: 100px;
  border: 5px solid #fff;
}
@media screen and (max-width: 600px) {
  .title {
    font-size: 1.6rem !important;
  }
  .loginContainer {
    width: calc(100vw - 10rem);
    top: calc(30%);
  }
  .to-myapi {
    width: 8rem !important;
    font-size: 1rem !important;
    border: 3px solid #fff !important;
  }
} */
</style>