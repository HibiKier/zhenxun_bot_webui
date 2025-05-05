<template>
  <div class="h-full w-full bg-gradient-to-br from-pink-50 to-purple-50 p-4">
    <SystemBasicInfo class="h-full" />
  </div>
</template>

<script>
import SystemBasicInfo from "@/components/system/SystemBasicInfo"

export default {
  name: "SystemInfo",
  components: {
    SystemBasicInfo,
  },
}
</script>

<style>
/* 可以添加少量自定义样式增强二次元效果 */
.cute-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.cute-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-pink-300 rounded-full;
}

.cute-scrollbar::-webkit-scrollbar-track {
  @apply bg-pink-100 rounded-full;
}

/* 动画效果 */
.anime-hover:hover {
  @apply transition-transform duration-300 -translate-y-1;
}
</style>
