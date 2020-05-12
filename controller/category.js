const express = require('express')
const router = express()
const Category = require('../models/category')
const Essay = require('../models/essay')
const ObjectId = require('mongodb').ObjectId
const arrayDiffer = require('array-differ')
router.get('/get-essay', function (req, res) {
  Essay.find(req.query, function (err, docs) {
    res.send(docs)
  })
})
// 批量删除目录
router.post('/BatchDeleteCategory', function (req, res) {
  const _id = JSON.parse(req.body._id)
  let newData = []
  _id.map((item) => {
    newData.push(ObjectId(item))
  })
  new Promise((resolve, reject) => {
    //遍历点击的目录
    Essay.where({
      //查询含有该目录的文章
      username: req.body.username
    })
      .where('checkCategory')
      .in(req.body.category)
      .then((data) => {
        // 获取到该目录下的文章，遍历
        if (data.length === 0) return resolve()
        else {
          data.map((item) => {
            const before = req.body.category
            const after = item.checkCategory
            let diff = arrayDiffer(after, before)
            //目录下的文章
            //arrayDiffer数组diff拿到文章中目录与点击删除目录不同部分
            if (!diff.length) {
              //只存在一个目录下，肯定无差异，直接改为'未分类'
              Essay.findByIdAndUpdate(
                { _id: Object(item._id) },
                {
                  $set: {
                    //将原目录替换为差异目录，即删去了点击选择的目录(该文章在多个目录下情况)
                    checkCategory: '未分类'
                  }
                },
                function (err, docs) {
                  if (!err) resolve()
                }
              )
            } else if (diff.length) {
              //存在多个目录下,且有差异，删除所有目录
              Essay.findByIdAndUpdate(
                { _id: Object(item._id) },
                {
                  $set: {
                    checkCategory: diff //将原目录替换为差异目录，即删去了点击选择的目录(该文章在多个目录下情况)
                  }
                },
                function (err, docs) {
                  resolve()
                }
              )
            }
          })
        }
      })
  }).then(() => {
    Category.deleteMany(
      {
        _id: {
          $in: newData
        }
      },
      function (err, docs) {
        if (!err) {
          res.send(docs)
        }
      }
    )
  })
})
// 获取详细目录信息
router.get('/get-categoryDetail', function (req, res) {
  let { category } = req.query
  if (category) {
    Category.find({ category }, function (err, docs) {
      res.send(...docs)
    })
  }
})
// 更新目录
router.post('/alter-category', function (req, res) {
  const { _id, category, username } = req.body
  Category.findById({ _id: ObjectId(_id) }, function (err, docs) {
    Essay.where({
      //查询含有该目录的文章
      username: req.body.username
    })
      .where('checkCategory')
      .in(docs.category)
      .then((data) => {
        if (data.length !== 0) {
          data.map((item) => {
            let index = item.checkCategory.indexOf(...docs.category)
            if (index > -1) {
              item.checkCategory.splice(index, 1, category)
              Essay.updateOne(
                { username, checkCategory: docs.category },
                {
                  $set: {
                    checkCategory: item.checkCategory
                  }
                },
                function (err) {}
              )
            }
          })
        }
      })
      .then(() => {
        Category.findByIdAndUpdate(
          { _id: ObjectId(_id) },
          req.body,
          { new: true },
          function (err, docs) {
            return res.send(docs)
          }
        )
      })
  })
})
module.exports = router
