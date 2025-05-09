import axios from "axios"
import { Message } from "element-ui"
import router from "../router"

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    if (getCookie("tokenStr")) {
      //请求携带自定义token
      config.headers["Authorization"] = getCookie("tokenStr")
    }
    return config
  },
  (error) => {
    console.log(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (success) => {
    const { status, data } = success
    // 业务逻辑错误
    if (status == 200) {
      return success.data
    }
    if (success.status && success.status == 200) {
      if ([500, 999, 998].includes(data.status)) {
        return Message.error({ message: data.info })
      }
      // if (data.message) {
      //   Message.success({ message: success.data.message });
      // }
    }
    return success.data
  },
  (error) => {
    try {
      const { status, data } = error.response
      if (status == 504 || status == 404) {
        Message.error({ message: "服务器被吃了┭┮﹏┭┮" })
      } else if (status == 405) {
        Message.error({ message: "真寻的api地址不正确捏" })
      } else if (status == 400) {
        Message.error(data.detail)
        let path = router.currentRoute.path
        if (path != "/") {
          //如果当前页面不是登陆页面
          router.replace("/")
        }
      } else {
        if (data && data.detail && data.detail.length) {
          Message.error({ message: data.detail[0].msg })
        } else {
          Message.error({ message: "发生错误啦!" })
        }
      }
    } catch (e) {
      if (error.request) {
        Message.error({
          message: "网络连接好像不通畅哦，请检查服务器与地址设置...",
        })
        return
      }
    }

    return
  }
)

let baseApiUrl = "http://localhost"

export const getBaseUrl = () => {
  return getBaseApiUrl() + ":" + getPort()
}

export const setPort = (port) => {
  localStorage.setItem("port", port)
}

export const getPort = () => {
  return localStorage.getItem("port") || "8080"
}

export const setBaseApiUrl = (url) => {
  if (url[url.length - 1] == "/" || url[url.length - 1] == "\\") {
    url = url.slice(0, -1)
  }
  if (url != "") {
    baseApiUrl = url
    setBaseUrlLocalStorage(baseApiUrl)
  } else {
    baseApiUrl = "http://localhost"
    setBaseUrlLocalStorage(baseApiUrl)
    setPort("8080")
  }
}

export const getBaseApiUrl = () => {
  return baseApiUrl
}

//传送json格式的post请求
export const postRequest = (url, params) => {
  if (!url.startsWith("http")) {
    url = `${getBaseUrl()}${url}`
  }
  return axios({
    method: "post",
    url: `${getBaseUrl()}${url}`,
    data: params,
  })
}
//传递json的put请求
export const putRequest = (url, params) => {
  if (!url.startsWith("http")) {
    url = `${getBaseUrl()}${url}`
  }
  return axios({
    method: "put",
    url: `${getBaseUrl()}${url}`,
    data: params,
  })
}
//传递json的get请求
export const getRequest = (url, params) => {
  if (params && Object.keys(params).length) {
    url += "?"
    Object.keys(params).forEach((e) => {
      if (params[e] != null) {
        if (Array.isArray(params[e])) {
          params[e].forEach((x) => {
            url += e + "=" + x + "&"
          })
        } else {
          url += e + "=" + params[e] + "&"
        }
      }
    })
    url = url.substring(0, url.length - 1)
  }
  if (!url.startsWith("http")) {
    url = `${getBaseUrl()}${url}`
  }
  return axios({
    method: "get",
    url: url,
    data: params,
  })
}
//传递json的delete请求
export const deleteRequest = (url, params) => {
  if (!url.startsWith("http")) {
    url = `${getBaseUrl()}${url}`
  }
  return axios({
    method: "delete",
    url: url,
    data: params,
  })
}

//设置localStorage
export const setBaseUrlLocalStorage = (value) => {
  localStorage.setItem("baseUrl", value)
}
//取出localStorage
export const getBaseUrlLocalStorage = () => {
  return localStorage.getItem("baseUrl")
}

//设置cookie方法
export const setCookie = (name, value) => {
  var Days = 7 //有效期7天
  var exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  document.cookie =
    name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString()
}

//获取cookie方法
export const getCookie = (name) => {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
  if (document.cookie.match(reg)) {
    arr = document.cookie.match(reg)
    return decodeURI(arr[2])
  } else return null
}

export const clearCookie = (name) => {
  setCookie(name, "", -1)
}
