const express = require('express')
const router = express()
const Essay = require('../models/essay')
const uuid = require('uuid/v1') //uuid  随机生成图片名字
const multiparty = require('multiparty') //处理图片上传
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
router.post('/post-new', function(req, res) {
  const form = formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    console.log(files.file)
  })
})
module.exports = router
