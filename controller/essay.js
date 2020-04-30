const express = require('express')
const router = express()
const Essay = require('../models/essay')
const ObjectId = require('mongodb').ObjectId
const STATUS = require('../common/const')

// 获取所有文章
router.get('/get-essay', function(req, res) {
  const { keywords, username } = req.query
  Essay.find({ username }, function(err, docs) {
    if (!err) res.send(docs)
  })
})
// 获取筛选的文章
router.get('/essay-search', function(req, res) {
  const { username, keywords } = req.query
  const _filter = {
    $or: [
      { title: { $regex: keywords, $options: '$i' } },
      { date: { $regex: keywords, $options: '$i' } }
    ]
  }
  Essay.where({ username })
    .where(_filter)
    .exec(function(err, docs) {
      res.send(docs)
    })
})
// 批量删除文章
router.post('/BatchDeleteEssay', function(req, res) {
  const _id = JSON.parse(req.body._id)
  let newData = []
  _id.map(item => {
    newData.push(ObjectId(item))
  })

  Essay.deleteMany(
    {
      _id: {
        $in: newData
      }
    },
    function(err, docs) {
      if (!err) {
        res.send({ status: STATUS.SUCCESS })
      }
    }
  )
})
// 获取文章信息中的日期
router.get('/essay-date', function(req, res) {
  Essay.find(req.query, function(err, docs) {
    if (!err) res.send(docs)
  })
})
module.exports = router
