var express = require('express')
const router = express.Router()
const STATUS = require('../common/const')
const User = require('../models/users') //引入model层
const savePass = require('../common/save')

// routes/index.js

//用户注册
router.post('/register', function(req, res) {
  const { username, password, e_mail, token, avatar, permission } = req.body //获取非加密用户名和邮箱
  console.log(req.body)
  let b_password = savePass(password) //后端再加密端 密码 存入数据库
  const postData = {
    username,
    password: b_password,
    e_mail,
    token,
    avatar,
    permission
  }
  User.findOne({ username }, function(err, data) {
    if (data) {
      res.send({ status: STATUS.USERNAME_REPERATED }) //用户名重复
    } else {
      User.findOne({ e_mail }, function(err, data) {
        if (data) {
          res.send({ status: STATUS.EMAIL_REPEATED })
        } //邮箱重复
        else {
          // 保存到数据库
          User.create(postData, function(err, data) {
            if (err) throw err
            res.send({ status: STATUS.SUCCESS }) //注册成功
          })
        }
      })
    }
  })
})
//用户登录

router.post('/login', function(req, res) {
  const { username, password } = req.body
  let b_password = savePass(password)
  User.findOne({ username }, function(err, data) {
    console.log(data.password === b_password)
    switch (data.password === b_password) {
      case true:
        res.send({
          status: STATUS.SUCCESS,
          e_mail: data.e_mail,
          username: data.username,
          token: data.token
        })
        break
      case false:
        res.send({
          status: STATUS.PASSWORD_ERROR
        })
        break
      default:
        res.send({
          status: STATUS.UNFIND
        })
    }
  })
  
})

//暴露路由
module.exports = router
