<template>
  <div v-if="true" class="modal">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <p>{{ tip }}</p>
      <el-button @click="confirm">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: "确认框" },
    tip: { type: String, default: "你确定要执行此操作吗？" },
  },
  methods: {
    confirm() {
      // 处理确认逻辑
      this.$emit("confirm")
    },
    cancel() {
      // 处理取消逻辑
      this.$emit("cancel")
    },
  },
}
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
}
</style>
