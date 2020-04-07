const express = require('express')
const router = express()
const Media = require('../models/media')
const Essay = require('../models/essay')
const Category = require('../models/category')
const uuid = require('uuid/v1') //uuid  随机生成图片名字
const STATUS = require('../common/const')
const ObjectId = require('mongodb').ObjectId
const multiparty = require('multiparty') //处理图片上传
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
router.post('/media', function(req, res) {
  const form = formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    const {
      file_name,
      description,
      username,
      size,
      date,
      pic_width,
      pic_height,
      media_title
    } = fields
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
            file_name,
            description,
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
              res.send(docs)
            }
          }
        )
      }
    })
  })
})
router.post('/post-new', function(req, res) {
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
  Category.insertMany({ username, category }, function(err, dos) {
    if (!err) {
      res.send({ status: STATUS.SUCCESS })
    }
  })
})
router.post('/change-media', function(req, res) {
  const { id, identify } = req.body
  console.log(req.body)
  if (identify === 'description') {
    Media.findByIdAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: {
          description: req.body.description
        }
      },
      {
        new: true
      },
      function(err, docs) {
        if (!err) {
          console.log(docs)
          res.send(docs)
        }
      }
    )
  } else if (identify === 'file_name') {
    Media.findByIdAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: {
          file_name: req.body.file_name
        }
      },
      {
        new: true
      },
      function(err, docs) {
        if (!err) {
          console.log(docs)
          res.send(docs)
        }
      }
    )
  }
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
router.get('/media-detail', function(req, res) {
  const { username, _id } = req.query
  Media.findOne({ username, _id }, function(err, docs) {
    if (!err) res.send(docs)
  })
})
module.exports = router
