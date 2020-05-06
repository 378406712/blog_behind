const express = require('express')
const router = express()
const fs = require('fs')
const path = require('path')
const Media = require('../models/media')
const Essay = require('../models/essay')
const Category = require('../models/category')
const ObjectId = require('mongodb').ObjectId
const uuid = require('uuid/v1') //uuid  随机生成图片名字
const multiparty = require('multiparty') //处理图片上传
const formidable = require('formidable')
const STATUS = require('../common/const')
// 提交富文本中图片
router.post('/media', function (req, res) {
  const form = formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    const upLoadFile = files.file
    const extname = path.extname(upLoadFile.name) //后缀名
    const filename = uuid() + extname //文件名
    const oldPath = upLoadFile.path
    const newPath = path.join('./public/media', filename)
    const uploadUrl = `http://localhost:3001/mediaSource/${filename}`
    fs.rename(oldPath, newPath, (err) => {
      if (!err) {
        Media.insertMany({ ...fields, file: uploadUrl }, function (err, docs) {
          if (!err) {
            res.send(docs)
          }
        })
      }
    })
  })
})
// 获取文章
router.get('/get-essay-new', function (req, res) {
  const { username, id } = req.query
  Essay.find({ username, _id: ObjectId(id) }, function (err, docs) {
    if (!err) {
      //  console.log(...docs)
      res.send(...docs)
    } else {
      // console.log(err)
    }
  })
})
// 提交(更新)新文章
router.post('/post-new', function (req, res) {
  if (req.body.tag === 'post-new') {
    Essay.insertMany(req.body, function (err, docs) {
      if (!err) {
        res.send({ status: STATUS.SUCCESS })
      } else {
        res.send({ status: STATUS.ERROR })
      }
    })
  } else if (req.body.tag === 'update') {
    Essay.findByIdAndUpdate(
      { _id: ObjectId(req.body._id) },
      req.body,
      function (err, docs) {
        if (!err) {
          res.send({ status: STATUS.UPDATE })
        } else {
          res.send({ status: STATUS.ERROR })
        }
      }
    )
  }
})
// 目录下文章统计(单条)
router.post('/category-count', function (req, res) {
  const { username, checkCategory } = req.body
  new Promise((resolve) => {
    checkCategory.map((item) => {
      Essay.countDocuments({ username, checkCategory: item }, function (
        err,
        count
      ) {
        if (!err) {
          Category.updateMany(
            { username, category: item },
            {
              $set: {
                sum: count
              }
            },
            function () {
              resolve()
            }
          )
        }
      })
    })
  }).then(() => {
    Category.find({ username }, function (err, docs) {
      if (!err) res.send(docs)
    })
  })
})
// 目录下文章统计(全部)
router.post('/category-count-all', function (req, res) {
  const { username } = req.body
  Category.where(username).then((data) => {
    new Promise((resolve) => {
      let dataArr = []
      data.map((item) => {
        dataArr.push(item.category)
      })
      new Promise((resolve) => {
        dataArr.map((item) => {
          Essay.countDocuments({ username, checkCategory: item }, function (
            err,
            count
          ) {
            if (!err) {
              Category.updateMany(
                { username, category: item },
                {
                  $set: {
                    sum: count
                  }
                },
                function () {
                  resolve()
                }
              )
            }
          })
        })
      }).then(() => {
        Category.find({ username }, function (err, docs) {
          if (!err) res.send(docs)
        })
      })
    })
  })
})
// 新增目录
router.post('/set-category', function (req, res) {
  const { username, category } = req.body
  Category.findOne({ username, category }, function (err, docs) {
    if (docs && category.category != '未分类') {
      res.send(docs)
    } else if (!err && !docs) {
      Category.insertMany(req.body, function (err, docs) {
        res.send(docs[0])
      })
    }
  })
})
// 更改媒体信息
router.post('/change-media', function (req, res) {
  const { id, identify } = req.body
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
      function (err, docs) {
        if (!err) {
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
      function (err, docs) {
        if (!err) {
          res.send(docs)
        }
      }
    )
  }
})
// 删除媒体文件
router.post('/media-remove', function (req, res) {
  Media.findOneAndDelete(req.body, function (err) {
    if (!err) {
      res.send({ status: STATUS.SUCCESS })
    } else {
      res.send({ status: STATUS.ERROR })
    }
  })
})
// 获取目录
router.get('/get-category', function (req, res) {
  Category.find(req.query, function (err, docs) {
    if (!err) res.send(docs)
  })
})
// 获取媒体文件
router.get('/get-media', function (req, res) {
  const { username, date } = req.query
  if (date === 'all') {
    Media.find({ username }, function (err, docs) {
      if (!err) res.send(docs)
    })
  } else {
    Media.find({ username, selectDate: date }, function (err, docs) {
      if (!err) res.send(docs)
    })
  }
})
// 获取媒体信息
router.get('/media-detail', function (req, res) {
  Media.findOne(req.query, function (err, docs) {
    if (!err) res.send(docs)
  })
})
// 获取媒体信息中的日期
router.get('/media-date', function (req, res) {
  Media.find(req.query, function (err, docs) {
    if (!err) res.send(docs)
  })
})
// 获取筛选的媒体
router.get('/media-search', function (req, res) {
  const { username, keywords } = req.query
  const _filter = {
    $or: [
      { file_name: { $regex: keywords, $options: '$i' } },
      { media_title: { $regex: keywords, $options: '$i' } }
    ]
  }
  Media.where({ username })
    .where(_filter)
    .exec(function (err, docs) {
      res.send(docs)
    })
})
// 获取筛选的目录
router.get('/category-search', function (req, res) {
  const { username, keywords } = req.query
  const _filter = {
    $or: [{ category: { $regex: keywords, $options: '$i' } }]
  }
  Category.where({ username })
    .where(_filter)
    .exec(function (err, docs) {
      res.send(docs)
    })
})

module.exports = router
