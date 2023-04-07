<template>
  <div>
    <el-container>
      <el-aside class="left-aside" :class="{ show: asideshow }">
        <div class="myscrollbar">
          <el-menu class="border-right-none" @select="handleSelect">
            <el-menu-item index="/command">
              <!-- <i class="el-icon-menu"></i> -->
              <svg-icon icon-class="command" />
              <span slot="title">控制台</span>
            </el-menu-item>
            <el-menu-item index="/plugin">
              <i class="el-icon-menu"></i>
              <span slot="title">插件列表</span>
            </el-menu-item>
            <el-menu-item index="/group">
              <i class="el-icon-menu"></i>
              <span slot="title">群组管理</span>
            </el-menu-item>
            <el-menu-item index="/request">
              <i class="el-icon-menu"></i>
              <span slot="title">请求管理</span>
            </el-menu-item>
            <el-menu-item index="/system">
              <i class="el-icon-menu"></i>
              <span slot="title">系统信息</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-container class="layoutbox">
        <el-header class="homeHeader">
          <div class="title">小真寻的后台捏</div>
          <router-link class="to-myapi" :to="{ name: 'MyApi' }"
            >修改api地址</router-link
          >
          <div class="menu-btn" @click="showmenu">
            <div class="btn-logo" :class="{ show: asideshow }"></div>
            <div class="cover" :class="{ covershow: covershow }"></div>
          </div>
        </el-header>
        <el-main><router-view class="homeRouterView" /></el-main>
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
      asideshow: false,
      covershow: false,
    }
  },
  methods: {
    handleSelect(index) {
      this.asideshow = false
      this.covershow = false
      this.$router.replace(index)
    },
    showmenu() {
      this.asideshow = !this.asideshow
      this.covershow = !this.covershow
    },
  },
}
</script>

<style lang="scss" scoped>
.el-menu-item {
  span {
    margin-left: 10px;
    font-size: larger;
    font-weight: bold;
  }
}

.homeHeader {
  position: relative;
  background-color: #409eff;
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
  background: #fff;
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
  background: #fff;
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
  color: #ffffff;
}

.left-aside {
  background-color: #ffffff;
  width: 14rem !important;
  transition: all 0.2s ease;
}

.myscrollbar {
  /* height: 100%; */
  margin-top: 59px;
  text-align: center;
}
.layoutbox {
  height: calc(100vh - 60px);
  background-color: #f0f2f5;
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
.border-right-none {
  border-right: none !important;
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
    width: 8rem !important;
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
  .covershow {
    width: 100%;
  }
  .to-myapi {
    position: absolute;
    right: 5rem;
  }
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
    width: 8rem !important;
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
  .covershow {
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
