const express = require('express')
const router = express.Router()
const Essay = require('../../models/essay')
const ObjectId = require('mongodb').ObjectId
// 获取文章
router.get('/get-boke-essay', function (req, res) {
  const { username, _id } = req.query
  let arr = []
  Essay.find({ username, _id: ObjectId(_id) }).exec(function (err, now) {
    arr.push({ now })
    Essay.find({ _id: { $lt: ObjectId(_id) } })
      .sort({ _id: -1 })
      .limit(1)
      .exec(function (err, previous) {
        if (!err) {
          arr.push({ previous })
        }
        Essay.find({ _id: { $gt: ObjectId(_id) } })
          .sort({ _id: 1 })
          .limit(1)
          .exec(function (err, next) {
            if (!err) {
              arr.push({ next })
              res.send(arr)
            }
          })
      })
  })
})
// 评论
router.post('/set-guest-comment', function (req, res) {
  Essay.findByIdAndUpdate(
    { _id: ObjectId(req.body._id) },
    { $push: { commentData: req.body } },
    { new: true },
    function (err, data) {
      if (!err) {
        res.send(data)
      }
    }
  )
})
// 搜索
router.get('/search-essay', function (req, res) {
  const { username, words } = req.query
  if (words === '') {
    Essay.find({ username, sended: true }, function (err, docs) {
      res.send(docs)
    })
  } else {
    const _filter = {
      $or: [
        { title: { $regex: words, $options: '$i' } },
        { essay: { $regex: words, $options: '$i' } }
      ]
    }
    Essay.where({ username }, { sended: true })
      .where(_filter)
      .exec(function (err, docs) {
        res.send(docs)
      })
  }
})
//获取归档
router.get('/time-axis', function (req, res) {
  console.log(req.query)
  Essay.find(req.query,function(err,docs){
    res.send(docs)
  })
})
//暴露路由
module.exports = router
