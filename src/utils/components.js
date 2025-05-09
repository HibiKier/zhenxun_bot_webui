import Vue from 'vue'
import CuteConfirm from '@/components/ui/CuteConfirm.vue'

// 注册全局组件（可选）
Vue.component('CuteConfirm', CuteConfirm)

// 添加 $cuteConfirm 方法
Vue.prototype.$cuteConfirm = function (options) {
  return new Promise((resolve) => {
    const ComponentClass = Vue.extend(CuteConfirm)
    const instance = new ComponentClass({
      propsData: {
        ...options,
        visible: true,
      },
    })

    // 修改关闭逻辑
    instance.$on('close', () => {
      resolve(false) // 默认取消
      setTimeout(() => {
        instance.$destroy()
        instance.$el.remove()
      }, 300)
    })

    instance.$on('confirm', () => {
      resolve(true) // 确认
      setTimeout(() => {
        instance.$destroy()
        instance.$el.remove()
      }, 300)
    })

    instance.$mount()
    document.body.appendChild(instance.$el)
  })
}
