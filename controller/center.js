const express = require('express')
const router = express()
const uuid = require('uuid/v1') //uuid  随机生成图片名字
const multiparty = require('multiparty') //处理图片上传
const Personal = require('../models/personals')
const STATUS = require('../common/const')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
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
      console.log(newPath)
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
          Personal.findOne({ username }, function(err, data) {
            if (!data) {
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

// //获取用户信息
// app.get('/user/userInfoGet', function(req, res) {
//   let { username } = req.query
//   console.log('123')
//   MongoClient.connect(DBurl, function(err, db) {
//     db.collection('userInfo').findOne(
//       {
//         username
//       },
//       function(er, rs) {
//         if (rs) {
//           console.log('找到了')
//           res.send(rs)
//         }else{
//           console.log('没找到')
//         }
//       }
//     )
//   })
// })

module.exports = router
