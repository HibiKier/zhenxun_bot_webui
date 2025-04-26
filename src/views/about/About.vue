<template>
  <div class="about-page">
    <div class="login-border">
      <div class="logo-box">
        <img src="@/assets/image/head_pic.jpg" alt="Logo" class="logo" />
      </div>
    </div>
    <div class="content-border">
      <h1>关于我们</h1>
      <div class="content">
        <section>
          <h2>项目介绍</h2>
          <p>
            本项目是一个对于
            <a href="https://github.com/HibiKier/zhenxun_bot">小真寻</a>
            的API前端实现，通过WebUi实现对小真寻的可视化操作。
          </p>
        </section>

        <section>
          <h2>联系我们</h2>
          <p>如果您有任何问题或建议，欢迎加入我们的 QQ 群</p>
          <p>
            <strong
              ><a href="https://qm.qq.com/q/mRNtLSl6uc">是真寻酱哒</a>：</strong
            >
            萌新友好焦流
          </p>
          <p>
            <strong
              ><a href="https://qm.qq.com/q/YYYt5rkMYc">真寻的技术群</a
              >：</strong
            >
            部署问题，技术问题或功能建议
          </p>
        </section>

        <section>
          <h2>开源协议</h2>
          <p>
            本项目使用
            <a href="https://github.com/HibiKier/zhenxun_bot/blob/main/LICENSE"
              >AGPL-3.0 License</a
            >
            作为开源协议。
          </p>
        </section>
      </div>
      <img src="@/assets/image/cute0.png" alt="Logo" class="cute" />
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
}
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  text-align: left;
  color: var(--text-color);
}

.login-border {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.logo-box {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-color-secondary);
  height: 145px;
  width: 145px;
  border-radius: 50%;
  box-shadow: var(--el-box-shadow-lighter);
}

.logo {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  border: 2px solid var(--border-color-light);
}

.content-border {
  padding: 40px;
  box-sizing: border-box;
  background-color: var(--bg-color-secondary);
  margin-top: 30px;
  border-radius: 10px;
  position: relative;
  border: 1px solid var(--border-color-light);
  box-shadow: var(--el-box-shadow-light);
}

.cute {
  position: absolute;
  height: 180px;
  width: 180px;
  right: 20px;
  bottom: 20px;
  opacity: 0.8;
  pointer-events: none;
}

h1 {
  font-size: 2rem;
  margin-bottom: 25px;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}

h2 {
  font-size: 1.5rem;
  margin-top: 25px;
  margin-bottom: 15px;
  color: var(--text-color);
}

p {
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 15px;
  color: var(--text-color-secondary);
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
