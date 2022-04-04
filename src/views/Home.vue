<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">小真寻的后台捏</div>
      </el-header>
      <el-container class="layoutbox">
        <el-aside width="220px" class="left-aside">
          <el-scrollbar class="myscrollbar">
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
            </el-menu>
          </el-scrollbar>
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
  data() {},
  methods: {
    handleSelect(index) {
      this.$router.replace(index);
    },
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

.homeHeader .title {
  font-size: 30px;
  font-family: 宋体;
  color: #ffffff;
}

.left-aside {
  background-color: #ffffff;
  overflow-y: hidden;
}

.myscrollbar {
  height: 100%;
}
.myscrollbar >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
.layoutbox {
  height: 100vh;
  background-color: #f0f2f5;
}
</style>