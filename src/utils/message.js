import { Message, Notification } from 'element-ui'
const showMessage = Symbol('showMessage')

class KawaiiMessage {
  [showMessage](type, options, single) {
    // 默认添加可爱前缀
    if (typeof options === 'string') {
      options = {
        message: this.getKawaiiPrefix(type) + options,
        customClass: 'kawaii-message',
      }
    } else {
      options.message = this.getKawaiiPrefix(type) + (options.message || '')
      options.customClass = 'kawaii-message ' + (options.customClass || '')
    }

    if (single) {
      if (document.getElementsByClassName('el-message').length === 0) {
        Message[type](options)
      }
    } else {
      Message[type](options)
    }
  }

  getKawaiiPrefix(type) {
    const prefixes = {
      info: '(・ω・)ノ ',
      success: 'ヽ(✿ﾟ▽ﾟ)ノ ',
      warning: '(｀∀´)Ψ ',
      error: '(；´д｀)ゞ ',
    }
    return prefixes[type] || ''
  }

  info(options, single = true) {
    this[showMessage]('info', options, single)
  }

  warning(options, single = false) {
    this[showMessage]('warning', options, single)
  }

  error(options, single = false) {
    this[showMessage]('error', options, single)
  }

  success(options, single = true) {
    this[showMessage]('success', options, single)
  }
}

export const message = new KawaiiMessage()

const showNotify = Symbol('showNotify')

class KawaiiNotify {
  [showNotify](type, options, single) {
    // 默认添加可爱前缀
    if (typeof options === 'string') {
      options = {
        title: '提示',
        message: this.getKawaiiPrefix(type) + options,
        customClass: 'kawaii-notify',
        duration: 3000,
      }
    } else {
      options.message = this.getKawaiiPrefix(type) + (options.message || '')
      options.customClass = 'kawaii-notify ' + (options.customClass || '')
      options.duration = options.duration || 3000
    }

    if (single) {
      // 如果要求单例模式，先关闭所有之前的通知
      Notification.closeAll()
    }
    Notification[type](options)
  }

  getKawaiiPrefix(type) {
    const prefixes = {
      info: '(・ω・)ノ ',
      success: 'ヽ(✿ﾟ▽ﾟ)ノ ',
      warning: '(｀∀´)Ψ ',
      error: '(；´д｀)ゞ ',
    }
    return prefixes[type] || ''
  }

  info(options, single = true) {
    this[showNotify]('info', options, single)
  }

  success(options, single = true) {
    this[showNotify]('success', options, single)
  }

  warning(options, single = false) {
    this[showNotify]('warning', options, single)
  }

  error(options, single = false) {
    this[showNotify]('error', options, single)
  }
}

export const notify = new KawaiiNotify()
