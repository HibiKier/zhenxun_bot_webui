<template>
  <el-dialog width="500" :visible="true" @close="close">
    <one-mark />
    <div class="file-name">
      {{ name }}
    </div>
    <div class="file-path">
      {{ fullPath }}
    </div>
    <div>
      <div class="btn-group" v-if="!onlyRead">
        <span style="display: flex">
          <my-button text="保存" style="margin-right: 10px" @click="saveFile" />
          <my-button
            text="清空"
            @click="clearFile"
            style="margin-right: 10px"
          />
          <my-button
            text="格式化JSON"
            @click="formatJson"
            v-if="fileType == 'json'"
            :width="115"
          />
        </span>
      </div>
      <code-editor
        ref="codeEditor"
        :key="codeKey"
        v-model="text"
        :language="language"
        class="code-edit"
        :onlyRead="onlyRead"
      >
      </code-editor>
    </div>
  </el-dialog>
</template>

<script>
import MyButton from "../ui/MyButton.vue"
import CodeEditor from "../ui/MyCodeEditor.vue"
import OneMark from "../ui/OneMark.vue"
export default {
  name: "EditFile",
  components: {
    CodeEditor,
    MyButton,
    OneMark,
  },
  props: {
    name: {
      type: String,
      require: true,
    },
    fullPath: {
      type: String,
      require: true,
    },
    onlyRead: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      codeKey: 0,
      text: "",
      fileType: null,
      language: "application/json",
    }
  },
  mounted() {
    const z2d = {
      py: "Python",
      js: "Javascript",
    }
    if (this.name) {
      const arr = this.name.split(".")
      if (arr.length) {
        this.fileType = arr[arr.length - 1]
      }
      this.language = z2d[this.fileType] || this.fileType
    }
    this.readFile()
  },
  methods: {
    formatJson() {
      this.$refs["codeEditor"].formatStrInJson()
    },
    clearFile() {
      this.text = ""
      this.codeKey++
      this.$message.success("清空成功!")
    },
    saveFile() {
      const loading = this.getLoading(".CodeMirror")
      this.postRequest(`${this.$root.prefix}/system/save_file`, {
        full_path: this.fullPath,
        content: this.text,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    readFile() {
      const loading = this.getLoading(".CodeMirror")

      this.getRequest(`${this.$root.prefix}/system/read_file`, {
        full_path: this.fullPath,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.text = resp.data
            this.codeKey++
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    close() {
      this.$emit("close")
    },
  },
}
</script>

<style lang="scss" scoped>
.CodeMirror {
  position: relative;
  height: 100vh;
  overflow: hidden;
  margin-top: 4px;
}

.btn-group {
  margin-bottom: 10px;
  float: right;
}

.code-edit {
  height: 600px;
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
