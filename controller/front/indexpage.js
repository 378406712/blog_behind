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

//暴露路由
module.exports = router
