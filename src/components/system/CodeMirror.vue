<template>
  <div class="kawaii-codemirror-container">
    <textarea ref="textarea" :value="value"></textarea>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

// 导入常用语言模式
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/python/python'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/css/css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/shell/shell'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/yaml/yaml'

// 导入常用插件
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/indent-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/selection/active-line'

export default {
  name: 'CodeMirrorEditor',
  props: {
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editor: null,
      defaultOptions: {
        mode: 'text',
        theme: 'kawaii',
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 2,
        tabSize: 2,
        matchBrackets: true,
        autoCloseBrackets: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        styleActiveLine: true,
        readOnly: this.readOnly,
        extraKeys: {
          'Ctrl-Enter': () => this.$emit('execute'),
          'Cmd-Enter': () => this.$emit('execute'),
          'Ctrl-/': 'toggleComment',
          'Cmd-/': 'toggleComment',
          'Ctrl-Space': 'autocomplete',
        },
      },
    }
  },
  watch: {
    value(newVal) {
      if (this.editor && newVal !== this.editor.getValue()) {
        this.editor.setValue(newVal)
      }
    },
    options: {
      deep: true,
      handler(newOptions) {
        if (this.editor) {
          Object.keys(newOptions).forEach((key) => {
            this.editor.setOption(key, newOptions[key])
          })
        }
      },
    },
    readOnly(newVal) {
      if (this.editor) {
        this.editor.setOption('readOnly', newVal)
      }
    },
  },
  mounted() {
    this.initializeEditor()
    this.setupCustomTheme()
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.toTextArea()
      this.editor = null
    }
  },
  methods: {
    initializeEditor() {
      const mergedOptions = {
        ...this.defaultOptions,
        ...this.options,
        readOnly: this.readOnly,
      }

      this.editor = CodeMirror.fromTextArea(this.$refs.textarea, mergedOptions)
      this.editor.setValue(this.value)

      this.editor.on('change', () => {
        const content = this.editor.getValue()
        this.$emit('input', content)
        this.$emit('change', content)
      })

      this.editor.on('cursorActivity', () => {
        this.$emit('cursor-activity', this.editor.getCursor())
      })

      this.$emit('ready', this.editor)
    },

    setupCustomTheme() {
      // 动态添加自定义主题样式
      const style = document.createElement('style')
      style.textContent = `
          /* 二次元可爱风格主题 */
          .CodeMirror {
            font-family: 'Comic Neue', 'M PLUS Rounded 1c', cursive, monospace;
            font-size: 14px;
            height: 100% !important;
            background-color: #fff9fb !important;
            border-radius: 12px;
            padding: 8px;
            transition: all 0.3s ease;
          }
          
          .CodeMirror:hover {
            box-shadow: 0 0 0 2px #ffb6c1;
          }
          
          .CodeMirror-gutters {
            background-color: #fff0f5 !important;
            border-right: 1px solid #ffd6e7 !important;
            border-radius: 12px 0 0 12px;
          }
          
          .CodeMirror-linenumber {
            color: #ff85a2 !important;
            padding: 0 8px !important;
            text-align: center;
          }
          
          .CodeMirror-foldgutter {
            width: 15px;
          }
          
          .CodeMirror-activeline-background {
            background: rgba(255, 182, 193, 0.1) !important;
          }
          
          .CodeMirror-focused .CodeMirror-selected {
            background: #ffd6e7 !important;
          }
          
          /* 语法高亮 */
          .cm-s-kawaii .cm-keyword { color: #ff6b88; font-weight: bold; }
          .cm-s-kawaii .cm-string { color: #a37acc; }
          .cm-s-kawaii .cm-string-2 { color: #c97fff; }
          .cm-s-kawaii .cm-number { color: #ff9e3d; }
          .cm-s-kawaii .cm-atom { color: #6bd9e9; }
          .cm-s-kawaii .cm-attribute { color: #ff8e8e; }
          .cm-s-kawaii .cm-comment { color: #9ba6a5; font-style: italic; }
          .cm-s-kawaii .cm-meta { color: #7fdbca; }
          .cm-s-kawaii .cm-variable { color: #6b88ff; }
          .cm-s-kawaii .cm-variable-2 { color: #8a6bff; }
          .cm-s-kawaii .cm-variable-3 { color: #b399ff; }
          .cm-s-kawaii .cm-def { color: #6bd9e9; }
          .cm-s-kawaii .cm-property { color: #ff8e8e; }
          .cm-s-kawaii .cm-operator { color: #ff6b88; }
          .cm-s-kawaii .cm-builtin { color: #ff9e3d; }
          .cm-s-kawaii .cm-tag { color: #ff6b88; }
          .cm-s-kawaii .cm-bracket { color: #a37acc; }
          .cm-s-kawaii .cm-link { color: #a37acc; text-decoration: underline; }
          .cm-s-kawaii .cm-error { background-color: #ff6b88; color: white; }
          
          /* 折叠图标 */
          .CodeMirror-foldmarker {
            color: #ff85a2;
            background: rgba(255, 182, 193, 0.2);
            border-radius: 50%;
            padding: 0 4px;
            margin: 0 2px;
          }
          
          /* 提示框 */
          .CodeMirror-hints {
            font-family: 'Comic Neue', 'M PLUS Rounded 1c', cursive, monospace;
            border: 1px solid #ffb6c1;
            background: #fff9fb;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(255, 182, 193, 0.3);
          }
          
          .CodeMirror-hint {
            color: #a37acc;
            padding: 4px 8px;
            border-radius: 4px;
          }
          
          li.CodeMirror-hint-active {
            background: #ffd6e7;
            color: #ff6b88;
          }
        `
      document.head.appendChild(style)
    },

    formatJson() {
      try {
        const json = JSON.parse(this.editor.getValue())
        const formatted = JSON.stringify(json, null, 2)
        this.editor.setValue(formatted)
        this.$emit('formatted')
      } catch (e) {
        this.$emit('format-error', e)
      }
    },

    focus() {
      if (this.editor) {
        this.editor.focus()
      }
    },

    refresh() {
      if (this.editor) {
        this.editor.refresh()
      }
    },

    getCursor() {
      return this.editor ? this.editor.getCursor() : null
    },

    setCursor(pos) {
      if (this.editor) {
        this.editor.setCursor(pos)
      }
    },
  },
}
</script>

<style scoped>
.kawaii-codemirror-container {
  @apply h-full w-full;
}

.kawaii-codemirror-container ::v-deep .CodeMirror {
  height: 100%;
  min-height: 300px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .kawaii-codemirror-container ::v-deep .CodeMirror {
    font-size: 13px;
  }

  .kawaii-codemirror-container ::v-deep .CodeMirror-linenumber {
    padding: 0 5px !important;
  }
}
</style>

<style>
/* 全局字体 */
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=M+PLUS+Rounded+1c:wght@400;700&display=swap');
</style>
