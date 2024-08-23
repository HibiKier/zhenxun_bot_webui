# hi～这里是小真寻的webui捏
### 欢迎使用小真寻的webui，这里介绍一下简易的部署方法
<div align=center><img width="320" height="320" src="https://raw.githubusercontent.com/HibiKier/zhenxun_bot/main/logo.png"/></div>

![maven](https://img.shields.io/badge/Vue-2.6.14-blue)

## 开发环境使用方式（请先进入webui根目录文件夹下再使用命令）

****
### 开发环境说明：
### &ensp; &ensp; 开发环境用于修改和测试源码，启动开发服务会占用一定的资源和性能`>50mb`
****
### 部署准备：
### &ensp; &ensp; 开发环境需要下载NodeJs 16，未安装请移步链接下载 [https://nodejs.org](https://nodejs.org/dist/v16.20.2/node-v16.20.2-x64.msi)
****


## 使用npm（NodeJs自带）

### 下载webui开发依赖

```
npm install
```

### 启动开发服务
```
npm run serve
```

### 打包生产环境资源
```
npm run build
```

## 使用yarn（需要下载）

### 使用npm安装yarn

```
npm install --global yarn
```

### 下载webui开发依赖

```
yarn install
```

### 启动开发服务
```
yarn serve
```

### 打包生产环境资源
```
yarn build
```


## 生产环境使用方式
****
### 生产环境说明：
### &ensp; &ensp; 生产环境用于webui的日常使用场景，更新只需要覆盖打包的资源即可
### &ensp; &ensp; 生产环境的部署方式很多，这里使用nginx示例

****
### 部署准备：
### &ensp; &ensp; 下载nginx并安装，移步 http://nginx.org/en/download.html
### &ensp; &ensp; 下载webui最新releas或者使用源码中的dist文件夹资源

****
### 简易部署

#### 把下载好的webui资源(css/js/html)复制到nginx根目录下的html文件夹，复制前可先删除html文件夹原有的html文件。
*  window环境下进入解压后的nginx根目录点击nginx.exe即可启动
*  linux环境下进入编译安装后的nginx根目录下输入
```
./sbin/nginx
```


#### nginx启动成功后打开浏览器，输入链接
```
localhost
```

****



## 更新

### 2022/6/20 \[v0.1.0.4] 
* 优化普通插件列表在低宽度屏幕下的体验

### 2022/6/18

* 修复cookie储存异常的问题
* 侧边栏在低分辨率屏幕下自动隐藏

### 2022/6/5 \[v0.1.0.3] (__务必使用zhenxun_bot_v0.1.5.9及以上版本！！！__)
* 新增修改“webui请求api地址”的页面以及功能
* 接口数据类型对齐zhenxun_bot_v0.1.5.9
* 样式体验优化，移动端下样式优化

### 2022/5/31

* 样式表现优化
* 主界面移动端简易简易适配


### 2022/5/28

* 修复配置项和编辑项某些情况下修改出错的问题
* 改变用户身份信息储存方式，7天内可以免登陆
* 部分样式表现优化
* 控制台警告处理
