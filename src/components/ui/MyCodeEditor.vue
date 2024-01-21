<template>
  <div class="common-editor">
    <textarea
      ref="textarea"
      :value="myValue"
      @input="$emit('input', myValue)"
      style="height: 100%"
    ></textarea>
  </div>
</template>

<script>
import "codemirror/lib/codemirror.css"
import "codemirror/theme/shadowfox.css"
import "codemirror/theme/blackboard.css"
import "codemirror/theme/mbo.css"
import "codemirror/addon/hint/show-hint.css"
import "codemirror/addon/hint/show-hint.js"
import "codemirror/addon/hint/show-hint"
import "codemirror/addon/hint/javascript-hint"
import "codemirror/addon/hint/sql-hint"
import "codemirror/mode/javascript/javascript"
import "codemirror/mode/markdown/markdown"
import "codemirror/mode/sql/sql"
import "codemirror/mode/php/php"
import "codemirror/mode/python/python"
import "codemirror/mode/shell/shell"
import "codemirror/mode/powershell/powershell"

const CodeMirror = require("codemirror/lib/codemirror")

export default {
  name: "CommonEditor",
  props: {
    value: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: null,
    },
    onlyRead: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      myValue: "",
      code: "",
      coder: null,
      mode: "javascript",
      modes: [
        { value: "javascript", label: "Javascript" },
        { value: "x-java", label: "Java" },
        { value: "x-python", label: "Python" },
        { value: "x-sql", label: "SQL" },
        { value: "x-shell", label: "Shell" },
        { value: "x-powershell", label: "PowerShell" },
        { value: "x-php", label: "PHP" },
      ],
    }
  },
  watch: {
    language: {
      handler(language) {
        this.getCoder().then(() => {
          // 尝试从父容器获取语法类型
          if (language) {
            // 获取具体的语法类型对象
            const modeObj = this.getLanguage(language)

            // 判断父容器传入的语法是否被支持
            if (modeObj) {
              this.mode = modeObj.label
              this.coder.setOption("mode", `text/${modeObj.value}`)
            }
          }
        })
      },
      immediate: true,
    },
  },
  computed: {
    coderOptions() {
      return {
        readOnly: this.onlyRead ? "nocursor" : "",
        line: true,
        mode: "application/json", // json数据高亮
        theme: "shadowfox", //设置主题 记得引入对应主题才有显示   import 'codemirror/theme/blackboard.css'
        tabSize: 1,
        spellcheck: true, // 拼写检查
        autocorrect: true, // 自动更正
        lineNumbers: true, // 显示行号
        cursorHeight: 0.8, //光标高度，默认是1
        autoCloseBrackets: true, // 在键入时将自动关闭括号和引号
        styleActiveLine: true, //line选择是是否高亮
        // keyMap: "sublime", // sublime编辑器效果
        matchBrackets: true, // 括号匹配
        lineWrapping: "wrap", // 文字过长时，是换行(wrap)还是滚动(scroll),默认是滚动
        showCursorWhenSelecting: true, // 文本选中时显示光标
        smartIndent: true, // 智能缩进
        completeSingle: false, // 当匹配只有一项的时候是否自动补全
        matchTags: { bothTags: true }, // 将突出显示光标周围的标签
        foldGutter: true, // 可将对象折叠，与下面的gutters一起使用
        gutters: [
          "CodeMirror-lint-markers",
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
        ],
      }
    },
  },
  mounted() {
    this.myValue = this.value
    // 初始化
    this.initialize()
  },
  methods: {
    // 初始化
    initialize() {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
      this.coder = CodeMirror.fromTextArea(
        this.$refs.textarea,
        this.coderOptions
      )
      this.coder.on("inputRead", () => {
        this.coder.showHint()
      })
      // 编辑器赋值
      if (this.value || this.code) {
        this.setCodeContent(this.value || this.code)
      } else {
        this.coder.setValue("")
      }
      // 支持双向绑定
      this.coder.on("change", (coder) => {
        this.code = coder.getValue()

        if (this.$emit) {
          this.$emit("input", this.code)
          this.myValue = this.code
        }
      })
    },
    setCodeContent(val) {
      setTimeout(() => {
        if (!val) {
          this.coder.setValue("")
        } else {
          this.coder.setValue(val)
        }
      }, 300)
    },
    getCoder() {
      const that = this
      return new Promise((resolve) => {
        function get() {
          if (resolve) {
            if (that.coder) {
              resolve(that.coder)
            } else {
              setTimeout(get, 10)
            }
          }
        }
        get()
      })
    },
    getLanguage(language) {
      // 在支持的语法类型列表中寻找传入的语法类型
      return this.modes.find((mode) => {
        // 所有的值都忽略大小写，方便比较
        const currentLanguage = language.toLowerCase()
        const currentLabel = mode.label.toLowerCase()
        const currentValue = mode.value.toLowerCase()

        // 由于真实值可能不规范，例如 java 的真实值是 x-java ，所以讲 value 和 label 同时和传入语法进行比较
        return (
          currentLabel === currentLanguage || currentValue === currentLanguage
        )
      })
    },
    changeMode(val) {
      // 修改编辑器的语法配置
      this.coder.setOption("mode", `text/${val}`)
      // 获取修改后的语法
      const label = this.getLanguage(val).label.toLowerCase()
      // 允许父容器通过以下函数监听当前的语法值
      this.$emit("language-change", label)
    },
    // 格式化字符串为json格式字符串
    formatStrInJson() {
      if (this.myValue) {
        this.myValue = JSON.stringify(JSON.parse(this.myValue), null, 2)
        this.coder.setValue(this.myValue)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.common-editor {
  width: 100%;
  height: 100%;
  ::v-deep .CodeMirror {
    // color: #ccc;
    direction: ltr;
    line-height: 20px;
    width: 100%;
    height: calc(100% - 40px);
    // background-color: #000;
  }
  // ::v-deep .CodeMirror-hints {
  //   z-index: 100000 !important;
  // }

  ::v-deep .custom-class .CodeMirror {
    width: 100%;
  }
}
.CodeMirror-hints {
  z-index: 1000;
}
</style>
