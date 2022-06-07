import axios from "axios";
import { Message } from "element-ui";
import router from "../router";


// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    if (getCookie("tokenStr")) {
      //请求携带自定义token
      config.headers["Authorization"] =
        getCookie("tokenStr");
    }
    return config;
  },
  (error) => {
    console.log(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (success) => {
    // 业务逻辑错误
    if(success.status && success.status === 200 && success.request.responseURL.search(/auth/)!=-1){
      return success.data;
    }
    if (success.status && success.status === 200) {
      if (
        success.data.code == 500 ||
        success.data.code == 401 ||
        success.data.code == 403
      ) {
        Message.error({ message: success.data.message });
        return;
      }
      if (success.data.message) {
        Message.success({ message: success.data.message });
      }
    }
    return success.data;
  },
  (error) => {
    if (error.response.code == 504 || error.response.code == 404) {
      Message.error({ message: "服务器被吃了┭┮﹏┭┮" });
    } else if (error.response.status == 405 || error.response.code == 500){
      Message.error({ message: "真寻的api地址不正确捏" });
    }else if (error.response.status == 401) {
      if (error.response.data.detail == "Could not validate credentials") {
        Message.error({ message: "用户名或密码错误" });
      } else {
        Message.error({ message: "尚未登录，请登录" });
      }
      router.replace("/");
    } else if (error.response.status == 422){
      Message.error({ message: "修改的数据类型返回错误" });
    }else {
      Message.error({ message: "未知错误" });
    }
    return;
  }
);

let base = "";

export const setBase = (url) =>{
  if( url[url.length-1] == "/" || url[url.length-1] == "\\"){
    url = url.slice(0,-1);
  }
  if(url != ""){
    base = url;
    setBaseUrlLocalStorage(base);
  }else{
    base = "http://localhost:8080";
    setBaseUrlLocalStorage(base);
  }
}

export const getBase = () =>{
  return base;
}

//传送json格式的post请求
export const postRequest = (url, params) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
  });
};
//传递json的put请求
export const putRequest = (url, params) => {
  return axios({
    method: "put",
    url: `${base}${url}`,
    data: params,
  });
};
//传递json的get请求
export const getRequest = (url, params) => {
  return axios({
    method: "get",
    url: `${base}${url}`,
    data: params,
  });
};
//传递json的delete请求
export const deleteRequest = (url, params) => {
  return axios({
    method: "delete",
    url: `${base}${url}`,
    data: params,
  });
};

//设置localStorage
export const setBaseUrlLocalStorage = (value)=>{
  localStorage.setItem("baseUrl",value);
}
//取出localStorage
export const getBaseUrlLocalStorage = ()=>{
  return localStorage.getItem("baseUrl");
}

//设置cookie方法
export const setCookie = (name,value) => {
  var Days = 7;//有效期7天
  var exp = new Date();
  exp.setTime(exp.getTime() + Days*24*60*60*30);
  document.cookie = name + "="+ encodeURI(value) + ";expires=" + exp.toGMTString();
}

//获取cookie方法
export const getCookie = (name) => {
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(document.cookie.match(reg)){
    arr=document.cookie.match(reg)
    return decodeURI(arr[2]);
  }else
    return null;
}



export const clearCookie = (name) => {
  setCookie(name, "", -1);
}

export const verifyIdentity = () => {
    let path = router.currentRoute.path;
    return new Promise((resolve)=>{
      if (getCookie("tokenStr")) {//判断是否存有token
        postRequest(
          "/webui/auth",
          {token: getCookie("tokenStr")}
        ).then((resp)=>{//请求成功
          if(resp){//如果有返回的数据
            if(resp.code == 200){
              router.replace(//身份验证成功
                path == "/" || path == undefined ? "/home" : path
              );
              resolve("true");
            }else{
              Message.error({ message: "身份信息过期或错误" });
              clearCookie("tokenStr");
              if(path != "/") //如果当前页面不是登陆页面
                router.replace("/");
                resolve("false");  
            }
          }else{//如果没有返回的数据
            if(path != "/") //如果当前页面不是登陆页面
              router.replace("/");
              resolve("false");
          }
        }).catch(()=>{//请求失败
          if(path != "/") //如果当前页面不是登陆页面
            router.replace("/");
          Message.error({ message: "真寻酱的api请求不了捏" });
          resolve("false");
        });
      }else{//如果没有token
        if(path != "/") //如果当前页面不是登陆页面
          router.replace("/");
          resolve("false");
      }
    })
}