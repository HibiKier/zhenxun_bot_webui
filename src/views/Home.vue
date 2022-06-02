<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">小真寻的后台捏</div>
        <div class="menu-btn" @click="showmenu"><div class="btn-logo" :class="{show:asideshow}"></div><div class="cover" :class="{covershow:covershow}"></div></div>
      </el-header>
      <el-container class="layoutbox">
        <el-aside class="left-aside" :class="{show:asideshow}">
          <div class="myscrollbar">
            <el-menu @select="handleSelect">
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
      asideshow:false,
      covershow:false,
    };
  },
  methods: {
    handleSelect(index) {
      this.asideshow = false;
      this.covershow = false;
      this.$router.replace(index);
    },
    showmenu(){
      this.asideshow = !this.asideshow;
      this.covershow = !this.covershow;
    }
  },
};
</script>

<style>
.homeHeader {
  background-color: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
}

.menu-btn{
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 0rem;
  height: 2rem;
  padding-bottom: 0.6rem;
  margin-right: 1rem;
}
.btn-logo{
  position: relative;
  width: 100%;
  height: 0.2rem;
  background: #fff;
  /* box-shadow: 0 0.6rem 0 0 #fff,
              0 -0.6rem 0 0 #fff; */
}
.btn-logo::before,.btn-logo::after{
  content: "";
  position: absolute;
  left: 0;
  top: -0.6rem;
  width: 100%;
  height: 0.2rem;
  background: #fff;
  transition: all .2s ease;
  transform-origin: center;
}
.btn-logo::after{
  top: -1.2rem;
}
.show.btn-logo::before{
  top: -0.9rem;
  transform: rotate(-45deg);
}
.show.btn-logo::after{
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
  width: 8rem !important;
  transition: all .2s ease;
}

.myscrollbar {
  height: 100%;
}
.layoutbox {
  height: calc(100vh - 60px);
  background-color: #f0f2f5;
}

@media screen  and (max-width:600px) {
  .menu-btn{width: 2rem;}
  .left-aside{position: fixed;top:60px;left: 0;width: 0 !important;height: calc(100vh - 60px);z-index: 999999;}
  .show{width: 8rem !important;}
  .cover{position:fixed;top:60px;right: 0;height: calc(100vh - 60px);width:0%;background-color: #00000080;z-index: 9999;}
  .covershow{width: 100%;}
}
</style>