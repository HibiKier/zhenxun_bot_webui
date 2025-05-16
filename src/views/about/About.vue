<template>
  <div class="about-container">
    <!-- 背景装饰元素 -->
    <div class="bg-decorator decorator-1"></div>
    <div class="bg-decorator decorator-2"></div>

    <div class="content-wrapper">
      <!-- 可滚动的主要内容区域 -->
      <div class="scrollable-content">
        <!-- 顶部装饰条 -->
        <div class="content-header-bar"></div>

        <!-- 顶部logo - 方形设计 -->
        <div class="logo-container">
          <img src="@/assets/image/logo.png" alt="Logo" class="main-logo" />
        </div>

        <!-- 内容区域 -->
        <div class="content-area">
          <h1 class="page-title">
            <span>关于我们</span>
          </h1>

          <!-- 项目介绍 -->
          <section class="content-section" id="project">
            <h2 class="section-title">
              <span>项目介绍</span>
              <span class="section-icon">☆</span>
            </h2>
            <div class="section-content">
              <p>
                本项目是一个对于
                <a
                  href="https://github.com/HibiKier/zhenxun_bot"
                  class="text-link pink-link"
                >
                  小真寻
                </a>
                的API前端实现，通过WebUi实现对小真寻的可视化操作。
              </p>
            </div>
          </section>

          <!-- 联系我们 -->
          <section class="content-section" id="contact">
            <h2 class="section-title">
              <span>联系我们</span>
              <span class="section-icon">✉</span>
            </h2>
            <div class="section-content">
              <p class="contact-description">
                如果您有任何问题或建议，欢迎加入我们的 QQ 群
              </p>
              <div class="contact-card pink-card">
                <a href="https://qm.qq.com/q/mRNtLSl6uc" class="card-link">
                  <span>是真寻酱哒</span>
                </a>
                <p class="card-description">萌新友好交流群</p>
              </div>
              <div class="contact-card purple-card">
                <a href="https://qm.qq.com/q/YYYt5rkMYc" class="card-link">
                  真寻的技术群
                </a>
                <p class="card-description">部署问题，技术问题或功能建议</p>
              </div>
            </div>
          </section>

          <!-- 开源协议 -->
          <section class="content-section" id="license">
            <h2 class="section-title">
              <span>开源协议</span>
              <span class="section-icon">⚖</span>
            </h2>
            <div class="section-content">
              <p>
                本项目使用
                <a
                  href="https://github.com/HibiKier/zhenxun_bot/blob/main/LICENSE"
                  class="text-link green-link"
                >
                  AGPL-3.0 License
                </a>
                作为开源协议。
              </p>
            </div>
          </section>
        </div>

        <!-- 底部装饰图片 -->
        <div class="bottom-decoration">
          <img src="@/assets/image/cute0.png" alt="Cute character" />
        </div>
      </div>

      <!-- 页脚 -->
      <div class="page-footer">
        <p>Made with ♥ by 真寻酱的粉丝们</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  mounted() {
    // 平滑滚动到锚点
    if (this.$route.hash) {
      const element = document.getElementById(this.$route.hash.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  },
}
</script>

<style scoped>
/* 基础布局 */
.about-container {
  background: var(--bg-color);
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}

.content-wrapper {
  max-width: 900px;
  height: calc(100vh - 10rem);
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

/* 背景装饰元素 */
.bg-decorator {
  position: fixed;
  border-radius: 50%;
  opacity: 0.15;
  z-index: 1;
  filter: blur(20px);
}

.decorator-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    var(--primary-color-light) 0%,
    transparent 70%
  );
  top: -100px;
  left: -100px;
  animation: float 8s ease-in-out infinite;
}

.decorator-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
  bottom: -150px;
  right: -150px;
  animation: float 8s ease-in-out 2s infinite;
}

/* 可滚动内容区域 */
.scrollable-content {
  background-color: var(--bg-color-secondary);
  border-radius: 1.5rem;
  box-shadow: var(--el-box-shadow-light);
  border: 1px solid var(--border-color);
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
}

/* 顶部装饰 */
.content-header-bar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    to right,
    var(--primary-color) 0%,
    var(--primary-color-light) 50%,
    var(--primary-color) 100%
  );
  z-index: 20;
  border-radius: 2px;
}

/* Logo样式 */
.logo-container {
  display: flex;
  justify-content: center;
  padding: 2.5rem 0 2rem;
  position: relative;
}

.logo-container::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--border-color),
    transparent
  );
}

.main-logo {
  height: 145px;
  width: 340px;
  transition: transform 0.3s ease;
}

.main-logo:hover {
  transform: scale(1.02);
}

/* 内容区域样式 */
.content-area {
  padding: 2rem 3rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0.2rem;
  background-color: var(--bg-color-secondary);
  z-index: 10;
  text-align: center;
  justify-content: center;
}

/* 内容区块样式 */
.content-section {
  margin-bottom: 3rem;
  scroll-margin-top: 4rem;
  padding: 1.5rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  color: var(--primary-color);
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.section-content {
  padding-left: 2rem;
  border-left: 3px solid var(--primary-color-light);
  position: relative;
}

/* 文本样式 */
p {
  color: var(--text-color);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
}

.contact-description {
  margin-bottom: 1rem;
}

/* 链接样式 */
.text-link {
  font-weight: 500;
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}

.text-link:hover {
  background: var(--bg-color-hover);
}

.pink-link {
  color: var(--primary-color);
}

.green-link {
  color: var(--success-color);
}

/* 联系卡片样式 */
.contact-card {
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.contact-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.contact-card:hover::before {
  transform: translateX(100%);
}

.contact-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--el-box-shadow-light);
}

.pink-card {
  background: linear-gradient(
    135deg,
    var(--bg-color-hover),
    var(--bg-color-secondary)
  );
  border: 1px solid var(--primary-color-light);
}

.purple-card {
  background: linear-gradient(
    135deg,
    var(--bg-color-hover),
    var(--bg-color-secondary)
  );
  border: 1px solid var(--primary-color);
}

.card-link {
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.card-description {
  font-size: 0.95rem;
  color: var(--text-color-secondary);
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  border-left: 2px solid var(--border-color);
}

/* 底部装饰 */
.bottom-decoration {
  position: sticky;
  bottom: 0;
  right: 0;
  width: 8rem;
  opacity: 0.8;
  margin-left: auto;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.1));
}

.bottom-decoration:hover {
  opacity: 1;
  transform: translateY(-5px);
}

.bottom-decoration img {
  width: 100%;
}

/* 页脚 */
.page-footer {
  margin-top: 2rem;
  text-align: center;
  color: var(--text-color-secondary);
  font-size: 0.95rem;
  padding: 1rem;
  position: relative;
}

.page-footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--border-color),
    transparent
  );
}

/* 动画 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .content-area {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .contact-card {
    padding: 1.25rem;
  }

  .bottom-decoration {
    width: 6rem;
  }
}
</style>
