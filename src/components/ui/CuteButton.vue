<template>
  <button
    ref="button"
    @click="handleClick($event)"
    :class="buttonClasses"
    class="flex items-center justify-center transition-all duration-300 relative overflow-hidden"
    :style="buttonStyles"
  >
    <!-- 图标插槽 -->
    <slot name="icon">
      <svg-icon v-if="icon" class="w-5 h-5 mr-2" :icon-class="icon">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="iconPath"
        ></path>
      </svg-icon>
    </slot>

    <!-- 按钮文本 -->
    <slot></slot>

    <!-- 点击动画效果 -->
    <span
      v-if="clickEffect"
      class="absolute bg-white rounded-full pointer-events-none transform scale-0"
      :style="clickEffectStyle"
    ></span>
  </button>
</template>

<script>
import SvgIcon from '../SvgIcon/SvgIcon.vue'

export default {
  name: 'CuteButton',
  components: { SvgIcon },
  props: {
    // 按钮类型：primary, secondary, danger, success, warning, info, light, dark
    type: {
      type: String,
      default: 'primary',
      validator: (value) =>
        [
          'primary',
          'secondary',
          'danger',
          'success',
          'warning',
          'info',
          'light',
          'dark',
          'normal',
        ].includes(value),
    },
    // 是否显示加载状态
    loading: {
      type: Boolean,
      default: false,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 按钮大小：sm, md, lg
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
    // 是否块级按钮
    block: {
      type: Boolean,
      default: false,
    },
    // 自定义图标
    icon: {
      type: String,
      default: '',
    },
    // 自定义颜色
    color: {
      type: String,
      default: '',
    },
    // 字体颜色
    textColor: {
      type: String,
      default: '',
    },
    // 圆形按钮
    rounded: {
      type: Boolean,
      default: false,
    },
    // 是否使用简约风格
    plain: {
      type: Boolean,
      default: false,
    },
    // 是否使用纯色背景
    solid: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      clickEffect: false,
      clickEffectStyle: {},
      iconMap: {
        edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        back: 'M10 19l-7-7m0 0l7-7m-7 7h18',
        save: 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4',
        delete:
          'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
        confirm: 'M5 13l4 4L19 7',
      },
    }
  },
  computed: {
    buttonClasses() {
      const classes = []

      // 大小类
      if (this.size === 'sm') {
        classes.push('px-4 py-2 text-sm rounded-md')
      } else if (this.size === 'lg') {
        classes.push('px-8 py-4 text-lg rounded-xl')
      } else {
        classes.push('px-6 py-3 rounded-lg') // md
      }

      // 块级按钮
      if (this.block) {
        classes.push('w-full')
      }

      // 禁用状态
      if (this.disabled) {
        classes.push('opacity-60 cursor-not-allowed')
        return classes.join(' ')
      }

      // 根据类型添加类
      if (this.color && !this.color.startsWith('#')) {
        classes.push(`bg-${this.color} text-white hover:bg-${this.color}-600`)
      }

      if (this.type && !this.plain) {
        if (this.solid) {
          // 纯色版本
          switch (this.type) {
            case 'primary':
              classes.push(
                'bg-pink-500 text-white hover:bg-pink-600 shadow-md hover:shadow-lg'
              )
              break
            case 'secondary':
              classes.push(
                'bg-purple-500 text-white hover:bg-purple-600 shadow-md hover:shadow-lg'
              )
              break
            case 'danger':
              classes.push(
                'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
              )
              break
            case 'success':
              classes.push(
                'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
              )
              break
            case 'warning':
              classes.push(
                'bg-yellow-500 text-white hover:bg-yellow-600 shadow-md hover:shadow-lg'
              )
              break
            case 'info':
              classes.push(
                'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
              )
              break
            case 'light':
              classes.push(
                'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm hover:shadow-md'
              )
              break
            case 'dark':
              classes.push(
                'bg-gray-800 text-white hover:bg-gray-900 shadow-md hover:shadow-lg'
              )
              break
            case 'normal':
              classes.push(
                'bg-gray-500 text-white hover:bg-gray-600 shadow-md hover:shadow-lg'
              )
          }
        } else {
          // 渐变版本（颜色A到颜色B）
          switch (this.type) {
            case 'primary':
              classes.push(
                'bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600 shadow-md hover:shadow-lg'
              )
              break
            case 'secondary':
              classes.push(
                'bg-gradient-to-r from-blue-400 to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-600 shadow-md hover:shadow-lg'
              )
              break
            case 'danger':
              classes.push(
                'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg'
              )
              break
            case 'success':
              classes.push(
                'bg-gradient-to-r from-green-400 to-teal-500 text-white hover:from-green-500 hover:to-teal-600 shadow-md hover:shadow-lg'
              )
              break
            case 'warning':
              classes.push(
                'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-md hover:shadow-lg'
              )
              break
            case 'info':
              classes.push(
                'bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 shadow-md hover:shadow-lg'
              )
              break
            case 'light':
              classes.push(
                'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-700 hover:from-gray-200 hover:to-gray-400 shadow-sm hover:shadow-md'
              )
              break
            case 'dark':
              classes.push(
                'bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-700 hover:to-gray-900 shadow-md hover:shadow-lg'
              )
              break
            case 'normal':
              classes.push(
                'bg-gradient-to-r from-gray-400 to-gray-600 text-white hover:from-gray-500 hover:to-gray-700 shadow-md hover:shadow-lg'
              )
          }
        }
      } else if (this.type && this.plain) {
        // 简约风格
        switch (this.type) {
          case 'primary':
            classes.push(
              'border border-pink-300 text-pink-600 hover:bg-pink-50'
            )
            break
          case 'secondary':
            classes.push(
              'border border-purple-300 text-purple-600 hover:bg-purple-50'
            )
            break
          case 'danger':
            classes.push('border border-red-300 text-red-600 hover:bg-red-50')
            break
          case 'success':
            classes.push(
              'border border-green-300 text-green-600 hover:bg-green-50'
            )
            break
          case 'warning':
            classes.push(
              'border border-yellow-300 text-yellow-600 hover:bg-yellow-50'
            )
            break
          case 'info':
            classes.push(
              'border border-blue-300 text-blue-600 hover:bg-blue-50'
            )
            break
          case 'light':
            classes.push(
              'border border-gray-200 text-gray-600 hover:bg-gray-50'
            )
            break
          case 'dark':
            classes.push(
              'border border-gray-700 text-gray-800 hover:bg-gray-100'
            )
            break
          case 'normal':
            classes.push(
              'border border-gray-300 text-gray-600 hover:bg-gray-50'
            )
        }
      }

      if (this.rounded) {
        classes.push('rounded-full')
      }

      return classes.join(' ')
    },
    buttonStyles() {
      const styles = {}

      if (this.color.startsWith('#')) {
        styles.backgroundColor = this.color
        styles.color = this.textColor || '#ffffff'
      }

      if (this.loading) {
        styles.cursor = 'wait'
      }

      return styles
    },
    iconPath() {
      return this.iconMap[this.icon] || this.iconMap.edit
    },
  },
  methods: {
    handleClick(event) {
      if (this.disabled || this.loading) return

      // 触发点击动画
      this.animateClick(event)

      // 触发父组件点击事件
      this.$emit('click', event)
    },
    animateClick(event) {
      const rect = this.$refs.button.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      this.clickEffectStyle = {
        left: `${x}px`,
        top: `${y}px`,
        width: '0',
        height: '0',
        opacity: '0.6',
        transform: 'scale(0)',
      }

      this.clickEffect = true

      setTimeout(() => {
        this.clickEffectStyle = {
          ...this.clickEffectStyle,
          width: '600px',
          height: '600px',
          opacity: '0',
          left: `${x - 300}px`,
          top: `${y - 300}px`,
          transform: 'scale(1)',
          transition: 'all 0.6s ease-out',
        }
      }, 10)

      setTimeout(() => {
        this.clickEffect = false
      }, 600)
    },
  },
}
</script>

<style scoped>
button:active {
  transform: scale(0.98);
}

.rounded-btn {
  border-radius: 20px;
  padding: 10px 25px;
  font-weight: bold;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 150, 200, 0.4);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(1px);
  }
}
</style>
