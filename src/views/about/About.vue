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
  name: 'AboutPage',
  mounted() {
    // 平滑滚动到锚点
    if (this.$route.hash) {
      const element = document.getElementById(this.$route.hash.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  },
}
</script>

<style scoped>
/* 基础布局 */
.about-container {
  /* min-height: 100vh; */
  background: linear-gradient(to bottom, #fce4ec, #f3e5f5);
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}

.content-wrapper {
  max-width: 800px;
  height: calc(100vh - 10rem);
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

/* 背景装饰元素 */
.bg-decorator {
  position: fixed;
  border-radius: 50%;
  opacity: 0.2;
  z-index: 1;
}

.decorator-1 {
  width: 4rem;
  height: 4rem;
  background-color: #f8bbd0;
  top: 2.5rem;
  left: 2.5rem;
  animation: float 6s ease-in-out infinite;
}

.decorator-2 {
  width: 6rem;
  height: 6rem;
  background-color: #e1bee7;
  bottom: 5rem;
  right: 5rem;
  animation: float 6s ease-in-out 1.5s infinite;
}

/* 可滚动内容区域 */
.scrollable-content {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #f8bbd0;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
}

/* 隐藏滚动条 */
.scrollable-content::-webkit-scrollbar {
  display: none;
}

.scrollable-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 顶部装饰 */
.content-header-bar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.5rem;
  background: linear-gradient(to right, #ec407a, #ab47bc, #7e57c2);
  z-index: 20;
}

.content-heart-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #ec407a;
  font-size: 1.5rem;
  z-index: 10;
}

/* Logo样式 */
.logo-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0 1rem;
}

.main-logo {
  height: 145px;
  width: 340px;
}

/* 内容区域样式 */
.content-area {
  padding: 1.5rem 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #374151;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #fce4ec;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0.5rem;
  background-color: white;
  z-index: 10;
}

/* 内容区块样式 */
.content-section {
  margin-bottom: 2rem;
  scroll-margin-top: 4rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.section-icon {
  color: #ab47bc;
  margin-left: 0.5rem;
}

.section-content {
  padding-left: 1.5rem;
  border-left: 4px solid #fce4ec;
}

/* 文本样式 */
p {
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.contact-description {
  margin-bottom: 1rem;
}

/* 链接样式 */
.text-link {
  font-weight: 500;
  text-decoration: none;
  position: relative;
}

.pink-link {
  color: #ec407a;
}

.pink-link:hover {
  text-decoration: underline;
  text-decoration-style: wavy;
  text-decoration-color: #f8bbd0;
}

.green-link {
  color: #66bb6a;
}

.green-link:hover {
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: #a5d6a7;
}

/* 联系卡片样式 */
.contact-card {
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.contact-card:hover {
  transform: scale(1.02);
}

.pink-card {
  background-color: #fce4ec;
  border-left: 4px solid #ec407a;
}

.purple-card {
  background-color: #f3e5f5;
  border-left: 4px solid #ab47bc;
}

.card-link {
  font-weight: 500;
  display: flex;
  align-items: center;
}

.pink-card .card-link {
  color: #ec407a;
}

.pink-card .card-link:hover {
  color: #d81b60;
}

.purple-card .card-link {
  color: #8e24aa;
}

.purple-card .card-link:hover {
  color: #6a1b9a;
}

.recommend-tag {
  font-size: 0.75rem;
  background-color: #ec407a;
  color: white;
  padding: 0.125rem 0.5rem;
  margin-left: 0.5rem;
  border-radius: 0.125rem;
}

.card-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* 底部装饰 */
.bottom-decoration {
  position: sticky;
  bottom: 0;
  right: 0;
  width: 6rem;
  opacity: 0.9;
  margin-left: auto;
  transition: opacity 0.3s ease;
}

.bottom-decoration:hover {
  opacity: 1;
}

.bottom-decoration img {
  width: 100%;
}

/* 页脚 */
.page-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

/* 悬停效果 */
.section-title:hover {
  transform: translateX(5px);
  transition: transform 0.3s ease;
}

.content-section:hover {
  background-color: rgba(248, 187, 208, 0.05);
  transition: background-color 0.3s ease;
  border-radius: 0.5rem;
}

/* 动画 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
