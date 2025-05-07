<template>
  <el-dialog width="500" :visible="true" @close="close">
    <div class="file-name">
      {{ name }}
    </div>
    <div class="file-path">
      {{ fullPath }}
    </div>
    <div class="center">
      <el-image v-if="imageData" :src="imageData" fit="fill"></el-image>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditFile',
  props: {
    name: {
      type: String,
      require: true,
    },
    fullPath: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      imageData: null,
    }
  },
  mounted() {
    this.getImage()
  },
  methods: {
    getImage() {
      const loading = this.getLoading('.el-dialog')
      this.getRequest(`${this.$root.prefix}/system/get_image`, {
        full_path: this.fullPath,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            resp.data = resp.data.replace('base64://', '')
            this.imageData = 'data:image/png;base64,' + resp.data
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .el-dialog {
  border-radius: 10px;
}

.file-name {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.file-path {
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: #939395;
  margin-bottom: 20px;
}
</style>
