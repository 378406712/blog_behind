const express = require('express')
const router = express()
const uuid = require('uuid/v1') //uuid  随机生成图片名字
const multiparty = require('multiparty') //处理图片上传
const STATUS = require('../common/const')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const Personal = require('../models/personals')
const User = require('../models/users')
//添加用户信息
router.post('/userInfoAdd', function(req, res) {
  //图片信息
  const form = formidable.IncomingForm()
  form.uploadDir = path.normalize('.' + '/public/tempDir')
  form.parse(req, (err, fields, files) => {
    //非图片信息,不需要存图片信息
    const upLoadFile = files.file
    let {
      url,
      job,
      sex,
      desc,
      username,
      nickname,
      birthday,
      hometown
    } = JSON.parse(fields.message)
    const postData1 = {
      url,
      job,
      sex,
      desc,
      hometown,
      username,
      nickname,
      birthday
    }
    if (upLoadFile) {
      //存在图片时

      let extname = path.extname(upLoadFile.name) //后缀名
      let filename = uuid() + extname //文件名
      const oldPath = upLoadFile.path
      const newPath = path.join('./public/upload', filename)
      const uploadUrl = `http://localhost:3001/uploads/${filename}`
      const postData2 = {
        url: uploadUrl,
        job,
        sex,
        desc,
        username,
        nickname,
        birthday,
        hometown
      }

      fs.rename(oldPath, newPath, err => {
        if (!err) {
          User.findOneAndUpdate(
            { username },
            { $set: { avatar: uploadUrl } },
            function(err, data) {}
          )
          Personal.findOne({ username }, function(err, data) {
            if (!data) {
              12
              Personal.insertMany(postData2, function(err) {
                if (!err) res.send({ status: STATUS.SUCCESS })
              })
            } else {
              Personal.findOneAndUpdate({ username }, postData2, function(err) {
                if (!err) res.send({ status: STATUS.UPDATE })
              })
            }
          })
        }
      })
    } else {
      Personal.findOne({ username }, function(err, data) {
        if (!data) {
          Personal.insertMany(postData1, function(err) {
            if (!err) res.send({ status: STATUS.SUCCESS })
          })
        } else {
          Personal.findOneAndUpdate({ username }, postData1, function(err) {
            if (!err) res.send({ status: STATUS.UPDATE })
          })
        }
      })
    }
  })
})
//获取用户信息
router.get('/userInfoGet', function(req, res) {
  const { username } = req.query
  Personal.findOne({ username }, function(err, data) {
    if (!err) {
      res.send(data)
    }
  })
})

module.exports = router
