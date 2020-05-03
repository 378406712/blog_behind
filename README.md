## blog_behind
毕设博客后台

<p align="center"><a href="https://qdmmz.cn"><img width="120" src="http://q1.qlogo.cn/g?b=qq&nk=378406712&s=640"></a></p>
<p align="center">基于 NodeJs 和 Express 的后端实现</p>
<p align="center">后端：node.js </p>
<p align="center">数据库：mongodb</p>
<p align="center">
  <a href="https://github.com/nodejs" rel="nofollow" target="_blank">
    <img src="https://img.shields.io/badge/node.js-v12.13.1-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/expressjs" rel="nofollow" target="_blank">
    <img src="https://img.shields.io/badge/Express-4.17.1-orange.svg" alt="element-ui">
  </a>
  <a href="https://mongoosejs.com/" rel="nofollow" target="_blank">
    <img src="https://img.shields.io/badge/mongoose-5.9.4-%23880000" alt="Build Status">
  </a>
  <a href="https://github.com/378406712/blog_behind/blob/mac/LICENSE">
    <img src="https://img.shields.io/badge/licence-Apache%202.0-blueviolet.svg" alt="license">
  </a>
  <a href="https://github.com/378406712" target="_blank">
    <img src="https://img.shields.io/badge/Liu-designed-brightgreen.svg" alt="donate">
  </a>
    <a href="https://github.com/mongodb/mongo/" target="_blank">
    <img src="https://img.shields.io/badge/mongodb-2.2.33-blueviolet.svg" alt="donate">
  </a>
</p>

## 简介

`blog_behind`是<a href="https://github.com/378406712/myBlogDesign-2.0">myBlogDesign-2.0</a>的后端，使用了node.js+express框架,以及mongodb数据库

## 写在前面

 请确保你安装了 [node](https://nodejs.org/en/) 和 [git](https://git-scm.com/)，[mongodb]( https://www.mongodb.com/ )

数据库名：myBlog-> cmd下use myBlog即可

## 目录结构

```
models
├─category.js
├─devices.js
├─essay.js
├─media.js
├─personals.js
└users.js
```



```
controller
├─account.js
├─category.js
├─edit.js
├─homepage.js
├─publicKey.js
└user.js
```



## Api接口

| account.js   |              |
| ------------ | :----------: |
| /userInfoAdd | 添加用户信息  |
| /userInfoGet | 获取用户信息  |

| **category.js**      |                  |
| -------------------- | ---------------- |
| /get-essay           | 获取文章信息     |
| /BatchDeleteCategory | 批量删除目录     |
| /get-categoryDetail  | 获取详细目录信息 |
| /alter-category      | 更新目录         |

| edit.js             |                      |
| ------------------- | -------------------- |
| /media              | 提交富文本中图片     |
| /post-new           | 提交新文章           |
| /category-count     | 目录下文章统计(单条) |
| /category-count-all | 目录下文章统计(全部) |
| /set-category       | 新增目录             |
| /change-media       | 更改媒体信息         |
| /media-remove       | 删除媒体文件         |
| /get-category       | 获取目录             |
| /get-media          | 获取媒体文件         |
| /media-detail       | 获取媒体信息         |
| /media-date         | 获取媒体信息中的日期 |
| /media-search       | 获取筛选的媒体       |
| /category-search    | 获取筛选的目录       |

| homepage.js         |                        |
| ------------------- | ---------------------- |
| /getDevices         | 获取用户系统信息       |
| /deleteDevice       | 删除用户系统信息(单条) |
| /BatchDeleteDevices | 批量删除用户系统信息   |

| user.js     |                  |
| ----------- | ---------------- |
| /register   | 用户注册         |
| /login      | 用户登录         |
| /logout     | 用户登出         |
| /DeviceInfo | 存入设备信息     |
| /getInfo    | 获取用户登陆信息 |
| /passAlter  | 修改用户密码     |
| /userRemove | 删除用户账号     |

## 构建启动

```
# 启动（热加载）
supervisor api.js

# 数据库本地启动
mongod
monogo
```

## License

 [Apache-2.0](https://github.com/378406712/blog_behind/blob/mac/LICENSE) 

 Copyright [Clover](https://github.com/378406712)
