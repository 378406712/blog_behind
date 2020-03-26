const express = require('express')
const router = express()
const EssayPic = require('../models/essay-pic')
const uuid = require('uuid/v1') //uuid  随机生成图片名字
const multiparty = require('multiparty') //处理图片上传
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
router.post('/post-new', function(req, res) {
  const form = formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    const upLoadFile = files.file
    let extname = path.extname(upLoadFile.name) //后缀名
    let filename = uuid() + extname //文件名
    const oldPath = upLoadFile.path
    const newPath = path.join('./public/post-new', filename)
    const uploadUrl = `http://localhost:3001/uploadEditPic/${filename}`
    fs.rename(oldPath, newPath, err => {
      if (!err) {
        EssayPic.insertMany({ file: uploadUrl }, function(err, docs) {
          if (!err) {
            res.send({ file: uploadUrl })
          }
        })
      }
    })
  })
})
module.exports = router
