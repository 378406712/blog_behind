const express = require('express')
const router = express.Router()
const Essay = require('../../models/essay')
const ObjectId = require('mongodb').ObjectId
// 获取文章
router.get('/get-boke-essay', function (req, res) {
  const { username, _id } = req.query
  Essay.find({ username, _id: ObjectId(_id) }, function (err, docs) {
    if (!err) {
      res.send(...docs)
    } else {
      return
    }
  })
})

//暴露路由
module.exports = router
