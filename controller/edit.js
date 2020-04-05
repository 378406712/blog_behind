const express = require('express')
const router = express()
const Media = require('../models/media')
const Essay = require('../models/essay')
const Category = require('../models/category')
const uuid = require('uuid/v1') //uuid  随机生成图片名字
const STATUS = require('../common/const')

const multiparty = require('multiparty') //处理图片上传
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
router.post('/media', function(req, res) {
  const form = formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    const { username, size, date, pic_width, pic_height, media_title } = fields
    const upLoadFile = files.file
    const extname = path.extname(upLoadFile.name) //后缀名
    const filename = uuid() + extname //文件名
    const oldPath = upLoadFile.path
    const newPath = path.join('./public/media', filename)
    const uploadUrl = `http://localhost:3001/mediaSource/${filename}`
    fs.rename(oldPath, newPath, err => {
      if (!err) {
        Media.insertMany(
          {
            file: uploadUrl,
            username,
            size,
            date,
            pic_width,
            pic_height,
            media_title
          },
          function(err, docs) {
            if (!err) {
              res.send({ file: uploadUrl })
            }
          }
        )
      }
    })
  })
})
router.post('/post-new', function(req, res) {
  console.log(req.body)
  const EssayData = {
    title: req.body.title,
    username: req.body.username,
    category: req.body.category,
    essay: req.body.essay,
    essayStatus: req.body.essayStatus,
    essayPassword: req.body.essayPassword,
    reCheck: req.body.reCheck,
    keepTop: req.body.keepTop
  }
  Essay.insertMany(EssayData, function(err, dos) {
    if (!err) {
      res.send({ status: STATUS.SUCCESS })
    } else {
      res.send({ status: STATUS.ERROR })
    }
  })
})
router.post('/set-category', function(req, res) {
  const { username, category } = req.body
  console.log(username + '----' + category)
  Category.insertMany({ username, category }, function(err, dos) {
    if (!err) {
      res.send({ status: STATUS.SUCCESS })
    }
  })
})
router.get('/get-category', function(req, res) {
  const { username } = req.query
  Category.find({ username }, function(err, docs) {
    if (!err) res.send(docs)
  })
})
router.get('/get-media', function(req, res) {
  const { username } = req.query
  Media.find({ username }, function(err, docs) {
    if (!err) res.send(docs)
  })
})
module.exports = router
