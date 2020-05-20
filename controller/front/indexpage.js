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
              console.log(arr)
              res.send(arr)
            }
          })
      })
  })
})

// 评论
router.post('/set-guest-comment', function (req, res) {
  console.log(req.body)
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
//暴露路由
module.exports = router
