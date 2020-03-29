const express = require('express')
const router = express()
const EssayPic = require('../models/essay-pic')
const Essay = require('../models/essay')
const uuid = require('uuid/v1') //uuid  随机生成图片名字
const STATUS = require('../common/const')

const multiparty = require('multiparty') //处理图片上传
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
router.post('/essayPic', function(req, res) {
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
router.post('/post-new', function(req, res) {
  console.log(req.body)
  const { title, username, essay, essayStatus, essayPassword } = req.body
  Essay.insertMany(
    { title, username, essay, essayStatus, essayPassword },
    function(err, dos) {
      if (!err) {
        res.send({ status: STATUS.SUCCESS })
      } else {
        res.send({ status: STATUS.ERROR })
      }
    }
  )
})
module.exports = router
