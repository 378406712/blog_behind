const express = require('express')
const router = express.Router()
const STATUS = require('../common/const')
const User = require('../models/users') //引入model层
const Device = require('../models/devices')
const timeStamp = require('time-stamp') // 时间
const savePass = require('../common/save')

//用户注册
router.post('/register', function(req, res) {
  const { username, password, e_mail, token, avatar, permission } = req.body //获取非加密用户名和邮箱
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
    if (!data) {
      res.send({ status: STATUS.UNFIND })
    }
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
        res.send({ status: STATUS.PASSWORD_ERROR })
        break
    }
  })
})
//用户登出
router.post('/logout', function(req, res) {
  res.send('SUCCESS')
})
//存入设备信息
router.post('/DeviceInfo', function(req, res) {
  const times = timeStamp('YYYY-MM-DD HH:mm:ss')
  const { username, os, digits, browser } = req.body
  const ips = req.ip.slice(7)
  const postData = { username, os, digits, browser, ip: ips, time: times }
  Device.insertMany(postData)
})
// 获取用户登陆信息
router.post('/getInfo', function(req, res) {
  const { username } = req.body
  User.findOne({ username }, function(err, data) {
    res.send(data)
  })
})
//修改用户密码
router.post('/passAlter', function(req, res) {
  const { username, originPass, newPass } = req.body
  const b_password1 = savePass(originPass) //原密码
  const b_password2 = savePass(newPass) //修改的密码
  User.findOne({ username }, function(err, data) {
    if (data.password === b_password1) {
      User.findOneAndUpdate(data.password, {
        $set: { password: b_password2 }
      }).then(() => res.send({ status: STATUS.SUCCESS }))
    }
  })
  // MongoClient.connect(DBurl, function(err, db) {
  //   db.collection('register').findOne(
  //     {
  //       username
  //     },
  //     function(er, rs) {
  //       if (rs) {
  //         if (rs.b_password == b_password1) {
  //           //update
  //           db.collection('register').update(
  //             {
  //               b_password: rs.b_password
  //             },
  //             {
  //               $set: {
  //                 b_password: b_password2
  //               }
  //             },

  //             function(e, r) {
  //               if (
  //                 !eres.send({
  //                   status: STATUS.PASSWORD_ERROR //原密码错误
  //                 })
  //               ) {
  //                 res.send({
  //                   status: STATUS.SUCCESS
  //                 }) //修改成功
  //               }
  //             }
  //           )
  //         } else {
  //         }
  //       }
  //     }
  //   )
  // })
})

//暴露路由
module.exports = router
