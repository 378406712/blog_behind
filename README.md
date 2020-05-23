## blog_behind
毕设博客后台

<p  align="center"><a href="https://qdmmz.cn"><img width="120" src="http://q1.qlogo.cn/g?b=qq&nk=378406712&s=640"></a></p>
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

该后端为[myBlogDesign-2.0](https://github.com/378406712/myBlogDesign-2.0)的后端环境,需要配合其使用。

请确保你安装了 [node](https://nodejs.org/en/) 和 [git](https://git-scm.com/)，[mongodb]( https://www.mongodb.com/ )

数据库安装过程：[install Mongoodb](https://github.com/378406712/blog_behind/blob/mac/%E5%AE%89%E8%A3%85%E8%BF%87%E7%A8%8B.doc)

## 构建运行

```bash
# 克隆项目
git clone https://github.com/378406712/blog_behind

# 进入项目
cd blog_behind

# install dependencies
npm install

# install supervisor
npm install -g supervisor

# serve with hot reload at localhost:3001
supervisor api.js
```

## 项目结构

### models

```

├─category.js
├─dashboard.js
├─devices.js
├─essay.js
├─media.js
├─personals.js
└─users.js
```

### controller

```
├─front
	├─indexpage.js //前台所有接口
├─account.js
├─category.js
├─dashboard.js
├─edit.js
├─essay.js
├─homepage.js
├─publicKey.js
└─user.js
```

## Api接口

| account.js   | **账户逻辑** |
| ------------ | :----------: |
| /userInfoAdd | 添加用户信息  |
| /userInfoGet | 获取用户信息  |
| **category.js** | **目录逻辑** |
| /get-essay | 获取文章信息 |
| /BatchDeleteCategory | 批量删除目录 |
| /get-categoryDetail | 获取详细目录信息 |
| /alter-category | 更新目录 |
| **edit.js** | **文章编辑逻辑** |
| /media | 提交富文本中图片 |
| /post-new | 提交新文章 |
| /category-count | 目录下文章统计(单条) |
| /category-count-all | 目录下文章统计(全部) |
| /set-category | 新增目录 |
| /change-media | 更改媒体信息 |
| /media-remove | 删除媒体文件 |
| /get-category | 获取目录 |
| /get-media | 获取媒体文件 |
| **homepage.js** | **用户中心页逻辑** |
| /getDevices | 获取用户系统信息 |
| /deleteDevice | 删除用户系统信息(单条) |
| /BatchDeleteDevices | 批量删除用户系统信息 |
| **user.js** | **用户资料逻辑** |
| /register | 用户注册 |
| /login | 用户登录 |
| /logout | 用户登出 |
| /DeviceInfo | 存入设备信息 |
| /getInfo | 获取用户登陆信息 |
| /passAlter | 修改用户密码 |
| /userRemove | 删除用户账号 |
| **publicKey.js** | **公钥** |
| /getPublicKey | 获取公钥 |
| **dashboard.js** | **仪表盘页面** |
| /set-todo | 变更当前任务 |
| /get-todo | 获取当前任务 |
| **essay.js** | **文章页面逻辑** |
| /get-essay | 获取所有文章（非回收站中） |
| /get-trash-essay | 获取回收站文章 |
| /essay-search | 获取搜索的文章 |
| /essay-filter | 获取筛选的文章 |
| /BatchDeleteEssay | 批量删除文章 |
| /BatchTrashEssay | 批量移入回收站 |
| /essay-date | 获取文章信息中的日期 |
| **indexpage** | **前台所有逻辑** |
| /get-boke-essay | 获取文章 |
| /set-guest-comment | 获取评论 |
| /time-axis | 获取归档 |
| /search-essay | 搜索文章 |

## 数据库运行

```
# 数据库本地启动
mongod
monogo

# 推荐安装使用Robo3T 图形化管理 Mongodb
```

### 其他

```
	由于后端一开始未使用MVC架构，导致前端多次请求接口容易发生系统崩溃。
后期我重构过一次，也使用了大量Moogoose的Api，所有可能出现部分接口有原生的Api写法，也有Moogoose的Api。
	这是我第一次做后端以及使用非关系型数据库Mongodb，自知有很多不足。
	希望通过在未来学习与实践中，让自己变得更加强大!
```

## License

 [Apache-2.0](https://github.com/378406712/blog_behind/blob/mac/LICENSE) 

 Copyright [Clover](https://github.com/378406712)
