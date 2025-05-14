<template>
  <div class="plugin-list-container">
    <!-- 添加可爱的顶部装饰 -->
    <div
      class="decoration-top absolute top-0 left-0 right-0 h-6 flex justify-center"
    >
      <div class="w-full max-w-4xl flex justify-between px-4">
        <span
          :style="{ color: 'var(--el-color-primary-light-5)' }"
          class="text-xl"
          >✧･ﾟ: *✧･ﾟ:*</span
        >
        <span
          :style="{ color: 'var(--el-color-primary-light-5)' }"
          class="text-xl"
          >*:･ﾟ✧*:･ﾟ✧</span
        >
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content p-4 md:p-6">
      <StoreTemplate />
    </div>

    <!-- 添加可爱的底部装饰 -->
    <div
      class="decoration-bottom absolute bottom-0 left-0 right-0 h-6 flex justify-center"
    >
      <div class="w-full max-w-4xl flex justify-between px-4">
        <span
          :style="{ color: 'var(--el-color-primary-light-5)' }"
          class="text-xl"
          >⋆.˚✮⋆.˚</span
        >
        <span
          :style="{ color: 'var(--el-color-primary-light-5)' }"
          class="text-xl"
          >˚.⋆✮˚.⋆</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import StoreTemplate from "@/components/store/StoreTemplate.vue"

export default {
  name: "PluginList",
  components: {
    StoreTemplate,
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.plugin-list-container {
  @apply relative w-full;
  background: linear-gradient(
    135deg,
    var(--el-bg-color) 0%,
    var(--el-fill-color-light) 50%,
    var(--el-fill-color) 100%
  );

  // 添加可爱的背景图案
  &::before {
    content: "";
    @apply absolute inset-0 opacity-10 pointer-events-none;
    background-image: radial-gradient(
        var(--el-color-primary-light-5) 1px,
        transparent 1px
      ),
      radial-gradient(var(--el-color-primary-light-5) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: 0 0, 20px 20px;
  }

  .main-content {
    @apply relative z-10;

    // 添加可爱的边框效果
    &::after {
      content: "";
      @apply absolute inset-0 pointer-events-none;
      border: 2px dashed var(--el-border-color);
      border-radius: 16px;
    }
  }

  // 响应式调整
  @media (max-width: 768px) {
    .main-content {
      @apply p-2;

      &::after {
        border-radius: 12px;
      }
    }
  }
}
</style>
